/**
 * Multiplayer Hi-Lo game controller for managing real-time Hi-Lo card games.
 * Handles game rounds, player bets, card sequences, provably fair randomness, and Socket.IO communication.
 * Integrates with RTP configuration and GGR tracking for multiplayer Hi-Lo operations.
 */
import jwt from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import { GameHistoryModel, HiloMModel, UserModel, GameRTPModel, GameGGRModel } from '@models/index';
import { IUser } from '@models/user/user.model';
import { sessionService, userService, gameService } from '@services/index';
import { saveGGR } from './ggr.controller';

import { generateSeed, seedHash } from '@utils/random';
import { Payload } from '@root/types/config.type';
import config from '../config';
import { IBetType, ICard, IGameResult, IRank, ISuit } from '@root/types/hilo.type';

const GAME_TYPE = 'hilo_multi';

const multipliers: { [key in IRank]: { [key2 in 'Lower' | 'Higher']: number } } = {
    A: {
        Lower: 12.87,
        Higher: 1.073
    },
    '2': {
        Higher: 1.073,
        Lower: 6.435
    },
    '3': {
        Higher: 1.17,
        Lower: 4.29
    },
    '4': {
        Higher: 1.287,
        Lower: 3.217
    },
    '5': {
        Higher: 1.43,
        Lower: 2.574
    },
    '6': {
        Higher: 1.609,
        Lower: 2.145
    },
    '7': {
        Higher: 1.839,
        Lower: 1.839
    },
    '8': {
        Higher: 2.145,
        Lower: 1.609
    },
    '9': {
        Higher: 2.574,
        Lower: 1.43
    },
    '10': {
        Higher: 3.217,
        Lower: 1.287
    },
    J: {
        Higher: 4.29,
        Lower: 1.17
    },
    Q: {
        Higher: 6.435,
        Lower: 1.073
    },
    K: {
        Higher: 12.87,
        Lower: 1.073
    },
    Joker: {
        Higher: 0,
        Lower: 0
    }
};

const multipliers2 = {
    black: 2.0,
    red: 2.0,
    range_2_9: 1.5,
    range_j_q_k_a: 3.0,
    range_k_a: 6.0,
    a: 12.0
    // "joker": 24.00
};
const RANKS: IRank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'Joker'];

enum GameStatus {
    WATTING,
    BETTING,
    CALCULATIONG
}

const blackSuits: ISuit[] = ['Clubs', 'Spades'];
const redSuits: ISuit[] = ['Hearts', 'Diamonds'];

const bettingTime = 10000;
const calculatingTime = 10000;

export class GameEngine {
    public status: GameStatus = GameStatus.WATTING;
    public startCard: ICard = this.getCard('', '');
    public privateSeed: string;
    public publicSeed: string;
    public dt: number;

    io: Server;
    constructor(io: any) {
        this.io = io;
        this.handleStatus(GameStatus.WATTING);
    }

    // Generate a random card with value and suit
    public getCard(privateSeed: string, publicSeed: string): ICard {
        const combinedHash = seedHash(privateSeed + publicSeed);

        const cardRank = parseInt(combinedHash.slice(0, 8), 16) % 13; // 0-12 = A-k
        const suitIndex = parseInt(combinedHash.slice(8, 10), 16) % 4;

        const suit = (['Clubs', 'Spades', 'Hearts', 'Diamonds'] as ISuit[])[suitIndex]; // No suit for Joker

        return { rank: RANKS[cardRank], suit };
    }

    getCardRankValue(card: ICard): number {
        const rankValueMap: { [key in IRank]: number } = {
            A: 1,
            '2': 2,
            '3': 3,
            '4': 4,
            '5': 5,
            '6': 6,
            '7': 7,
            '8': 8,
            '9': 9,
            '10': 10,
            J: 11,
            Q: 12,
            K: 13,
            Joker: 14
        };
        return rankValueMap[card.rank];
    }
    // Evaluate the bet outcome
    public evaluateBet(prevCard: ICard, card: ICard, betType: IBetType): IGameResult {
        switch (betType) {
            case 'hi':
                return this.getCardRankValue(card) >= this.getCardRankValue(prevCard) ? 'WIN' : 'LOST';
            case 'low':
                return this.getCardRankValue(card) <= this.getCardRankValue(prevCard) ? 'WIN' : 'LOST';
            case 'black':
                return this.isBlack(card.suit) ? 'WIN' : 'LOST';
            case 'red':
                return this.isRed(card.suit) ? 'WIN' : 'LOST';
            case 'range_2_9':
                return this.getCardRankValue(card) >= 2 && this.getCardRankValue(card) <= 9 ? 'WIN' : 'LOST';
            case 'range_j_q_k_a':
                return this.getCardRankValue(card) >= 11 ? 'WIN' : 'LOST';
            case 'range_k_a':
                return this.getCardRankValue(card) === 13 || this.getCardRankValue(card) === 1 ? 'WIN' : 'LOST';
            case 'a':
                return this.getCardRankValue(card) === 1 ? 'WIN' : 'LOST';
            case 'joker':
                return card.rank === 'Joker' ? 'WIN' : 'LOST';
            default:
                return 'LOST';
        }
    }

    public getMultiplier(betType: IBetType, card: ICard): number {
        switch (betType) {
            case 'hi':
            case 'low':
                // if (card.rank == 0)
                //     return multipliers2["joker"];
                // else {
                // eslint-disable-next-line no-case-declarations
                const m: any = multipliers[card.rank];
                return betType === 'hi' ? m['Higher'] : m['Lower'];
            // }
            case 'black':
            case 'red':
            case 'range_2_9':
            case 'range_j_q_k_a':
            case 'range_k_a':
            case 'a':
                // case 'joker':
                return multipliers2[betType];
            default:
                return 0;
        }
    }

    // Check if the card's suit is black
    private isBlack(suit?: ISuit): boolean {
        return suit ? blackSuits.includes(suit) : false;
    }

    // Check if the card's suit is red
    private isRed(suit?: ISuit): boolean {
        return suit ? redSuits.includes(suit) : false;
    }

    private async createGame(): Promise<void> {
        try {
            const game = await HiloMModel.findOne({ status: 'BET' });
            const prevGame = await HiloMModel.findOne({ status: 'END' }).sort({ createdAt: -1 });
            if (prevGame) {
                this.startCard = this.getCard(prevGame.privateSeed, prevGame.publicSeed);
            } else {
                this.startCard = this.getCard(generateSeed(), generateSeed());
            }
            if (game) {
                this.io.emit('game-start', {
                    publicSeed: game.publicSeed,
                    privateSeedHash: game.privateSeed,
                    bets: game.bets,
                    startCard: this.startCard
                });
            } else {
                this.privateSeed = generateSeed();
                this.publicSeed = generateSeed();

                await HiloMModel.create({
                    privateSeed: this.privateSeed,
                    publicSeed: this.publicSeed,
                    startCard: this.startCard,
                    bets: [],
                    status: 'BET'
                });
                this.io.emit('game-start', {
                    publicSeed: this.publicSeed,
                    privateSeedHash: seedHash(this.privateSeed),
                    bets: [],
                    startCard: this.startCard
                });
            }
            this.handleStatus(GameStatus.BETTING);
        } catch (error) {
            console.log(error);
        }
    }

    private async gameEnd(): Promise<void> {
        const game = await HiloMModel.findOne({ status: 'BET' });
        if (!game) return;

        const bets = game.bets;
        const privateSeed = game.privateSeed;
        const publicSeed = game.publicSeed;
        const card = this.getCard(privateSeed, publicSeed);
        for (let i = 0; i < bets.length; i++) {
            const bet = bets[i];
            // handleBalance(bet.userId, -bet.amount, bet.currency, "BET");
            await userService.handleBalance(bet.userId, bet.amount, 'BET', GAME_TYPE, game._id.toString());

            const queryh = {
                gameid: game._id,
                user: bet.userId,
                bet: bet.amount,
                target: 0,
                payout: 0,
                type: GAME_TYPE
            };

            await GameHistoryModel.create(queryh);

            const result = this.evaluateBet(card, this.startCard, bet.betType);
            bets[i].status = result;
            if (result === 'WIN') {
                const multiplier = this.getMultiplier(bet.betType, card);
                let winAmount = bet.amount * multiplier;
                // RTP LOGIC
                const { input, output } = await gameService.getProfit(GAME_TYPE);
                const totalInput = input;
                const totalOutput = output;
                const rtpConfig = await GameRTPModel.findOne({ game_type: GAME_TYPE });
                const targetRTP = rtpConfig?.rtp ?? 96;
                const newTotalOutput = totalOutput + winAmount;
                const newTotalInput = totalInput + bet.amount;
                const newRTP = newTotalInput > 0 ? (newTotalOutput / newTotalInput) * 100 : 0;
                if (newRTP >= targetRTP) {
                    bets[i].status = 'LOST';
                    bets[i].profit = -bet.amount;
                    bets[i].multiplier = 0;
                    winAmount = 0;
                } else {
                    bets[i].status = 'WIN';
                    bets[i].multiplier = multiplier;
                    winAmount = bet.amount * multiplier;
                    bets[i].profit = winAmount - bet.amount;
                }
                // handleBalance(bet.userId, bets[i].profit, bet.currency, "WIN");
                await userService.handleBalance(bet.userId, bets[i].profit, 'WIN', GAME_TYPE, game._id.toString());
                await GameHistoryModel.updateOne(
                    { gameid: game._id, user: bet.userId },
                    { target: bets[i].multiplier, payout: winAmount }
                );
            }
        }

        // Save GGR data for the game
        const totalBets = bets.reduce((sum, bet) => sum + bet.amount, 0);
        const totalWins = bets.reduce((sum, bet) => sum + (bet.profit > 0 ? bet.profit + bet.amount : 0), 0);
        await saveGGR(GAME_TYPE, totalBets, totalWins);

        await HiloMModel.findByIdAndUpdate(game._id, {
            status: 'END',
            bets
        });
        this.io.emit('game-end', {
            publicSeed: publicSeed,
            privateSeed: privateSeed,
            card,
            bets
        });
    }

    public async placeBet(
        userId: string,
        avatar: string,
        amount: number,
        currency: string,
        betType: IBetType,
        socket: Socket
    ) {
        try {
            if (this.status !== GameStatus.BETTING)
                return socket.emit('place-bet', { status: false, msg: 'game status error' });
            const game = await HiloMModel.findOne({ status: 'BET' });
            if (game) {
                const index = game.bets.findIndex((b) => b.userId === userId);
                if (index !== -1) {
                    return socket.emit('place-bet', { status: false, msg: 'bet failed' });
                }
                game.bets.push({
                    userId,
                    avatar,
                    amount,
                    currency,
                    multiplier: 0,
                    betType,
                    profit: -amount,
                    status: 'BET'
                });
                await game.save();
                socket.emit('place-bet', { status: true, betType, msg: 'Betting success' });
                this.io.emit('bet', {
                    userId,
                    amount,
                    avatar,
                    currency,
                    betType,
                    status: 'BET'
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    public async cancelBet(userId: string, socket: Socket) {
        try {
            if (this.status !== GameStatus.BETTING)
                return socket.emit('place-bet', { status: false, msg: 'game status error' });
            const game = await HiloMModel.findOne({ status: 'BET' });
            if (game) {
                const index = game.bets.findIndex((b) => b.userId === userId);
                if (index === -1) {
                    return socket.emit('cancel-bet', { status: false, msg: 'Cancellation failed' });
                }
                game.bets.splice(index, 1);
                await game.save();
                socket.emit('cancel-bet', { status: true, msg: 'Successfully cancelled' });
                this.io.emit('bet-cancel', { userId });
            }
        } catch (error) {
            console.log(error);
        }
    }

    handleStatus(status: GameStatus) {
        this.dt = Date.now();
        this.status = status;
        switch (status) {
            case GameStatus.WATTING:
                this.createGame();
                break;
            case GameStatus.BETTING:
                this.io.emit('game-status', this.status);
                setTimeout(() => {
                    this.handleStatus(GameStatus.CALCULATIONG);
                }, bettingTime);
                break;
            case GameStatus.CALCULATIONG:
                setTimeout(() => {
                    this.gameEnd();
                }, 500);
                this.io.emit('game-status', this.status);
                setTimeout(() => {
                    this.handleStatus(GameStatus.WATTING);
                }, calculatingTime);
                break;
        }
    }

    async fetchGame(page = 0, limit = 10, socket: Socket) {
        const games = await HiloMModel.find({ status: 'END' })
            .sort({ createdAt: -1 })
            .skip(page * limit)
            .limit(limit)
            .select({ privateSeed: 1, publicSeed: 1 });

        socket.emit('game', {
            dt: Date.now() - this.dt,
            status: this.status,
            bettingTime,
            calculatingTime,
            publicSeed: this.publicSeed,
            privateSeedHash: seedHash(this.privateSeed),
            startCard: this.startCard,
            history: games
        });

        return games;
    }
}

// const handleBalance = (userId: string, amount: number, currency: string, type: string) => {};

export const hiloMSocket = (io: Server) => {
    console.log('hilo server running');
    const so = io.of('/hilo_m');
    const gameEngine = new GameEngine(so);
    so.on('connection', (socket: Socket) => {
        let loggedIn = false;
        let user: IUser | null = null;

        const avatar = '';

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

        const fetch = () => {
            gameEngine.fetchGame(0, 32, socket);
        };

        const bet = (data: any) => {
            if (!loggedIn) return socket.emit('error', 'No authentication token provided, authorization declined');
            const { amount, currency, betType } = data;
            gameEngine.placeBet(user._id, avatar, amount, currency, betType, socket);
        };

        const cancel = () => {
            if (!loggedIn) return socket.emit('error', 'No authentication token provided, authorization declined');
            gameEngine.cancelBet(user._id, socket);
        };

        socket.on('auth', authenticate);
        socket.on('fetch', fetch);
        socket.on('place-bet', bet);
        socket.on('cancel-bet', cancel);
        socket.on('disconnect', cancel);
    });
};
