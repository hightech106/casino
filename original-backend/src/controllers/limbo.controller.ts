/**
 * Limbo game controller for managing multiplier-based limbo betting games.
 * Handles bet placement, multiplier generation, target selection, and payout calculations.
 * Integrates with RTP configuration and GGR tracking for limbo game operations.
 */
import * as crypto from 'crypto';
import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { CommonGameModel, GameHistoryModel, UserModel, GameGGRModel } from '@models/index';
import { gameService, userService } from '@services/index';
import { AuthRequest } from '@middlewares/auth';
import { getRTPByGame } from './rtp.controller';
import { saveGGR } from './ggr.controller';

const GAME_TYPE = 'limbo';

export const getNumber = ({
    amount,
    multiplier,
    current = false
}: {
    amount: number;
    multiplier: number;
    current?: boolean | undefined;
}) => {
    if (current) {
        const payout = Number(Number((Math.random() * multiplier).toFixed(2)) - 0.01);
        return { status: 'LOST', odds: 0, profit: 0, payout };
    } else {
        const seed = crypto.createHash('sha256').update(`${Date.now()}`).digest('hex');
        const timestamp = Date.now();
        const nonce = (Math.random() * 100000).toFixed(0);
        let hash = crypto
            .createHash('sha256')
            .update(seed + '_' + timestamp + '_' + nonce)
            .digest('hex');
        const nBits = 52;
        hash = hash.slice(0, nBits / 4);
        const r = parseInt(hash, 16);
        let X = r / Math.pow(2, nBits);
        X = 99 / (1 - X);
        const result = Math.floor(X);
        const payout = Number(Math.max(1, result / 100).toFixed(2));
        if (payout >= multiplier) {
            return {
                status: 'WIN',
                odds: multiplier,
                profit: multiplier * amount,
                payout
            };
        } else {
            return { status: 'LOST', odds: 0, profit: 0, payout };
        }
    }
};

export const playLimbo = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id;
        const { amount, multiplier } = req.body;

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

        if (multiplier <= 1) {
            return res.status(httpStatus.BAD_REQUEST).json('Invalid odds!');
        }


        const { input, output } = await gameService.getProfit(GAME_TYPE);

        const odds = multiplier;

        let result = getNumber({ amount, multiplier });

        const RTP = await getRTPByGame(GAME_TYPE);

        if (((output + result.profit) / (input + amount)) * 100 >= RTP) {
            result = getNumber({
                amount,
                multiplier,
                current: true
            });
        }

        const query = {
            userId,
            amount,
            betting: req.body,
            game_type: GAME_TYPE,
            odds: odds,
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
            profit: result.profit,
            odds: result.odds,
            payout: result.payout,
            history
        });

        setTimeout(async () => {
            const amt = result.profit - amount;
            const status = amt > 0 ? 'WIN' : 'DRAW';
            await userService.handleBalance(user._id, result.profit, status, GAME_TYPE, game._id.toString());
        }, 3000);
    } catch (error) {
        console.error('Error Limbo Play =>', error);
        next();
    }
};

export const getLimboHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
