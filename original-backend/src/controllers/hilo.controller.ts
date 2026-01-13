/**
 * Hi-Lo single player game controller for managing card-based high/low betting.
 * Handles game creation, card dealing, bet placement (high/low/color/range), and payout calculations.
 * Integrates with provably fair randomness and GGR tracking for Hi-Lo game operations.
 */
import { NextFunction, Request, Response } from 'express';
import { CommonGameModel, GameHistoryModel, UserModel, GameRTPModel, GameGGRModel } from '@models/index';
import { userService, gameService } from '@services/index';
import { AuthRequest } from '@middlewares/auth';
import { generateSeed, seedHash } from '@utils/random';
import { saveGGR } from './ggr.controller';
import httpStatus from 'http-status';

type Suit = 'Hearts' | 'Diamonds' | 'Clubs' | 'Spades';
type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

type BetType = 'Start' | 'Skip' | 'Lower' | 'Higher' | 'LOST';

interface Card {
    suit: Suit;
    rank: Rank;
}

const GAME_TYPE = 'hilo';

const generateCard = (publicKey: string, privateKey: string, round: number): Card => {
    const combinedKey = publicKey + privateKey + round.toString();
    const cardHash = seedHash(combinedKey);
    // Card rank: values from 1 (Ace) to 13 (King)
    const cardRank = parseInt(cardHash.slice(0, 8), 16) % 13;
    console.log('card Rank', cardRank);
    // Card suit: 0 = Hearts, 1 = Diamonds, 2 = Clubs, 3 = Spades
    const suits: Suit[] = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const cardSuitIndex = parseInt(cardHash.slice(8, 12), 16) % 4;
    const cardSuit = suits[cardSuitIndex];

    return { rank: ranks[cardRank], suit: cardSuit };
};

function getCardRankValue(card: Card): number {
    const rankValueMap: { [key in Rank]: number } = {
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
        K: 13
    };
    return rankValueMap[card.rank];
}

const multipliers: { [key in Rank]: { [key in 'Lower' | 'Higher']: number } } = {
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
    }
};

type Hilo = {
    userId: string;
    currency: any;
    gameId: string;
    odds: number;
    amount: any;
    profit: number;
    betting: {
        privateKey: string;
        publicKey: string;
        rounds: {
            card: Card;
            type: BetType;
            multiplier: number;
        }[];
    };
    status: string;
};

export const getHilo = async (req: AuthRequest, res: Response) => {
    try {
        // const userId = "";
        const userId = req.user?._id;
        const game = await CommonGameModel.findOne({ userId: userId, status: 'BET', game_type: GAME_TYPE });
        if (game) {
            return res.json({
                status: true,
                gameId: game._id,
                odds: game.odds,
                publicKey: game.aBetting.publicKey,
                privateHash: seedHash(game.aBetting.publicKey),
                rounds: game.aBetting.rounds,
                profit: game.amount * game.odds - game.amount,
                amount: game.amount
            });
        } else {
            return res.json({ status: false });
        }
    } catch (error) {
        console.error('Error Get Status Hilo Game =>', error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json('Internal Server Error');
    }
};

export const createHilo = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        const { startCard, amount } = req.body;

        const me = await UserModel.findById(userId);
        if (!me) {
            return res.status(httpStatus.PAYMENT_REQUIRED).send('User not found');
        }

        if (amount > me.balance) {
            return res.status(httpStatus.BAD_REQUEST).send('Your balance is not enough');
        }

        const publicKey = generateSeed();
        const privateKey = generateSeed();
        const game = await CommonGameModel.findOne({ userId, status: 'BET', game_type: GAME_TYPE });
        if (game) {
            return res.json({
                status: true,
                odds: game.odds,
                publicKey: publicKey,
                privateHash: seedHash(privateKey),
                rounds: game.aBetting.rounds
            });
        }

        const query = {
            userId,
            odds: 1,
            game_type: GAME_TYPE,
            profit: -amount,
            amount: amount,
            betting: req.body,
            aBetting: {
                privateKey: privateKey,
                publicKey: publicKey,
                rounds: [
                    {
                        card: startCard,
                        type: 'Start',
                        multiplier: 1
                    }
                ]
            },
            status: 'BET'
        };
        const newGame = await CommonGameModel.create(query);
        await userService.handleBalance(me._id, amount, 'BET', GAME_TYPE, newGame._id.toString());

        const queryh = {
            gameid: newGame._id,
            user: me._id,
            bet: amount,
            target: 0,
            payout: 0,
            type: GAME_TYPE
        };

        const history: any = await GameHistoryModel.create(queryh);
        history.user = me;

        return res.json({
            status: true,
            odds: newGame.odds,
            publicKey: publicKey,
            privateHash: seedHash(privateKey),
            rounds: newGame.aBetting.rounds,
            history
        });
    } catch (error) {
        console.error('Error Get Status Hilo Game =>', error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json('Internal Server Error');
    }
};

export const betHilo = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        const { type } = req.body;
        const game = await CommonGameModel.findOne({ userId: userId, status: 'BET', game_type: GAME_TYPE });
        if (!game) {
            return res.status(httpStatus.PAYMENT_REQUIRED).send('Game not found');
        }

        const { publicKey, privateKey, rounds } = game.aBetting;
        const newCard: Card = generateCard(publicKey, privateKey, rounds.length);
        const proviusCard = rounds[rounds.length - 1].card;

        const newValue = getCardRankValue(newCard);
        const proviusValue = getCardRankValue(proviusCard);
        if (type === 'Same_L' || type === 'Lower' || type === 'LSame') {
            if ((proviusValue === 13 && newValue < proviusValue) || (proviusValue < 13 && newValue <= proviusValue)) {
                game.odds = Math.floor(game.odds * multipliers[proviusCard.rank as Rank]['Lower'] * 100) / 100;
            } else {
                game.status = 'LOST';
            }
        } else if (type === 'Same_H' || type === 'Higher' || type === 'HSame') {
            if ((proviusValue === 1 && newValue > proviusValue) || (proviusValue > 1 && newValue >= proviusValue)) {
                game.odds = Math.floor(game.odds * multipliers[proviusCard.rank as Rank]['Higher'] * 100) / 100;
            } else {
                game.status = 'LOST';
            }
        }

        game.aBetting.rounds.push({
            card: newCard,
            type: type,
            multiplier: game.odds
        });

        await game.save();

        const history = await GameHistoryModel.findOneAndUpdate(
            {
                gameid: game._id
            },
            {
                target: game.odds
            },
            {
                new: true
            }
        );

        return res.json({
            status: true,
            odds: game.odds,
            profit: game.amount * game.odds - game.amount,
            publicKey: publicKey,
            privateKey: game.status == 'LOST' ? privateKey : '',
            privateHash: seedHash(privateKey),
            rounds: game.aBetting.rounds,
            type: game.status,
            history
        });
    } catch (error) {
        console.error('Error Get Status Hilo Game =>', error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json('Internal Server Error');
    }
};

export const cashoutHilo = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        const me = await UserModel.findById(userId);
        if (!me) {
            return res.status(httpStatus.PAYMENT_REQUIRED).send('User not found');
        }

        const game = await CommonGameModel.findOne({ userId: userId, status: 'BET', game_type: GAME_TYPE });
        if (!game) {
            return res.status(httpStatus.PAYMENT_REQUIRED).send('Game not found');
        }

        let winAmount = game.amount * game.odds;
        let profit = winAmount - game.amount;
        // RTP LOGIC
        const { input, output } = await gameService.getProfit(GAME_TYPE);
        const totalInput = input;
        const totalOutput = output;
        const rtpConfig = await GameRTPModel.findOne({ game_type: GAME_TYPE });
        const targetRTP = rtpConfig?.rtp ?? 96;
        const newTotalOutput = totalOutput + winAmount;
        const newTotalInput = totalInput + game.amount;
        const newRTP = newTotalInput > 0 ? (newTotalOutput / newTotalInput) * 100 : 0;
        if (newRTP >= targetRTP) {
            game.status = 'LOST';
            winAmount = 0;
            profit = -game.amount;
        } else {
            game.status = 'WIN';
            winAmount = game.amount * game.odds;
            profit = winAmount - game.amount;
        }

        await userService.handleBalance(me._id, winAmount, 'WIN', GAME_TYPE, game._id.toString());

        await game.save();

        const history = await GameHistoryModel.findOneAndUpdate(
            {
                gameid: game._id
            },
            {
                target: game.odds,
                payout: winAmount
            },
            {
                new: true
            }
        );

        // Save GGR data
        await saveGGR(GAME_TYPE, game.amount, winAmount);

        return res.json({
            status: true,
            profit: profit,
            multiplier: game.odds,
            privateKey: game.betting.privateKey,
            history
        });
    } catch (error) {
        console.error('Error Get Status Hilo Game =>', error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json('Internal Server Error');
    }
};

export const getHiloHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const query = {
            type: GAME_TYPE
        };
        const history = await GameHistoryModel.find(query)
            .populate('user', ['userId', 'first_name', 'last_name', 'avatar', 'username', 'currency', 'currencyIcon'])
            .sort({ createdAt: -1 })
            .limit(30);
        // Filter out records where user is null (deleted users)
        const filteredHistory = history.filter((h: any) => h.user !== null && h.user !== undefined);
        return res.json(filteredHistory);
    } catch (error) {
        next(error);
    }
};
