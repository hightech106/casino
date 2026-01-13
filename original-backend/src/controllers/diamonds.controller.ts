/**
 * Diamonds game controller for managing gem selection and matching betting games.
 * Handles bet placement, gem selection, matching logic, multiplier calculation, and payouts.
 * Integrates with RTP configuration and GGR tracking for diamonds game operations.
 */
import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { CommonGameModel, GameHistoryModel, UserModel, GameGGRModel } from '@models/index';
import { gameService, userService } from '@services/index';
import { AuthRequest } from '@middlewares/auth';
import { getRTPByGame } from './rtp.controller';
import { saveGGR } from './ggr.controller';

const GAME_TYPE = 'diamonds';

const diamond = [
    { pct: 4, odds: 50, index: 0 },
    { pct: 125, odds: 5, index: 1 },
    { pct: 250, odds: 4, index: 2 },
    { pct: 1249, odds: 3, index: 3 },
    { pct: 1874, odds: 2, index: 4 },
    { pct: 4998, odds: 0.1, index: 5 },
    { pct: 1500, odds: 0, index: 6 }
] as any;

const colors = {
    0: [
        ['green', 'green', 'green', 'green', 'green'],
        ['purple', 'purple', 'purple', 'purple', 'purple'],
        ['yellow', 'yellow', 'yellow', 'yellow', 'yellow'],
        ['red', 'red', 'red', 'red', 'red'],
        ['light_blue', 'light_blue', 'light_blue', 'light_blue', 'light_blue'],
        ['pink', 'pink', 'pink', 'pink', 'pink'],
        ['blue', 'blue', 'blue', 'blue', 'blue']
    ],
    1: [
        ['green', 'green', 'green', 'green', 'purple'],
        ['purple', 'purple', 'purple', 'purple', 'yellow'],
        ['yellow', 'yellow', 'yellow', 'yellow', 'red'],
        ['red', 'red', 'red', 'red', 'light_blue'],
        ['light_blue', 'light_blue', 'light_blue', 'light_blue', 'pink'],
        ['pink', 'pink', 'pink', 'pink', 'blue'],
        ['blue', 'blue', 'blue', 'blue', 'green']
    ],
    2: [
        ['green', 'green', 'green', 'purple', 'purple'],
        ['purple', 'purple', 'purple', 'yellow', 'yellow'],
        ['yellow', 'yellow', 'yellow', 'red', 'red'],
        ['red', 'red', 'red', 'light_blue', 'light_blue'],
        ['light_blue', 'light_blue', 'light_blue', 'pink', 'pink'],
        ['pink', 'pink', 'pink', 'blue', 'blue'],
        ['blue', 'blue', 'blue', 'green', 'green']
    ],
    3: [
        ['green', 'green', 'green', 'purple', 'yellow'],
        ['purple', 'purple', 'purple', 'yellow', 'red'],
        ['yellow', 'yellow', 'yellow', 'red', 'light_blue'],
        ['red', 'red', 'red', 'light_blue', 'pink'],
        ['light_blue', 'light_blue', 'light_blue', 'pink', 'blue'],
        ['pink', 'pink', 'pink', 'blue', 'green'],
        ['blue', 'blue', 'blue', 'green', 'purple']
    ],
    4: [
        ['green', 'green', 'purple', 'purple', 'yellow'],
        ['purple', 'purple', 'yellow', 'yellow', 'red'],
        ['yellow', 'yellow', 'red', 'red', 'light_blue'],
        ['red', 'red', 'light_blue', 'light_blue', 'pink'],
        ['light_blue', 'light_blue', 'pink', 'pink', 'blue'],
        ['pink', 'pink', 'blue', 'blue', 'green'],
        ['blue', 'blue', 'green', 'green', 'purple']
    ],
    5: [
        ['green', 'green', 'purple', 'red', 'yellow'],
        ['purple', 'purple', 'yellow', 'light_blue', 'red'],
        ['yellow', 'yellow', 'red', 'pink', 'light_blue'],
        ['red', 'red', 'light_blue', 'blue', 'pink'],
        ['light_blue', 'light_blue', 'green', 'pink', 'blue'],
        ['pink', 'pink', 'blue', 'purple', 'green'],
        ['blue', 'blue', 'green', 'red', 'purple']
    ],
    6: [
        ['green', 'light_blue', 'purple', 'red', 'yellow'],
        ['purple', 'blue', 'yellow', 'light_blue', 'red'],
        ['yellow', 'green', 'red', 'pink', 'light_blue'],
        ['red', 'green', 'light_blue', 'blue', 'pink'],
        ['light_blue', 'purple', 'green', 'pink', 'blue'],
        ['pink', 'yellow', 'blue', 'purple', 'green'],
        ['blue', 'light_blue', 'green', 'red', 'purple']
    ]
} as any;

const getNumber = ({ amount, current = false }: { amount: number; current?: boolean | undefined }) => {
    let numbers = diamond;
    if (current) {
        numbers = [diamond[6]];
    }
    const expanded = numbers.flatMap((item: any) => Array(item.pct).fill(item));
    const winner = expanded[Math.floor(Math.random() * expanded.length)];
    const color = colors[winner.index][Math.floor(Math.random() * colors[winner.index].length)];
    if (winner.odds > 1) {
        return {
            status: 'WIN',
            profit: winner.odds * amount,
            color,
            ...winner
        };
    } else {
        return {
            status: 'LOST',
            profit: winner.odds * amount,
            color,
            ...winner
        };
    }
};

export const playDiamonds = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id;
        const { amount } = req.body;
        let user = await UserModel.findById(userId);

        if (!user) {
            return res.status(httpStatus.UNAUTHORIZED).send('User not found');
        }

        if (amount > user.balance) {
            return res.status(httpStatus.BAD_REQUEST).send('Your balance is not enough');
        }

        const { input, output } = await gameService.getProfit(GAME_TYPE);

        let result = getNumber({ amount });

        const RTP = await getRTPByGame(GAME_TYPE);

        if (((output + result.profit) / (input + amount)) * 100 >= RTP) {
            result = getNumber({
                amount,
                current: true
            });
        }

        const query = {
            userId,
            amount,
            betting: req.body,
            game_type: GAME_TYPE,
            odds: result.odds,
            status: result.status,
            profit: result.profit,
            aBetting: result
        };

        const game = await CommonGameModel.create(query);

        user = await userService.handleBalance(user._id, amount, 'BET', GAME_TYPE, game._id.toString());

        const query2 = {
            gameid: game._id,
            user: user._id,
            bet: amount,
            target: result.odds,
            payout: result.profit,
            type: GAME_TYPE
        };

        const history: any = await GameHistoryModel.create(query2);
        history.user = user;

        // Save GGR data
        await saveGGR(GAME_TYPE, amount, result.profit);

        res.json({
            status: result.status,
            profit: result.profit,
            odds: result.odds,
            color: result.color,
            history
        });

        setTimeout(async () => {
            const amt = result.profit - amount;
            const status = amt > 0 ? 'WIN' : 'DRAW';
            await userService.handleBalance(user._id, result.profit, status, GAME_TYPE, game._id.toString());
        }, 3000);
    } catch (error) {
        console.error('Error Diamonds Play =>', error);
        next();
    }
};

export const getDiamondsHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
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