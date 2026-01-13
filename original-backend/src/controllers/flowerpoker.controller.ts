/**
 * Flower Poker game controller for managing flower-themed poker betting games.
 * Handles game creation, flower selection, bet placement, result determination, and payouts.
 * Integrates with provably fair randomness and GGR tracking for flower poker operations.
 */
import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { CommonGameModel, GameHistoryModel, UserModel, GameRTPModel, GameGGRModel } from '@models/index';
import { userService, gameService } from '@services/index';
import { AuthRequest } from '@middlewares/auth';
import { combineSeeds, generateSeed, seedHash } from '@utils/random';
import { saveGGR } from './ggr.controller';

enum Flower {
    RED,
    BLUE,
    PURPLE,
    ORANGE,
    RAINBOW
}

const flowers: Flower[] = [Flower.RED, Flower.BLUE, Flower.PURPLE, Flower.ORANGE, Flower.RAINBOW];
const GAME_TYPE = 'flowerpoker';

function getFlowerFromHash(hash: string, index: number): Flower {
    const flowerIndex = parseInt(hash.substring(index, index + 2), 16) % flowers.length;
    return flowers[flowerIndex];
}

function generateFlowerCombination(hash: string, startIndex: number): Flower[] {
    return Array.from({ length: 5 }, (_, i) => getFlowerFromHash(hash, startIndex + i * 2));
}

function getBestCombination(flowers: Flower[]): { rank: number; description: string } {
    const counts = flowers.reduce<Record<Flower, number>>(
        (acc, flower) => {
            acc[flower] = (acc[flower] || 0) + 1;
            return acc;
        },
        { [Flower.RED]: 0, [Flower.BLUE]: 0, [Flower.PURPLE]: 0, [Flower.ORANGE]: 0, [Flower.RAINBOW]: 0 }
    );

    const values = Object.values(counts).sort((a, b) => b - a);
    if (values[0] === 5) return { rank: 6, description: '5 Oak' };
    if (values[0] === 4) return { rank: 5, description: '4 Oak' };
    if (values[0] === 3 && values[1] === 2) return { rank: 4, description: 'Full House' };
    if (values[0] === 3) return { rank: 3, description: '3 Oak' };
    if (values[0] === 2 && values[1] === 2) return { rank: 2, description: '2 Pair' };
    if (values[0] === 2) return { rank: 1, description: '1 Pair' };
    return { rank: 0, description: 'Bust' };
}

export const playFlowerPoker = async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    const { publicKey } = req.body;
    const privateKey = generateSeed();
    const _publicKey = publicKey || generateSeed();

    try {
        const me = await UserModel.findById(userId);
        if (!me) {
            return res.status(httpStatus.PAYMENT_REQUIRED).send('User not found');
        }

        const game = await CommonGameModel.findOne({ game_type: GAME_TYPE, userId, status: 'BET' });
        if (game) {
            await CommonGameModel.findByIdAndUpdate(game._id, {
                'aBetting.privateKey': privateKey,
                'aBetting.publicKey': _publicKey
            });
        } else {
            const param = {
                userId: me._id,
                amount: 0,
                betting: req.body,
                game_type: GAME_TYPE,
                profit: 0,
                odds: 0,
                aBetting: {
                    privateKey,
                    publicKey: _publicKey
                }
            };

            await CommonGameModel.create(param);
        }

        return res.json({
            status: true,
            privateHash: seedHash(privateKey),
            publicKey: _publicKey
        });
    } catch (error) {
        console.error('Error Play FlowerPoker Game =>', error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json('Internal Server Error');
    }
};

export const betFlowerPoker = async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    const { amount } = req.body;
    let user = null;

    try {
        const game = await CommonGameModel.findOne({ game_type: GAME_TYPE, userId, status: 'BET' });
        if (!game) {
            return res.status(httpStatus.PAYMENT_REQUIRED).json('No active bet found');
        }

        user = UserModel.findById(userId);

        if (!user) return res.status(httpStatus.PAYMENT_REQUIRED).json('User not found');

        if (user.balance < amount) return res.status(httpStatus.PAYMENT_REQUIRED).json('Your balance is not enough!');

        user = await userService.handleBalance(user._id, amount, 'BET', GAME_TYPE, game._id.toString());

        const hash = combineSeeds(game.aBetting.privateKey, game.aBetting.publicKey);

        const playerFlowers = generateFlowerCombination(hash, 0);
        const hostFlowers = generateFlowerCombination(hash, 10);

        const playerCombination = getBestCombination(playerFlowers);
        const hostCombination = getBestCombination(hostFlowers);

        let outcome: 'WIN' | 'LOST' | 'DRAW';
        let multiplier: number;

        if (playerCombination.rank > hostCombination.rank) {
            outcome = 'WIN';
            multiplier = 2;
        } else if (playerCombination.rank < hostCombination.rank) {
            outcome = 'LOST';
            multiplier = 0;
        } else {
            outcome = 'DRAW';
            multiplier = 1;
        }

        let payout = amount * multiplier;
        let profit = payout - amount;

        // RTP LOGIC
        const { input, output } = await gameService.getProfit(GAME_TYPE);
        const totalInput = input;
        const totalOutput = output;
        const rtpConfig = await GameRTPModel.findOne({ game_type: GAME_TYPE });
        const targetRTP = rtpConfig?.rtp ?? 96;
        const newTotalOutput = totalOutput + payout;
        const newTotalInput = totalInput + amount;
        const newRTP = newTotalInput > 0 ? (newTotalOutput / newTotalInput) * 100 : 0;
        if (outcome === 'WIN' && newRTP > targetRTP) {
            outcome = 'LOST';
            multiplier = 0;
            payout = 0;
            profit = -amount;
        } else if (outcome === 'LOST' && newRTP < targetRTP) {
            outcome = 'WIN';
            multiplier = 2;
            payout = amount * multiplier;
            profit = payout - amount;
        }

        await CommonGameModel.updateOne(
            { _id: game._id },
            {
                profit,
                amount,
                odds: multiplier,
                status: outcome
            }
        );

        const query = {
            gameid: game._id,
            user: userId,
            bet: amount,
            target: multiplier,
            payout: payout,
            type: GAME_TYPE
        };

        const history: any = await GameHistoryModel.create(query);
        history.user = user;

        // Save GGR data
        await saveGGR(GAME_TYPE, amount, payout);

        res.json({
            status: true,
            playerFlowers,
            hostFlowers,
            outcome,
            profit,
            multiplier,
            privateKey: game.aBetting.privateKey,
            publicKey: game.aBetting.publicKey,
            history
        });

        setTimeout(async () => {
            if (outcome === 'WIN') await userService.handleBalance(user._id, payout, 'WIN', GAME_TYPE, game._id.toString());
            // if (outcome === "LOST")
            //      await userService.handleBalance(userId, amount, "BET", GAME_TYPE);
            if (outcome === 'DRAW') await userService.handleBalance(user._id, amount, 'BET', GAME_TYPE, game._id.toString());
        }, 3000);

        return;
    } catch (error) {
        console.error('Error Bet FlowerPoker Game =>', error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json('Internal Server Error');
    }
};

export const getFlowerPokerHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
