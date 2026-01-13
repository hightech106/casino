/**
 * Crash game controller handling real-time crash game logic, betting, and cashouts.
 * Manages game rounds, provably fair randomness, player bets, and Socket.IO communication.
 * Integrates with GGR tracking and user balance management for crash game operations.
 */
import lodash from 'lodash';
import { Server, Socket } from 'socket.io';
import { AnyObject, Types } from 'mongoose';

import { generatePrivateSeedHashPair, generateCrashRandom } from '../utils/random';

import config from '../config';

import { CrashModel, GameHistoryModel, UserModel, GameRTPModel, GameGGRModel } from '../models';

import { ICrash } from '@models/game/crash.model';
import { IUser } from '@models/user/user.model';
import { sessionService, userService, gameService } from '@services/index';
import { saveGGR } from './ggr.controller';

import { Response, Request, NextFunction } from '../types/config.type';
import { IGameHistoryType, IPlayerBetProps, IFormattedType, IGameStateType, IGameType } from '../types/crash.type';

const GAME_TYPE = 'crash';

const objectId = (id: string): Types.ObjectId => {
    return new Types.ObjectId(id);
};

const TICK_RATE = 150;
const START_WAIT_TIME = 4000;
const RESTART_WAIT_TIME = 9000;

const growthFunc = (ms: number): number => Math.floor(100 * Math.pow(Math.E, 0.00012 * ms));
const inverseGrowth = (result: number): number => 16666.666667 * Math.log(0.01 * result);

// Declare game states
const GAME_STATES = {
    notStarted: 1,
    starting: 2,
    inProgress: 3,
    over: 4,
    blocking: 5,
    refunded: 6
};

const BET_STATES = {
    playing: 1,
    cashedOut: 2
};

// Declare game state
const GAME_STATE: IGameStateType = {
    _id: null,
    duration: 0,
    crashPoint: 0,
    pendingCount: 0,
    privateSeed: '',
    privateHash: '',
    publicSeed: '',
    players: {},
    pending: {},
    pendingBets: [],
    status: GAME_STATES.starting,
    startedAt: null
};

// Export state to external controllers
export const getCurrentGame = (): IGameType => formatGame(GAME_STATE);
export const getPrivateHash = (): null | string => GAME_STATE.privateSeed;

// Format a game
export const formatGame = (game: IGameStateType): IGameType => {
    const formatted: IGameType = {
        _id: game._id,
        status: game.status,
        startedAt: game.startedAt,
        elapsed: Date.now() - new Date(game.startedAt).valueOf(),
        players: lodash.map(game.players, (p) => formatPlayerBet(p)),
        privateHash: game.privateHash,
        publicSeed: game.publicSeed
    };
    if (game.status === GAME_STATES.over) {
        formatted.crashPoint = game.crashPoint;
    }
    return formatted;
};

// Format a game history
export const formatGameHistoryModel = (game: AnyObject): IGameHistoryType => ({
    _id: game._id,
    createdAt: game.createdAt,
    privateHash: game.privateHash,
    privateSeed: game.privateSeed,
    publicSeed: game.publicSeed,
    crashPoint: game.crashPoint / 100
});

// Format a game history
export const formatPlayersHistory = (game: AnyObject): IGameHistoryType => ({
    ...game.players
});

// Format a player bet
const formatPlayerBet = (bet: IPlayerBetProps): IFormattedType => {
    const formatted: IFormattedType = {
        playerID: bet.playerID,
        username: bet.username,
        first_name: bet.first_name,
        last_name: bet.last_name,
        avatar: bet.avatar,
        betAmount: bet.betAmount,
        currency: bet.currency,
        autoCashOut: bet.autoCashOut,
        currencyIcon: bet.currencyIcon,
        status: bet.status
    };

    if (bet.status !== BET_STATES.playing) {
        formatted.stoppedAt = bet.stoppedAt;
        formatted.winningAmount = bet.winningAmount;
    }
    return formatted;
};

// Calculate the current game payout
const calculateGamePayout = (ms: number): number => {
    const gamePayout = Math.floor(100 * growthFunc(ms)) / 100;
    return Math.max(gamePayout, 1);
};

// Get socket.io instance
export const crashSocket = (io: Server): void => {
    // Function to emit new player bets
    const _emitPendingBets = (): void => {
        const bets = GAME_STATE.pendingBets;
        GAME_STATE.pendingBets = [];

        io.of('/crash').emit('game-bets', bets);
    };

    const emitPlayerBets = lodash.throttle(_emitPendingBets, 600);

    // Creates a new game
    const createNewGame = async (): Promise<ICrash> => {
        try {
            // Generate pre-roll provably fair data
            const provablyData = await generatePrivateSeedHashPair();
            if (!provablyData) return;

            // Push game to db
            const newGame = new CrashModel({
                privateSeed: provablyData.seed,
                privateHash: provablyData.hash,
                players: {},
                status: GAME_STATES.starting
            });

            // Save the new document
            await newGame.save();

            return newGame;
        } catch (error) {
            console.error(`Crash >> Couldn't create a new game ${error}`);
        }
    };

    // Starts a new game
    const runGame = async (): Promise<void> => {
        const game = await createNewGame();

        // Override local state
        GAME_STATE._id = game._id;
        GAME_STATE.status = GAME_STATES.starting;
        GAME_STATE.privateSeed = game.privateSeed;
        GAME_STATE.privateHash = game.privateHash;
        GAME_STATE.publicSeed = null;
        GAME_STATE.startedAt = new Date(Date.now() + RESTART_WAIT_TIME);
        GAME_STATE.players = {};

        // Update startedAt in db
        game.startedAt = GAME_STATE.startedAt;

        await game.save();

        emitStarting();
    };

    // Emits the start of the game and handles blocking
    const emitStarting = (): void => {
        // Emiting starting to clients
        io.of('/crash').emit('game-starting', {
            _id: GAME_STATE._id,
            privateHash: GAME_STATE.privateHash,
            timeUntilStart: RESTART_WAIT_TIME
        });

        setTimeout(blockGame, RESTART_WAIT_TIME - 500);
    };

    // Block games for more bets
    const blockGame = (): void => {
        GAME_STATE.status = GAME_STATES.blocking;

        const loop = (): void => {
            // const ids = Object.keys(GAME_STATE.pending);
            if (GAME_STATE.pendingCount > 0) {
                setTimeout(loop, 50);
                return;
            }

            startGame();
        };

        loop();
    };

    // starting animation and enabling cashouts
    const startGame = async (): Promise<void> => {
        try {
            // Generate random data
            const randomData = await generateCrashRandom(GAME_STATE.privateSeed);

            if (!randomData) return;

            // Overriding game state
            GAME_STATE.status = GAME_STATES.inProgress;
            GAME_STATE.crashPoint = randomData.crashPoint;
            GAME_STATE.publicSeed = randomData.publicSeed;
            GAME_STATE.duration = Math.ceil(inverseGrowth(GAME_STATE.crashPoint + 1));
            GAME_STATE.startedAt = new Date();
            GAME_STATE.pending = {};
            GAME_STATE.pendingCount = 0;

            // Updating in db
            await CrashModel.updateOne(
                { _id: GAME_STATE._id },
                {
                    status: GAME_STATES.inProgress,
                    crashPoint: GAME_STATE.crashPoint,
                    publicSeed: GAME_STATE.publicSeed,
                    startedAt: GAME_STATE.startedAt
                }
            );

            // Emiting start to clients
            io.of('/crash').emit('game-start', {
                publicSeed: GAME_STATE.publicSeed
            });

            callTick(0);
        } catch (error) {
            console.error('Error while starting a crash game:', error);

            // Notify clients that we had an error
            io.of('/crash').emit('notify-error', "Our server couldn't connect to EOS Blockchain, retrying in 15s");

            // Timeout to retry
            const timeout = setTimeout(() => {
                // Retry starting the game
                startGame();

                clearTimeout(timeout);
            }, 15000);
        }
    };

    // Calculate next tick time
    const callTick = (elapsed: number): void => {
        // Calculate next tick
        const left = GAME_STATE.duration - elapsed;
        const nextTick = Math.max(0, Math.min(left, TICK_RATE));
        setTimeout(runTick, nextTick);
    };

    // Run the current tick
    const runTick = (): void => {
        // Calculate elapsed time
        const elapsed = new Date().valueOf() - new Date(GAME_STATE.startedAt).valueOf();
        const at = growthFunc(elapsed);

        // Completing all auto cashouts
        runCashOuts(at);

        // Check if crash point is reached
        if (at > GAME_STATE.crashPoint) {
            endGame();
        } else {
            tick(elapsed);
        }
    };

    // Handles auto cashout for users
    const runCashOuts = (elapsed: number): void => {
        lodash.each(GAME_STATE.players, (bet) => {
            // Check if bet is still active
            if (bet.status !== BET_STATES.playing) return;

            // Check if the auto cashout is reached or max profit is reached
            if (bet.autoCashOut >= 101 && bet.autoCashOut <= elapsed && bet.autoCashOut <= GAME_STATE.crashPoint) {
                doCashOut(bet.playerID.toString(), bet.autoCashOut, false, (err: AnyObject) => {
                    if (err) {
                        console.error(`Crash >> There was an error while trying to cashout`, err);
                    }
                });
            } else if (
                bet.betAmount * (elapsed / 100) >= config.games.crash.maxProfit &&
                elapsed <= GAME_STATE.crashPoint
            ) {
                doCashOut(bet.playerID.toString(), elapsed, true, (err: AnyObject) => {
                    if (err) {
                        console.error(`Crash >> There was an error while trying to cashout`, err);
                    }
                });
            }
        });
    };

    // Handle cashout request
    const doCashOut = async (
        playerID: string,
        elapsed: number,
        forced: boolean,
        cb: (error: AnyObject, result: IPlayerBetProps) => void
    ): Promise<void> => {
        // Check if bet is still active
        if (GAME_STATE.players[playerID].status !== BET_STATES.playing) return;

        // Update player state
        GAME_STATE.players[playerID].status = BET_STATES.cashedOut;
        GAME_STATE.players[playerID].stoppedAt = elapsed;
        if (forced) GAME_STATE.players[playerID].forcedCashout = true;

        const bet = GAME_STATE.players[playerID];

        // Calculate winning amount
        const winningAmount = parseFloat(
            (bet.betAmount * ((bet.autoCashOut === bet.stoppedAt ? bet.autoCashOut : bet.stoppedAt) / 100)).toFixed(2)
        );

        GAME_STATE.players[playerID].winningAmount = winningAmount;

        if (cb) cb(null, GAME_STATE.players[playerID]);

        const { status, stoppedAt } = GAME_STATE.players[playerID];

        // Emiting cashout to clients
        io.of('/crash').emit('bet-cashout', {
            playerID,
            status,
            stoppedAt,
            winningAmount
        });

        const state = Math.abs(winningAmount) >= bet.betAmount ? 'WIN' : 'DRAW';

        // Giving winning balance to user
        // const userData = await userService.handleBalance(playerID, winningAmount, state, GAME_TYPE, GAME_STATE._id.toString());

        // // insertNewWalletTransaction(playerID, Math.abs(winningAmount), 'Crash win', {
        // //   crashGameId: GAME_STATE._id
        // // });

        // // Update local wallet
        // io.of('/crash').to(playerID.toString()).emit('update-balance', userData.balance);

        // // Updating in db
        // const updateParam: AnyObject = { $set: {} };
        // updateParam.$set['players.' + playerID] = GAME_STATE.players[playerID];

        // await CrashModel.updateOne({ _id: GAME_STATE._id }, updateParam);

        // const history_data = {
        //     user: playerID,
        //     gameid: GAME_STATE._id,
        //     type: 'crash',
        //     bet: GAME_STATE.players[playerID].betAmount,
        //     target: GAME_STATE.players[playerID].stoppedAt / 100,
        //     payout: winningAmount
        // };

        // const history = new GameHistoryModel(history_data);
        // const added = await history.save();
        // io.of('/crash').emit('game-end-history', [added]);

        let adjustedWinningAmount = winningAmount;
        const { input, output } = await gameService.getProfit(GAME_TYPE);
        const totalInput = input;
        const totalOutput = output;
        const rtpConfig = await GameRTPModel.findOne({ game_type: GAME_TYPE });
        const targetRTP = rtpConfig?.rtp ?? 96;
        const newTotalOutput = totalOutput + winningAmount;
        const newTotalInput = totalInput + bet.betAmount;
        const newRTP = newTotalInput > 0 ? (newTotalOutput / newTotalInput) * 100 : 0;
        if (newRTP > targetRTP && winningAmount > 0) {
            // adjustedWinningAmount = 0;
        }

        console.log('crash.controller.ts:394', playerID, adjustedWinningAmount, state, GAME_TYPE, GAME_STATE._id.toString());
        // Giving winning balance to user
        const userDataAdjusted = await userService.handleBalance(playerID, adjustedWinningAmount, state, GAME_TYPE, GAME_STATE._id.toString());

        // insertNewWalletTransaction(playerID, Math.abs(adjustedWinningAmount), 'Crash win', {
        //   crashGameId: GAME_STATE._id
        // });

        // Update local wallet
        io.of('/crash').to(playerID.toString()).emit('update-balance', userDataAdjusted.balance);

        // Updating in db
        const updateParamAdjusted: AnyObject = { $set: {} };
        updateParamAdjusted.$set['players.' + playerID] = GAME_STATE.players[playerID];

        await CrashModel.updateOne({ _id: GAME_STATE._id }, updateParamAdjusted);

        const history_data_adjusted = {
            user: playerID,
            gameid: GAME_STATE._id,
            type: 'crash',
            bet: GAME_STATE.players[playerID].betAmount,
            target: GAME_STATE.players[playerID].stoppedAt / 100,
            payout: adjustedWinningAmount
        };

        const history_adjusted = new GameHistoryModel(history_data_adjusted);
        const added_adjusted = await history_adjusted.save();
        io.of('/crash').emit('game-end-history', [added_adjusted]);

        // Save GGR data
        await saveGGR(GAME_TYPE, bet.betAmount, adjustedWinningAmount);
    };

    // Handle end request
    const endGame = async (): Promise<void> => {
        const crashTime = Date.now();

        GAME_STATE.status = GAME_STATES.over;

        // Notify clients
        io.of('/crash').emit('game-end', {
            game: formatGameHistoryModel(GAME_STATE)
        });

        const new_histories = [];

        for (const key in GAME_STATE.players) {
            if (Object.prototype.hasOwnProperty.call(GAME_STATE.players, key)) {
                const player = GAME_STATE.players[key];
                if (player.status === 1) {
                    const history_data = {
                        user: objectId(player.playerID),
                        gameid: GAME_STATE._id,
                        type: 'crash',
                        bet: player.betAmount,
                        target: player.autoCashOut / 100,
                        payout: -player.betAmount
                    };

                    const history = new GameHistoryModel(history_data);
                    const added = await history.save();

                    new_histories.push(added);
                }
            }
        }

        if (new_histories.length) io.of('/crash').emit('game-end-history', new_histories);

        // Run new game after start wait time
        setTimeout(() => {
            runGame();
        }, crashTime + START_WAIT_TIME - Date.now());

        // Updating in db
        await CrashModel.updateOne(
            { _id: GAME_STATE._id },
            {
                status: GAME_STATES.over
            }
        );
    };

    // Emits game tick to client
    const tick = (elapsed: number): void => {
        io.of('/crash').emit('game-tick', calculateGamePayout(elapsed) / 100);
        callTick(elapsed);
    };

    // Handle refunds of old unfinished games
    const refundGames = async (games: ICrash[]): Promise<void> => {
        try {
            for (const game of games) {
                const refundedPlayers = [];

                for (const playerID in game.players) {
                    const bet = game.players[playerID];

                    if (bet.status == BET_STATES.playing) {
                        // Push Player ID to the refunded players
                        refundedPlayers.push(playerID);

                        // Refund player
                        await userService.handleBalance(playerID, bet.betAmount, 'DRAW', GAME_TYPE, game._id.toString());
                    }
                }

                game.refundedPlayers = refundedPlayers;
                game.status = GAME_STATES.refunded;
                await game.save();
            }
        } catch (error) {
            console.error(`Crash >> Error while refunding crash game ${GAME_STATE._id}: ${error}`);
        }
    };

    // Refunds old unfinished games and inits new one
    const initGame = async (): Promise<void> => {
        const unfinishedGames = await CrashModel.find({
            $or: [
                { status: GAME_STATES.starting },
                { status: GAME_STATES.blocking },
                { status: GAME_STATES.inProgress }
            ]
        });

        if (unfinishedGames.length > 0) await refundGames(unfinishedGames);

        runGame();
    };

    // Init the gamemode
    initGame();

    // Listen for new websocket connections
    io.of('/crash').on('connection', (socket: Socket) => {
        console.log('---------Crash connected---------');

        let loggedIn = false;
        let user: IUser | null = null;

        // Authenticate websocket connection
        socket.on('auth', async (token: string) => {
            if (!token) {
                loggedIn = false;
                user = null;
                return socket.emit('error', 'No authentication token provided, authorization declined');
            }

            try {
                const session = await sessionService.getSession(token);
                if (!session) {
                    return socket.emit('error', 'No authentication token provided, authorization declined');
                }
                user = await UserModel.findOne({ _id: session.userId });
                if (user) {
                    loggedIn = true;
                    socket.join(String(user._id));
                }
            } catch (error) {
                loggedIn = false;
                user = null;
                return socket.emit('notify-error', 'Authentication token is not valid');
            }
        });

        socket.on('disconnect', async () => {
            console.log('Crash socket disconnected');
        });

        /**
         * @description Join a current game
         *
         * @param {number} target Auto cashout target
         * @param {number} betAmount Bet amount
         */
        socket.on('join-game', async (target: number | null, betAmount: number) => {
            console.log('🚀 ~ io.of ~ joinGame:', loggedIn);
            // Validate user input
            if (typeof betAmount !== 'number' || isNaN(betAmount))
                return socket.emit('game-join-error', 'Invalid betAmount type!');
            if (!loggedIn) return socket.emit('game-join-error', 'You are not logged in!');

            // More validation on the bet value
            const { minBetAmount, maxBetAmount } = config.games.crash;
            if (parseFloat(betAmount.toFixed(2)) < minBetAmount || parseFloat(betAmount.toFixed(2)) > maxBetAmount) {
                return socket.emit(
                    'game-join-error',
                    `Your bet must be a minimum of ${minBetAmount} credits and a maximum of ${maxBetAmount} credits!`
                );
            }

            // Check if game accepts bets
            if (GAME_STATE.status !== GAME_STATES.starting)
                return socket.emit('game-join-error', 'Game is currently in progress!');
            // Check if user already betted
            if (GAME_STATE.pending[user._id] || GAME_STATE.players[user._id])
                return socket.emit('game-join-error', 'You have already joined this game!');

            let autoCashOut = -1;

            // Validation on the target value, if acceptable assign to auto cashout
            if (typeof target === 'number' && !isNaN(target) && target > 100) {
                autoCashOut = target;
            }

            GAME_STATE.pending[String(user._id)] = {
                betAmount,
                autoCashOut,
                username: user.username
            };

            GAME_STATE.pendingCount++;

            try {
                // Get user from database
                const dbUser = await UserModel.findOne({ _id: user._id });

                // If user can afford this bet
                if (dbUser.balance < parseFloat(betAmount.toFixed(2))) {
                    delete GAME_STATE.pending[user._id];
                    GAME_STATE.pendingCount--;
                    return socket.emit('game-join-error', 'Your balance is not enough!');
                }

                // Remove bet amount from user's balance
                const userData1 = await userService.handleBalance(user._id, betAmount, 'BET', GAME_TYPE, GAME_STATE._id.toString());

                // Update local wallet
                socket.emit('update-balance', userData1.balance);

                // Creating new bet object
                const newBet = {
                    autoCashOut,
                    betAmount,
                    createdAt: new Date(),
                    playerID: user._id,
                    username: user.username,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    currency: user.currency,
                    currencyIcon: user.currencyIcon,
                    avatar: user.avatar,
                    status: BET_STATES.playing,
                    forcedCashout: false
                };

                // Updating in db
                const updateParam: AnyObject = { $set: {} };
                updateParam.$set['players.' + user._id] = newBet;
                await CrashModel.updateOne({ _id: GAME_STATE._id }, updateParam);

                // Assign to state
                GAME_STATE.players[user._id] = newBet;
                GAME_STATE.pendingCount--;
                const formattedBet = formatPlayerBet(newBet);
                GAME_STATE.pendingBets.push(formattedBet);
                emitPlayerBets();

                return socket.emit('game-join-success', formattedBet);
            } catch (error) {
                console.log('🚀 ~ crash socket.on ~ error:', error);
                delete GAME_STATE.pending[user._id];
                GAME_STATE.pendingCount--;

                return socket.emit('game-join-error', 'There was an error while proccessing your bet');
            }
        });

        /**
         * @description Cashout the current bet
         */
        socket.on('bet-cashout', async () => {
            if (!loggedIn) return socket.emit('bet-cashout-error', 'You are not logged in!');

            // Check if game is running
            if (GAME_STATE.status !== GAME_STATES.inProgress)
                return socket.emit('bet-cashout-error', 'There is no game in progress!');

            // Calculate the current multiplier
            const elapsed = new Date().valueOf() - new Date(GAME_STATE.startedAt).valueOf();
            let at = growthFunc(elapsed);

            // Check if cashout is over 1x
            if (at < 101) return socket.emit('bet-cashout-error', 'The minimum cashout is 1.01x!');

            // Find bet from state
            const bet = GAME_STATE.players[user._id];

            // Check if bet exists
            if (!bet) return socket.emit('bet-cashout-error', "Coudn't find your bet!");

            // Check if the current multiplier is over the auto cashout
            if (bet.autoCashOut > 100 && bet.autoCashOut <= at) {
                at = bet.autoCashOut;
            }

            // Check if current multiplier is even possible
            if (at > GAME_STATE.crashPoint) return socket.emit('bet-cashout-error', 'The game has already ended!');

            // Check if user already cashed out
            if (bet.status !== BET_STATES.playing)
                return socket.emit('bet-cashout-error', 'You have already cashed out!');

            // Send cashout request to handler
            doCashOut(bet.playerID.toString(), at, false, (err: AnyObject, result: IPlayerBetProps) => {
                if (err) {
                    console.error(`Crash >> There was an error while trying to cashout a player`, err);
                    return socket.emit('bet-cashout-error', 'There was an error while cashing out!');
                }

                socket.emit('bet-cashout-success', result);
            });
        });
    });
};

export const getCrash = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Get active game
        const history = await CrashModel.find({
            status: 4
        })
            .sort({ created: -1 })
            .limit(35);

        // Get current games
        const current = getCurrentGame();

        res.json({
            current,
            history: history.map(formatGameHistoryModel),
            options: lodash.pick(config.games.crash, 'maxProfit')
        });
    } catch (error) {
        next(error);
    }
};

export const getUserCrashData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Get current games
        const current = await getCurrentGame();

        // Check players array for user bet
        const userBet = lodash.find(current.players, { playerID: req.userId });

        res.json({
            bet: userBet ? userBet : null
        });
    } catch (error) {
        next(error);
    }
};

export const getServerCrashData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Get current games
        const current = getCurrentGame();
        const privateHash = getPrivateHash();

        res.json({
            ...current,
            privateHash
        });
    } catch (error) {
        next(error);
    }
};

export const getHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        const history = await GameHistoryModel.find().sort({ _id: -1 }).limit(10);

        res.json(history);
    } catch (error) {
        res.status(400).json('Interanal server error');
    }
};
