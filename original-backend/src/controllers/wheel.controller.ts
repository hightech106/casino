/**
 * Wheel game controller for managing color-based wheel betting games.
 * Handles bet placement, wheel spin results, color matching, and payout calculations.
 * Integrates with RTP configuration and GGR tracking for wheel game operations.
 */
import httpStatus from 'http-status';
import { Response, NextFunction } from 'express';
import { CommonGameModel, GameHistoryModel, UserModel } from '@models/index';
import { gameService, userService } from '@services/index';
import { AuthRequest } from '@middlewares/auth';
import { getRTPByGame } from './rtp.controller';
import { saveGGR } from './ggr.controller';

const GAME_TYPE = 'wheel';

// import { getProfit, handleBet } from '../../base';

const mode1 = [
    { index: 0, value: 4, color: 'green' },
    { index: 1, value: 2, color: 'red' },
    { index: 2, value: 2, color: 'black' },
    { index: 3, value: 2, color: 'red' },
    { index: 4, value: 2, color: 'black' },
    { index: 5, value: 2, color: 'red' },
    { index: 6, value: 2, color: 'black' },
    { index: 7, value: 2, color: 'red' },
    { index: 8, value: 2, color: 'black' },
    { index: 9, value: 2, color: 'red' },
    { index: 10, value: 2, color: 'black' },
    { index: 11, value: 2, color: 'red' },
    { index: 12, value: 2, color: 'black' },
    { index: 13, value: 2, color: 'red' },
    { index: 14, value: 2, color: 'black' }
];

const mode2 = [
    { index: 0, value: 5, color: '#8A2BE2' },
    { index: 1, value: 5, color: 'green' },
    { index: 2, value: 2, color: 'black' },
    { index: 3, value: 3, color: 'red' },
    { index: 4, value: 2, color: 'black' },
    { index: 5, value: 3, color: 'red' },
    { index: 6, value: 2, color: 'black' },
    { index: 7, value: 3, color: 'red' },
    { index: 8, value: 2, color: 'black' },
    { index: 9, value: 5, color: 'green' },
    { index: 10, value: 2, color: 'black' },
    { index: 11, value: 5, color: 'green' },
    { index: 12, value: 2, color: 'black' },
    { index: 13, value: 3, color: 'red' },
    { index: 14, value: 2, color: 'black' },
    { index: 15, value: 3, color: 'red' },
    { index: 16, value: 2, color: 'black' },
    { index: 17, value: 3, color: 'red' },
    { index: 18, value: 2, color: 'black' },
    { index: 19, value: 5, color: 'green' },
    { index: 20, value: 2, color: 'black' },
    { index: 21, value: 5, color: 'green' },
    { index: 22, value: 2, color: 'black' },
    { index: 23, value: 3, color: 'red' },
    { index: 24, value: 2, color: 'black' },
    { index: 25, value: 3, color: 'red' },
    { index: 26, value: 2, color: 'black' },
    { index: 27, value: 3, color: 'red' },
    { index: 28, value: 2, color: 'black' },
    { index: 29, value: 3, color: 'red' },
    { index: 30, value: 2, color: 'black' },
    { index: 31, value: 3, color: 'red' },
    { index: 32, value: 2, color: 'black' },
    { index: 33, value: 5, color: 'green' },
    { index: 34, value: 2, color: 'black' },
    { index: 35, value: 5, color: 'green' },
    { index: 36, value: 2, color: 'black' },
    { index: 37, value: 3, color: 'red' },
    { index: 38, value: 2, color: 'black' },
    { index: 39, value: 3, color: 'red' },
    { index: 40, value: 2, color: 'black' },
    { index: 41, value: 3, color: 'red' },
    { index: 42, value: 2, color: 'black' },
    { index: 43, value: 5, color: 'green' },
    { index: 44, value: 2, color: 'black' },
    { index: 45, value: 5, color: 'green' },
    { index: 46, value: 2, color: 'black' },
    { index: 47, value: 3, color: 'red' },
    { index: 48, value: 2, color: 'black' },
    { index: 49, value: 3, color: 'red' },
    { index: 50, value: 2, color: 'black' },
    { index: 51, value: 3, color: 'red' },
    { index: 52, value: 2, color: 'black' },
    { index: 53, value: 3, color: 'red' },
    { index: 54, value: 2, color: 'black' },
    { index: 55, value: 5, color: 'green' }
];

const colors1 = {
    black: 2,
    green: 14,
    red: 2
};

const colors2 = {
    black: 2,
    red: 3,
    green: 5,
    yellow: 50
};

const getNumber = ({
    amount,
    color,
    mode,
    current = false
}: {
    amount: number;
    color: string;
    mode: boolean;
    current?: boolean | undefined;
}) => {
    let numbers = mode ? mode1 : mode2;
    if (current) {
        numbers = numbers.filter((e) => e.color !== color);
    }
    const winner = numbers[Math.floor(Math.random() * numbers.length)];
    if (color === winner.color) {
        const odds = ((mode ? colors1 : colors2) as any)[winner.color];
        return { status: 'WIN', odds, profit: amount * odds, ...winner };
    } else {
        return { status: 'LOST', odds: 0, profit: 0, ...winner };
    }
};

export const playWheel = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id;
        const { amount, color, mode } = req.body;

        let user = await UserModel.findById(userId);

        if (!user) {
            return res.status(httpStatus.UNAUTHORIZED).send('User not found');
        }

        if (amount > user.balance) {
            return res.status(httpStatus.BAD_REQUEST).send('Your balance is not enough');
        }

        const query = {
            userId,
            amount,
            betting: req.body,
            game_type: GAME_TYPE,
            odds: ((mode ? colors1 : colors2) as any)[color],
            status: 'BET',
            profit: 0,
            aBetting: {}
        };

        const game = await CommonGameModel.create(query);

        user = await userService.handleBalance(user._id, amount, 'BET', GAME_TYPE, game._id.toString());

        const { input, output } = await gameService.getProfit(GAME_TYPE);

        const odds = ((mode ? colors1 : colors2) as any)[color];

        let result = getNumber({ amount, color, mode });

        const RTP = await getRTPByGame(GAME_TYPE);

        if (((output + odds * amount) / (input + amount)) * 100 >= RTP) {
            result = getNumber({ amount, color, mode, current: true });
        }

        game.status = result.status;
        game.profit = result.profit;
        game.aBetting = result;

        await game.save();

        const query2 = {
            gameid: game._id,
            user: user._id,
            bet: amount,
            target: odds,
            payout: result.profit,
            type: GAME_TYPE
        };

        const history: any = await GameHistoryModel.create(query2);

        history.user = user;

        // Save GGR data
        await saveGGR(GAME_TYPE, amount, result.profit);

        res.json({
            status: result.status,
            index: result.index,
            odds: odds,
            profit: result.profit,
            history
        });

        setTimeout(async () => {
            const amt = result.profit - amount;
            const status = amt > 0 ? 'WIN' : 'DRAW';
            await userService.handleBalance(user._id, result.profit, status, GAME_TYPE, game._id.toString());
        }, 3000);
    } catch (error) {
        next(error);
    }
};

export const getWheelHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
