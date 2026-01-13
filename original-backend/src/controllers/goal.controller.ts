/**
 * Goal game controller for managing goal-based betting games with position selection.
 * Handles game creation, goal positioning, bet placement, result determination, and payouts.
 * Integrates with provably fair randomness and GGR tracking for goal game operations.
 */
import httpStatus from 'http-status';
import { NextFunction, Response } from 'express';
import { CommonGameModel, GameHistoryModel, UserModel, GameGGRModel } from '@models/index';
import { userService } from '@services/index';
import { AuthRequest } from '@middlewares/auth';
import { generateSeed, seedHash } from '@utils/random';
import { saveGGR } from './ggr.controller';

type GameSize = 0 | 1 | 2;

const GAME_TYPE = 'goal';

const GRIDS = {
    0: {
        w: 3,
        h: 4,
        multipliers: [1.45, 2.18, 3.27, 4.91]
    },
    1: {
        w: 4,
        h: 7,
        multipliers: [1.29, 1.72, 2.3, 3.3, 4.09, 5.45, 7.27]
    },
    2: {
        w: 5,
        h: 10,
        multipliers: [1.21, 1.52, 1.89, 2.37, 2.96, 3.79, 4.64, 5.78, 7.23, 9.03]
    }
};

const hashToColumnPosition = (hash: string, gridWidth: number): number => {
    return parseInt(hash.substring(0, 8), 16) % gridWidth;
};

export const createGoal = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        const { amount, currency, size } = req.body;
        console.log(amount, currency, size);

        const me = await UserModel.findById(userId);
        if (!me) {
            return res.status(httpStatus.PAYMENT_REQUIRED).send('User not found');
        }

        if (amount > me.balance) {
            return res.status(httpStatus.BAD_REQUEST).send('Your balance is not enough');
        }

        if (!GRIDS[size as GameSize]) return res.status(httpStatus.PAYMENT_REQUIRED).json('Invalid grid size!');

        const publicKey = generateSeed();
        const privateKey = generateSeed();

        const game = await CommonGameModel.findOne({
            userId,
            status: 'BET',
            game_type: GAME_TYPE
        });

        if (game) {
            return res.json({
                status: true,
                gameId: game._id,
                publicKey: game.aBetting.publicKey,
                size: game.aBetting?.size,
                amount: game.amount,
                rounds: game.aBetting?.rounds,
                privateHash: seedHash(game.aBetting.privateKey)
            });
        }

        const param = {
            userId: me._id,
            amount,
            betting: req.body,
            game_type: GAME_TYPE,
            profit: -amount,
            odds: 1,
            aBetting: {
                privateKey: privateKey,
                publicKey: publicKey,
                size: size,
                rounds: []
            }
        };

        const newGame = await CommonGameModel.create(param);

        await userService.handleBalance(me._id, amount, 'BET', GAME_TYPE, newGame._id.toString());

        const query = {
            gameid: newGame._id,
            user: me._id,
            bet: amount,
            target: 0,
            payout: 0,
            type: GAME_TYPE
        };

        const history: any = await GameHistoryModel.create(query);
        history.user = me;
        // handleBalance(userId, -amount, currency, 'BET');

        return res.json({
            status: true,
            gameId: newGame._id,
            publicKey,
            size: newGame.aBetting.size,
            amount: newGame.amount,
            rounds: newGame.aBetting.rounds,
            privateHash: seedHash(privateKey),
            history
        });
    } catch (error) {
        console.error('Create Goal Api Error => ', error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json('Internal Server Error');
    }
};

export const betGoal = async (req: AuthRequest, res: Response) => {
    const { position } = req.body;
    const userId = req.user?._id;

    try {
        const game = await CommonGameModel.findOne({ userId, status: 'BET', game_type: GAME_TYPE });
        if (!game) {
            return res.status(httpStatus.PAYMENT_REQUIRED).send('Game not found');
        }

        if (game.status !== 'BET') {
            return res.status(httpStatus.PAYMENT_REQUIRED).send('Betting is closed for this game');
        }

        const grid = GRIDS[game.aBetting.size as GameSize];
        const currentRound = game.aBetting.rounds.length;

        if (currentRound >= grid.h) {
            return res.status(httpStatus.PAYMENT_REQUIRED).send('All rounds completed');
        }

        const roundHash = seedHash(game.aBetting.privateKey + game.aBetting.publicKey + currentRound);

        const lossColumn = hashToColumnPosition(roundHash, grid.w);
        const multiplier: number = grid.multipliers[currentRound];
        let winAmount = game.amount * multiplier;

        if (lossColumn === position) {
            game.status = 'LOST';
            game.profit = -game.amount;
            winAmount = 0;
        } else if (currentRound === grid.h - 1) {
            game.profit = winAmount - game.amount;
            game.status = 'WIN';
            game.odds = multiplier;

            await userService.handleBalance(userId, winAmount, 'WIN', GAME_TYPE, game._id.toString());
            // handleBalance(game.userId, winAmount, game.currency, 'SETTLEMENT');
        }

        game.aBetting.rounds.push({ position, lossPostion: lossColumn });

        await CommonGameModel.findByIdAndUpdate(game._id, {
            profit: game.profit,
            status: game.status,
            aBetting: game.aBetting
        });

        const history: any = await GameHistoryModel.findOneAndUpdate(
            {
                gameid: game._id
            },
            {
                target: multiplier,
                payout: winAmount
            },
            {
                new: true,
                upsert: true
            }
        );

        // Save GGR data
        await saveGGR(GAME_TYPE, game.amount, winAmount);

        return res.json({
            status: true,
            size: game.aBetting.size,
            row: currentRound,
            result: game.status,
            rounds: game.aBetting.rounds,
            privateKey: game.status === 'LOST' || game.status === 'WIN' ? game.aBetting.privateKey : '',
            profit: game.profit,
            multiplier: multiplier,
            history
        });
    } catch (error) {
        console.log('betGoal Error => ', error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json('Internal Server Error');
    }
};

export const cashoutGoal = async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    try {
        const game = await CommonGameModel.findOne({ userId, status: 'BET', game_type: GAME_TYPE });
        if (!game) {
            return res.status(httpStatus.PAYMENT_REQUIRED).send('Game not found');
        }

        // If the player cashes out before the game ends, calculate the profit based on the last completed round
        const lastRound = game.aBetting.rounds.length - 1;
        const multiplier: number = GRIDS[game.aBetting.size as GameSize].multipliers[lastRound];
        game.odds = multiplier;

        const winAmount = game.amount * multiplier;
        game.profit = winAmount - game.amount;
        game.status = 'WIN';

        await userService.handleBalance(userId, winAmount, 'WIN', GAME_TYPE, game._id.toString());

        await game.save();

        const history = await GameHistoryModel.findOneAndUpdate(
            {
                gameid: game._id
            },
            {
                target: multiplier,
                payout: winAmount
            },
            {
                new: true,
                upsert: true
            }
        );

        return res.json({
            status: true,
            publicKey: game.aBetting.publicKey,
            privateKey: game.aBetting.privateKey,
            rounds: game.aBetting.rounds,
            profit: game.profit,
            multiplier,
            size: game.aBetting.size,
            history
        });
    } catch (error) {
        console.error('cashout Goal Error =>', error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json('Internal Server Error');
    }
};

export const getGoalHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
