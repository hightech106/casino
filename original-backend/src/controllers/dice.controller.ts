/**
 * Dice game controller for managing dice betting with multiplier and target selection.
 * Handles bet placement, result calculation, and payout distribution based on dice outcomes.
 * Integrates with RTP configuration and GGR tracking for dice game operations.
 */
import * as crypto from 'crypto';
import httpStatus from 'http-status';
import { Response, NextFunction } from 'express';
import { CommonGameModel, GameHistoryModel, UserModel, GameGGRModel } from '@models/index';
import { gameService, userService } from '@services/index';
import { AuthRequest } from '@middlewares/auth';
import { getRTPByGame } from './rtp.controller';
import { saveGGR } from './ggr.controller';

const GAME_TYPE = 'dice';

interface INum {
    amount: number;
    multiplier: number;
    target: number;
    mode: boolean;
    current?: boolean | undefined;
}

const getNumber = ({ amount, multiplier, target, mode, current = false }: INum) => {
    if (current) {
        if (mode) {
            const roll = Math.floor(Math.random() * target) - 1;
            return { status: 'LOST', odds: 0, profit: 0, roll };
        } else {
            const roll = Math.floor(Math.random() * (10000 - target + 1)) + target;
            return { status: 'LOST', odds: 0, profit: 0, roll };
        }
    } else {
        const seed = crypto.createHash('sha256').update(`${Date.now()}`).digest('hex');
        const timestamp = Date.now();
        const nonce = (Math.random() * 100000).toFixed(0);
        let resultHash = crypto
            .createHash('sha256')
            .update(seed + '_' + timestamp + '_' + nonce)
            .digest('hex');
        resultHash = resultHash.substring(0, 10);
        let result = parseInt(resultHash, 16);
        result = result % 10001;
        if (mode) {
            if (result > target) {
                return {
                    status: 'WIN',
                    odds: multiplier,
                    profit: amount * multiplier,
                    roll: result
                };
            } else {
                return { status: 'LOST', odds: 0, profit: 0, roll: result };
            }
        } else {
            if (result < target) {
                return {
                    status: 'WIN',
                    odds: multiplier,
                    profit: amount * multiplier,
                    roll: result
                };
            } else {
                return { status: 'LOST', odds: 0, profit: 0, roll: result };
            }
        }
    }
};

export const playDice = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id;
        const { amount, multiplier, target, mode } = req.body;
        let user = await UserModel.findById(userId);

        if (!user) {
            return res.status(httpStatus.UNAUTHORIZED).send('User not found');
        }

        if (amount > user.balance) {
            return res.status(httpStatus.BAD_REQUEST).send('Your balance is not enough');
        }

        if (multiplier <= 1 || multiplier > 2000) {
            res.status(400).json('Invalid odds!');
            return;
        }

        const { input, output } = await gameService.getProfit(GAME_TYPE);
        const odds = multiplier;

        let result = getNumber({ amount, multiplier, target, mode });

        const RTP = await getRTPByGame(GAME_TYPE);

        if (((output + odds * amount) / (input + amount)) * 100 >= RTP) {
            result = getNumber({
                amount,
                multiplier,
                target,
                mode,
                current: true
            });
        }

        const query = {
            userId,
            amount,
            betting: req.body,
            game_type: GAME_TYPE,
            odds,
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
            roll: result.roll,
            history
        });

        setTimeout(async () => {
            const amt = result.profit - amount;
            const status = amt > 0 ? 'WIN' : 'DRAW';
            await userService.handleBalance(user._id, result.profit, status, GAME_TYPE, game._id.toString());
        }, 3000);
    } catch (error) {
        console.error('Error Dice Play =>', error);
        next();
    }
};

export const getDiceHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
