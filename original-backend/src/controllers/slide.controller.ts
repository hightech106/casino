/**
 * Slide game controller for managing real-time slide betting games with target multipliers.
 * Handles game rounds, player betting, provably fair randomness, and Socket.IO communication.
 * Integrates with GGR tracking and user balance management for slide game operations.
 */
import { Schema } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { GameHistoryModel, SlideModel, UserModel, GameRTPModel } from '@models/index';
import { IUser } from '@models/user/user.model';
import { IPlayer } from '@models/game/slide.model';
import { sessionService, userService, gameService } from '@services/index';
import { saveGGR } from './ggr.controller';

import { getPublicSeed } from '@utils/blockchain';
import { generateCrashRandom, generatePrivateSeedHashPair, generateSeed } from '@utils/random';
import { Response, Request } from '../types/config.type';
const GAME_TYPE = 'slide';

enum STATUS {
    WAITTING,
    STARTING,
    BETTING,
    PLAYING
}

const STATING_TIME = 1000;
const BETTING_TIME = 20000;
const PLAYING_TIME = 10000;

class GameEngine {
    io: Server;
    status: STATUS;

    players: IPlayer[] = [];

    privateSeed: string;
    privateHash: string;
    publicSeed: string;
    crashPoint: number;

    gameId: Schema.Types.ObjectId | any;

    constructor(io: any) {
        SlideModel.find({ status: 'BET' }).then((games) => {
            games.forEach((game) => {
                const players = game.players.map((p) => {
                    return {
                        ...p,
                        status: 'REFUND'
                    };
                });

                SlideModel.findByIdAndUpdate(game._id, {
                    players,
                    status: 'CANCELED'
                });
            });
        });

        this.status = STATUS.WAITTING;
        this.io = io;
        this.handle_status(STATUS.STARTING);
    }

    handle_status(status: STATUS) {
        this.status = status;
        switch (this.status) {
            case STATUS.WAITTING:
                break;
            case STATUS.STARTING:
                this.initGame();
                break;
            case STATUS.BETTING:
                this.startGame();
                break;
            case STATUS.PLAYING:
                this.showResult();
                break;
        }
    }

    async joinbet(player: IUser, betAmount: number, target: number, socket: Socket) {
        if (this.status !== STATUS.BETTING) {
            return socket.emit('game-join-error', { msg: 'Betting failed' });
        }

        const index = this.players.findIndex((p) => p.playerID === player._id);
        if (index !== -1) {
            return socket.emit('game-join-error', { msg: 'Already Joined' });
        }

        const me = await UserModel.findById(player._id);
        if (!me) {
            return socket.emit('game-join-error', { msg: 'User not found' });
        }

        if (betAmount > me.balance) {
            return socket.emit('game-join-error', { msg: 'Balance not enough' });
        }

        this.players.push({
            playerID: player._id,
            betAmount,
            target,
            username: me.username,
            first_name: me.first_name,
            last_name: me.last_name,
            avatar: me.avatar,
            currency: me.currency,
            currencyIcon: me.currencyIcon,
            status: 'BET'
        });

        socket.emit('bet', [
            {
                playerID: player._id,
                betAmount,
                avatar: me.avatar,
                username: me.username,
                first_name: me.first_name,
                last_name: me.last_name,
                currency: me.currency,
                currencyIcon: me.currencyIcon,
                target
            }
        ]);

        await userService.handleBalance(player._id, betAmount, 'BET', GAME_TYPE, this.gameId.toString());

        const queryh = {
            gameid: this.gameId,
            user: player._id,
            bet: betAmount,
            target,
            payout: 0,
            type: GAME_TYPE
        };

        await GameHistoryModel.create(queryh);

        this.updateBalance(player._id, -betAmount, me.currency, 'BET');
        return socket.emit('game-join-sucess', { msg: 'success' });
    }

    async initGame() {
        const provablyData = await generatePrivateSeedHashPair();

        if (!provablyData) return;

        this.players = [];
        this.privateSeed = provablyData.seed;
        this.privateHash = provablyData.hash;
        this.publicSeed = await getPublicSeed();

        this.io.emit('slide-track', {
            _id: this.gameId,
            crashPoint: this.crashPoint / 100,
            privateHash: this.privateHash,
            publicSeed: this.publicSeed,
            status: STATUS.STARTING,
            players: this.players
        });
        setTimeout(() => {
            this.handle_status(STATUS.BETTING);
        }, STATING_TIME);
    }

    async startGame() {
        // Generate random data
        const randomData = await generateCrashRandom(this.privateSeed, this.publicSeed);
        if (!randomData) {
            return;
        }

        this.crashPoint = randomData?.crashPoint;

        this.io.emit('slide-track', {
            privateHash: this.privateHash,
            publicSeed: this.publicSeed,
            status: STATUS.BETTING,
            players: this.players
        });

        const game = new SlideModel({
            privateHash: this.privateHash,
            publicSeed: this.publicSeed,
            privateSeed: this.privateSeed,
            players: this.players,
            status: 'BET',
            crashPoint: this.crashPoint / 100,
            startedAt: new Date()
        });
        await game.save();
        this.gameId = game._id;

        setTimeout(() => {
            this.handle_status(STATUS.PLAYING);
        }, BETTING_TIME);
    }

    async showResult() {
        const numbers = [];

        for (let i = 0; i < 89; i++) {
            const publicSeed = generateSeed();
            const randomData = await generateCrashRandom(this.privateSeed, publicSeed);
            numbers.push((randomData?.crashPoint || 100) / 100);
        }

        const players = [];
        let totalBets = 0;
        let totalWins = 0;
        
        for (let i = 0; i < this.players.length; i++) {
            const player: IPlayer = this.players[i];
            let amount = 0;
            totalBets += player.betAmount;
            
            if (player.target <= this.crashPoint / 100) {
                amount = player.betAmount * player.target;
                // RTP LOGIC
                const { input, output } = await gameService.getProfit(GAME_TYPE);
                const totalInput = input;
                const totalOutput = output;
                const rtpConfig = await GameRTPModel.findOne({ game_type: GAME_TYPE });
                const targetRTP = rtpConfig?.rtp ?? 96;
                const newTotalOutput = totalOutput + amount;
                const newTotalInput = totalInput + player.betAmount;
                const newRTP = newTotalInput > 0 ? (newTotalOutput / newTotalInput) * 100 : 0;
                if (newRTP > targetRTP) {
                    amount = 0;
                    this.players[i].status = 'LOST';
                } else {
                    totalWins += amount;
                }

                await userService.handleBalance(player.playerID, amount, 'WIN', GAME_TYPE, this.gameId.toString());

                this.updateBalance(player.playerID, amount, player.currency, 'WIN');
                this.players[i].status = 'WIN';
                players.push({ ...this.players[i], stoppedAt: this.players[i].target * 100 });
            } else {
                this.players[i].status = 'LOST';
                players.push({ ...this.players[i] });
            }

            await GameHistoryModel.updateOne({ user: player.playerID, gameid: this.gameId }, { payout: amount });
        }

        // Save GGR data
        await saveGGR(GAME_TYPE, totalBets, totalWins);

        const game = await SlideModel.findById(this.gameId);
        if (game) {
            game.players = this.players;
            game.status = 'END';
            await game.save();
            this.io.emit('slide-track', {
                _id: this.gameId,
                privateHash: this.privateHash,
                publicSeed: game.publicSeed,
                privateSeed: game.privateSeed,
                status: STATUS.PLAYING,
                players: players,
                crashPoint: this.crashPoint / 100,
                numbers
            });
        }

        setTimeout(() => {
            this.handle_status(STATUS.STARTING);
        }, PLAYING_TIME);
    }

    updateBalance(userId: string, amount: number, currencyId: string, type: string) {
        console.log(type, '===>', userId, amount, currencyId);
    }
}

export const slideSocket = (io: Server): void => {
    const so = io.of('/slide');
    const gameEngine = new GameEngine(so);
    so.on('connection', (socket: Socket) => {
        console.log('---------Slide connected---------');

        let loggedIn = false;
        let user: IUser | null = null;

        const authenticate = async (token: string) => {
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
        };

        const joinGame = async (target: number, betAmount: number, currencyId: string) => {
            console.log('join-game', target);
            if (!loggedIn) return socket.emit('error', 'No authentication token provided, authorization declined');

            gameEngine.joinbet(user, Number(betAmount), Number(target || 0), socket);
        };

        const getGamesSocket = async () => {
            socket.emit('slide-track', {
                privateHash: gameEngine.privateHash,
                publicSeed: gameEngine.publicSeed,
                status: gameEngine.status,
                players: gameEngine.players,
                crashPoint: gameEngine.crashPoint / 100,
                numbers: []
            });

            const history = await SlideModel.find({ status: { $ne: 'BET' } })
                .sort({ createdAt: -1 })
                .skip(0)
                .limit(10)
                .select({
                    _id: 1,
                    startedAt: 1,
                    privateSeed: 1,
                    publicSeed: 1,
                    crashPoint: 1
                });

            socket.emit(
                'history',
                history.map((h) => {
                    return {
                        _id: h._id,
                        resultpoint: h.crashPoint,
                        startedAt: h.startedAt
                    };
                })
            );
        };

        socket.on('auth', authenticate);
        socket.on('join-game', joinGame);
        socket.on('games', getGamesSocket);
    });
};

export const getGame = async (req: Request, res: Response) => {
    try {
        const gameId = req.params.id;
        const game = await SlideModel.findById(gameId).select({ _id: 1, status: 0 });
        if (game && game?.status !== 'BET') {
            res.status(200).json({
                _id: game._id,
                players: game.players.map((p) => {
                    return {
                        ...p,
                        stoppedAt: p.status == 'WIN' ? p.target * 100 : 0
                    };
                }),
                publicSeed: game.publicSeed,
                privateSeed: game.privateSeed,
                crashPoint: game.crashPoint,
                startedAt: game.startedAt
            });
        } else {
            res.status(400).json({
                msg: "The game isn't over yet."
            });
        }
    } catch (error) {
        res.status(400).json(error);
    }
};

export const getGames = async (req: Request, res: Response) => {
    try {
        const { skip = 0, limit = 10 }: { skip?: number; limit?: number } = req.query;
        const history = await SlideModel.find({ status: { $ne: 'BET' } })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select({
                _id: 1,
                startedAt: 1,
                privateSeed: 1,
                publicSeed: 1,
                crashPoint: 1
            });
        res.status(200).json(
            history.map((h) => {
                return {
                    _id: h._id,
                    crashPoint: h.crashPoint,
                    startedAt: h.startedAt
                };
            })
        );
    } catch (error) {
        res.status(400).json(error);
    }
};
