/**
 * Keno game controller for managing number selection and lottery-style betting.
 * Handles number selection, draw results, matching logic, and payout calculations.
 * Integrates with RTP configuration and GGR tracking for Keno game operations.
 */
import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { CommonGameModel, GameHistoryModel, UserModel, GameGGRModel } from '@models/index';
import { gameService, userService } from '@services/index';
import { AuthRequest } from '@middlewares/auth';
import { getRTPByGame } from './rtp.controller';
import { saveGGR } from './ggr.controller';

const GAME_TYPE = 'keno';

const numbers = {
    1: [0, 1.8],
    2: [0, 1.96, 3.6],
    3: [0, 0, 1.5, 24],
    4: [0, 0, 2.1, 7.8, 88.6],
    5: [0, 0, 1.5, 4, 12, 292],
    6: [0, 0, 0, 1.8, 6, 100, 600],
    7: [0, 0, 0, 1.7, 3.2, 14, 200, 700],
    8: [0, 0, 0, 1.5, 2, 5, 39, 100, 800],
    9: [0, 0, 0, 1.4, 1.6, 2.3, 7, 40, 200, 900],
    10: [0, 0, 0, 1.3, 1.4, 1.5, 2.6, 10, 30, 200, 1000]
} as any;

const numbers40 = Array.from(Array(40).keys());

interface INum {
    amount: number;
    selected: number[];
    current?: boolean | undefined;
}

const random = (min: number, max: number, floor = true): number => {
    const r = Math.random() * max + min;
    return floor ? Math.floor(r) : r;
};

const getNumber = ({ amount, selected, current = false }: INum) => {
    const picked = [];
    while (picked.length < 10) {
        const rand = random(1, 40);
        if (picked.includes(rand)) continue;
        picked.push(rand);
    }
    let count = 0;
    const match = [];
    const notMatch = [];
    const notnumbers = [];
    for (const i in numbers40) {
        if (!selected.includes(numbers40[i] + 1)) {
            notnumbers.push(numbers40[i] + 1);
        }
    }
    for (const i in picked) {
        if (selected.includes(picked[i])) {
            match.push(picked[i]);
            count++;
        } else {
            notMatch.push(picked[i]);
        }
    }
    const odds = numbers[String(selected.length)][count];
    if (current) {
        const length = numbers[String(selected.length)].filter((e: number) => e === 0).length - 1;
        if (match.length > length) {
            while (notMatch.length < 10) {
                const rand = notnumbers[Math.floor(Math.random() * notnumbers.length)];
                if (notMatch.includes(rand)) continue;
                notMatch.push(rand);
            }
            const odds = 0;
            return {
                status: 'LOST',
                odds,
                profit: amount * odds,
                picked: notMatch
            };
        } else {
            return { status: 'LOST', odds, profit: amount * odds, picked };
        }
    } else {
        if (odds > 1) {
            return { status: 'WIN', odds, profit: amount * odds, picked };
        } else {
            return { status: 'LOST', odds, profit: amount * odds, picked };
        }
    }
};

export const playKeno = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id;
        const { amount, selected } = req.body;

        let user = await UserModel.findById(userId);

        if (!user) {
            return res.status(httpStatus.UNAUTHORIZED).json('User not found');
        }

        if (amount > user.balance) {
            return res.status(httpStatus.BAD_REQUEST).json('Your balance is not enough');
        }

        if (amount < 0.01) {
            return res.status(httpStatus.BAD_REQUEST).json('Min Bet Amount: 0.01');
        }

        if (!selected || selected.length < 1) {
            return res.status(httpStatus.BAD_REQUEST).json('Please select keno!');
        }

        const toFindDuplicates = (selected: number[]) =>
            selected.filter((item: number, index: number) => selected.indexOf(item) !== index);
        const duplicate = toFindDuplicates(selected);
        if (duplicate.length > 0) {
            return res.status(httpStatus.BAD_REQUEST).json('Please select keno!');
        }

        const { input, output } = await gameService.getProfit(GAME_TYPE);

        let result = getNumber({ amount, selected });

        const RTP = await getRTPByGame(GAME_TYPE);

        if (((output + result.profit) / (input + amount)) * 100 >= RTP) {
            result = getNumber({
                amount,
                selected,
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
            picked: result.picked,
            history
        });

        setTimeout(async () => {
            const amt = result.profit - amount;
            const status = amt > 0 ? 'WIN' : 'DRAW';
            await userService.handleBalance(user._id, result.profit, status, GAME_TYPE, game._id.toString());
        }, 3000);
    } catch (error) {
        console.error('Error Keno Play =>', error);
        next();
    }
};

export const getKenoHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
