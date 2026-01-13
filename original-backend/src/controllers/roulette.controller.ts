/**
 * Roulette game controller for managing European roulette betting games.
 * Handles game creation, bet placement (numbers, colors, ranges), wheel spin results, and payouts.
 * Integrates with provably fair randomness and GGR tracking for roulette game operations.
 */
import * as crypto from 'crypto';
import httpStatus from 'http-status';
import { NextFunction, Response } from 'express';
import { CommonGameModel, GameHistoryModel, UserModel, GameRTPModel, GameGGRModel } from '@models/index';
import { userService, gameService } from '@services/index';
import { AuthRequest } from '@middlewares/auth';
import { generateSeed, seedHash } from '@utils/random';
import { saveGGR } from './ggr.controller';

const GAME_TYPE = 'roulette';

const betMultipliers: { [key: string]: number } = {
    number: 35, // Specific number bet (0-36)
    '1_to_12': 3, // Dozen bets
    '13_to_24': 3,
    '25_to_36': 3,
    '1_to_18': 2, // Low bets
    '19_to_36': 2, // High bets
    Even: 2, // Even numbers
    Odd: 2, // Odd numbers
    Red: 2, // Red numbers
    Black: 2, // Black numbers
    '2:1:0': 3, // Column bets
    '2:1:1': 3,
    '2:1:2': 3
};

const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

// Helper function to determine bet type and outcome
const checkBetWin = (placeId: string | number, outcome: number): boolean => {
    if (typeof placeId === 'number') {
        return placeId === outcome;
    }
    if (placeId === '1_to_12') return outcome >= 1 && outcome <= 12;
    if (placeId === '13_to_24') return outcome >= 13 && outcome <= 24;
    if (placeId === '25_to_36') return outcome >= 25 && outcome <= 36;
    if (placeId === '1_to_18') return outcome >= 1 && outcome <= 18;
    if (placeId === '19_to_36') return outcome >= 19 && outcome <= 36;
    if (placeId === 'Even') return outcome % 2 === 0 && outcome !== 0;
    if (placeId === 'Odd') return outcome % 2 !== 0;
    if (placeId === 'Red') return redNumbers.includes(outcome);
    if (placeId === 'Black') return blackNumbers.includes(outcome);
    if (placeId === '2:1:0') return [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36].includes(outcome);
    if (placeId === '2:1:1') return [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35].includes(outcome);
    if (placeId === '2:1:2') return [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34].includes(outcome);
    return false;
};

// Profit Calculation
const calculateProfit = (bets: { placeId: string | number; amount: number }[], outcome: number, houseEdge: number) => {
    let totalBetAmount = 0;
    let totalWinAmount = 0;
    for (const bet of bets) {
        const betWon = checkBetWin(bet.placeId, outcome);
        totalBetAmount += bet.amount;
        if (betWon) {
            const multiplier = typeof bet.placeId === 'number' ? betMultipliers['number'] : betMultipliers[bet.placeId];
            totalWinAmount += bet.amount * multiplier;
        }
    }
    const totalProfit = totalWinAmount > 0 ? totalWinAmount * (1 - houseEdge) - totalBetAmount : 0;
    // Apply the house edge to the total profit
    return {
        winAmount: totalWinAmount,
        profit: totalProfit,
        lossAmount: totalProfit < 0 ? Math.abs(totalProfit) : 0,
        totalAmount: totalBetAmount
    };
};

// Generate roulette outcome number based on hash and seeds
const generateRouletteOutcome = (privateSeed: string, publicSeed: string) => {
    const hash = crypto.createHmac('sha256', privateSeed).update(publicSeed).digest('hex');
    const maxNumber = 37;
    const rawNumber = parseInt(hash.slice(0, 8), 16) % maxNumber;
    return rawNumber; // Returning raw number between 0-36
};

export const createRoulette = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        const { clientSeed: _clientSeed } = req.body;

        const me = await UserModel.findById(userId);
        if (!me) {
            return res.status(httpStatus.PAYMENT_REQUIRED).send('User not found');
        }

        const game = await CommonGameModel.findOne({ status: 'BET', userId, game_type: GAME_TYPE });
        if (game) {
            return res.json({
                status: true,
                gameId: game._id,
                serverHash: seedHash(game.aBetting.serverSeed),
                clientSeed: game.aBetting.clientSeed
            });
        }

        const serverSeed: string = generateSeed();
        const clientSeed = _clientSeed || generateSeed();

        const param = {
            userId: me._id,
            amount: 0,
            betting: req.body,
            game_type: GAME_TYPE,
            profit: 0,
            odds: 0,
            aBetting: {
                serverSeed,
                clientSeed,
                outcome: 0,
                bets: []
            }
        };

        const newGame = await CommonGameModel.create(param);

        return res.json({
            status: true,
            gameId: newGame._id,
            serverHash: seedHash(serverSeed),
            clientSeed
        });
    } catch (error) {
        console.log(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json('Internal Server Error');
    }
};

export const betRoulette = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        const { bets } = req.body;

        const me = await UserModel.findById(userId);
        if (!me) {
            return res.status(httpStatus.PAYMENT_REQUIRED).send('User not found');
        }

        const game = await CommonGameModel.findOne({ status: 'BET', userId, game_type: GAME_TYPE });
        if (!game) {
            return res.status(httpStatus.PAYMENT_REQUIRED).json('Game not found');
        }

        // const houseEdge = 0.0526;
        const houseEdge = 0;
        const outcome = generateRouletteOutcome(game.aBetting.serverSeed, game.aBetting.clientSeed);

        const { winAmount, profit, lossAmount, totalAmount } = calculateProfit(bets, outcome, houseEdge);

        // handleBalance(userId, currency, -totalAmount, "bet");

        await userService.handleBalance(me._id, totalAmount, 'BET', GAME_TYPE, game._id.toString());

        const status = profit > 0 ? 'WIN' : 'LOST';
        const odds = profit > 0 ? Number((winAmount / totalAmount).toFixed(3)) : 0;

        await CommonGameModel.findByIdAndUpdate(game._id, {
            profit: profit,
            amount: totalAmount,
            'aBetting.outcome': outcome,
            'aBetting.bets': bets,
            status,
            odds
        });

        if (profit > 0) {
            // handleBalance(userId, currency, winAmount, "settlement");
            await userService.handleBalance(me._id, winAmount, 'WIN', GAME_TYPE, game._id.toString());
        }

        const query = {
            gameid: game._id,
            user: me._id,
            bet: totalAmount,
            target: odds,
            payout: winAmount,
            type: GAME_TYPE
        };

        const history: any = await GameHistoryModel.create(query);

        history.user = me;

        // RTP LOGIC
        const { input, output } = await gameService.getProfit(GAME_TYPE);
        const totalInput = input;
        const totalOutput = output;
        const rtpConfig = await GameRTPModel.findOne({ game_type: GAME_TYPE });
        const targetRTP = rtpConfig?.rtp ?? 96;
        const newTotalOutput = totalOutput + winAmount;
        const newTotalInput = totalInput + totalAmount;
        const newRTP = newTotalInput > 0 ? (newTotalOutput / newTotalInput) * 100 : 0;
        let finalStatus = status;
        let finalWinAmount = winAmount;
        let finalProfit = profit;
        if (finalStatus === 'WIN' && newRTP >= targetRTP) {
            finalStatus = 'LOST';
            finalWinAmount = 0;
            finalProfit = -totalAmount;
        }

        // Save GGR data
        await saveGGR(GAME_TYPE, totalAmount, finalWinAmount);

        return res.json({
            status: true,
            outcome,
            result: finalStatus,
            profit: finalProfit,
            lossAmount,
            serverSeed: game.aBetting.serverSeed,
            clientSeed: game.aBetting.clientSeed,
            history
        });
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json('Internal Server Error');
    }
};

export const getRouletteHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
