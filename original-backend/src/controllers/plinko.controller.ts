/**
 * Plinko game controller for managing Plinko ball drop betting games.
 * Handles bet placement, ball path calculation, multiplier determination, and payouts.
 * Integrates with RTP configuration and GGR tracking for Plinko game operations.
 */
import * as crypto from 'crypto';
import httpStatus from 'http-status';
import { Response, NextFunction } from 'express';
import { CommonGameModel, GameHistoryModel, UserModel, GameGGRModel } from '@models/index';
import { gameService, userService } from '@services/index';
import { AuthRequest } from '@middlewares/auth';
import { getRTPByGame } from './rtp.controller';
import { saveGGR } from './ggr.controller';

const GAME_TYPE = 'plinko';

const gameData = {
    low: {
        '8': [5.6, 2.1, 1.1, 1, 0.5, 1, 1.1, 2.1, 5.6],
        '10': [8.9, 3, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 3, 8.9],
        '12': [10, 3, 1.6, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 1.6, 3, 10],
        '14': [7.1, 4, 1.9, 1.4, 1.3, 1.1, 1, 0.5, 1, 1.1, 1.3, 1.4, 1.9, 4, 7.1],
        '16': [16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 16]
    },
    medium: {
        '8': [13, 3, 1.3, 0.7, 0.4, 0.7, 1.3, 3, 13],
        '10': [22, 5, 2, 1.4, 0.6, 0.4, 0.6, 1.4, 2, 5, 22],
        '12': [33, 11, 4, 2, 1.1, 0.6, 0.3, 0.6, 1.1, 2, 4, 11, 33],
        '14': [58, 15, 7, 4, 1.9, 1, 0.5, 0.2, 0.5, 1, 1.9, 4, 7, 15, 58],
        '16': [110, 41, 1, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 110]
    },
    high: {
        '8': [29, 4, 1.5, 0.3, 0.2, 0.3, 1.5, 4, 29],
        '10': [76, 10, 3, 0.9, 0.3, 0.2, 0.3, 0.9, 3, 10, 76],
        '12': [170, 24, 8.1, 2, 0.7, 0.3, 0.2, 0.3, 0.7, 2, 8.1, 24, 170],
        '14': [420, 56, 18, 5, 1.9, 0.3, 0.2, 0.1, 0.2, 0.3, 1.9, 5, 18, 56, 420],
        '16': [1000, 130, 26, 9, 4, 2, 0.3, 0.2, 0.1, 0.2, 0.3, 2, 4, 9, 26, 130, 1000]
    }
} as any;

export const getNumber = ({
    difficulty,
    pins,
    amount,
    current = false
}: {
    difficulty: string;
    pins: number;
    amount: number;
    current?: boolean | undefined;
}) => {
    if (current) {
        const odds = Math.min.apply(null, gameData[difficulty][pins]);
        const target = gameData[difficulty][pins].indexOf(odds);
        return {
            status: 'LOST',
            odds: odds,
            profit: Number((odds * amount).toFixed(10)),
            target
        };
    } else {
        const odds = gameData[difficulty][pins];
        const oddslist = [] as any;
        for (const i in odds) {
            oddslist.push({
                pct: Math.floor((1 / (1 + odds[i])) * 100),
                odds: odds[i],
                profit: Number((amount * odds[i]).toFixed(10)),
                target: gameData[difficulty][pins].indexOf(odds[i])
            });
        }
        const expanded = oddslist.flatMap((item: any) => Array(item.pct).fill(item));
        const seed = crypto.createHash('sha256').update(`${Date.now()}`).digest('hex');
        const timestamp = Date.now();
        const nonce = (Math.random() * 100000).toFixed(0);
        let resultHash = crypto
            .createHash('sha256')
            .update(seed + '_' + timestamp + '_' + nonce)
            .digest('hex');
        resultHash = resultHash.substring(0, 10);
        const result = parseInt(resultHash, 16);
        const winner = expanded[result % expanded.length];
        if (winner.odds === 1) {
            return { status: 'DRAW', ...winner };
        } else if (winner.odds > 1) {
            return { status: 'WIN', ...winner };
        } else {
            return { status: 'LOST', ...winner };
        }
    }
};

export const playPlinko = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id;
        const { amount, difficulty, pins } = req.body;
        let user = await UserModel.findById(userId);

        if (!user) {
            return res.status(httpStatus.UNAUTHORIZED).send('User not found');
        }

        if (amount > user.balance) {
            return res.status(httpStatus.BAD_REQUEST).send('Your balance is not enough');
        }

        const { input, output } = await gameService.getProfit(GAME_TYPE);

        let result = getNumber({ amount, difficulty, pins });

        const RTP = await getRTPByGame(GAME_TYPE);

        if (((output + result.profit) / (input + amount)) * 100 >= RTP) {
            result = getNumber({ amount, difficulty, pins, current: true });
        }

        const data = {
            userId,
            amount,
            betting: req.body,
            game_type: GAME_TYPE,
            status: result.status,
            profit: result.profit,
            odds: result.odds,
            aBetting: result
        };

        const game = await CommonGameModel.create(data);
        
        user = await userService.handleBalance(user._id, amount, 'BET', GAME_TYPE, game._id.toString());

        let history: any;

        if (result.odds > 0) {
            const query = {
                gameid: game._id,
                user: user._id,
                bet: amount,
                target: result.odds,
                payout: result.profit,
                type: GAME_TYPE
            };

            history = await GameHistoryModel.create(query);

            history.user = user;

            // Save GGR data
            await saveGGR(GAME_TYPE, amount, result.profit);

            setTimeout(async () => {
                const amt = result.profit - amount;
                const status = amt > 0 ? 'WIN' : 'DRAW';
                await userService.handleBalance(user._id, result.profit, status, GAME_TYPE, game._id.toString());
            }, 3000);
        }

        return res.json({
            status: result.status,
            profit: result.profit,
            odds: result.odds,
            target: result.target,
            history
        });
    } catch (error) {
        next(error);
    }
};

export const getPlinkoHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
