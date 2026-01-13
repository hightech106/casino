/**
 * Gross Gaming Revenue (GGR) controller for financial reporting and analytics.
 * Handles GGR calculations, aggregation by game type, time periods, and summary statistics.
 * Provides endpoints for admins to track revenue, bets, and wins across all games.
 */
import { Request, Response, NextFunction } from 'express';
import { GameGGRModel } from '../models';
import catchAsync from '../utils/catchAsync';

// Save GGR data for a specific game
export const saveGGR = async (gameType: string, totalBets: number, totalWins: number, currency = 'USD') => {
    try {
        await GameGGRModel.findOneAndUpdate(
            {
                game_type: gameType,
            },
            {
                $inc: {
                    total_bets: totalBets,
                    total_wins: totalWins,
                },
                currency: currency
            },
            { upsert: true, new: true }
        );
        return true;
    } catch (error) {
        console.error('Error saving GGR:', error);
        return false;
    }
};

// Get GGR for a specific game
export const getGGRForGame = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { gameType } = req.params;
        const ggr = await GameGGRModel.findOne({ game_type: gameType });

        if (!ggr) {
            return res.status(404).json({ message: 'GGR data not found for this game' });
        }

        res.json(ggr);
    } catch (error) {
        next(error);
    }
});

// Get GGR for a specific time period
export const getGGRForPeriod = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { gameType, startDate, endDate } = req.query;
        const query: any = {};

        if (gameType) query.game_type = gameType;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate as string);
            if (endDate) query.createdAt.$lte = new Date(endDate as string);
        }

        const ggrData = await GameGGRModel.find(query).sort({ createdAt: -1 });
        res.json(ggrData);
    } catch (error) {
        next(error);
    }
});

// Get daily GGR
export const getDailyGGR = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { gameType, date } = req.query;
        const queryDate = date ? new Date(date as string) : new Date();
        const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));

        const query: any = {
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        };

        if (gameType) query.game_type = gameType;

        const ggrData = await GameGGRModel.find(query).sort({ createdAt: -1 });
        res.json(ggrData);
    } catch (error) {
        next(error);
    }
});

// Get monthly GGR
export const getMonthlyGGR = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { gameType, year, month } = req.query;
        const queryYear = parseInt(year as string) || new Date().getFullYear();
        const queryMonth = parseInt(month as string) || new Date().getMonth() + 1;

        const startOfMonth = new Date(queryYear, queryMonth - 1, 1);
        const endOfMonth = new Date(queryYear, queryMonth, 0, 23, 59, 59, 999);

        const query: any = {
            createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        };

        if (gameType) query.game_type = gameType;

        const ggrData = await GameGGRModel.find(query).sort({ createdAt: -1 });
        res.json(ggrData);
    } catch (error) {
        next(error);
    }
});

// Get yearly GGR
export const getYearlyGGR = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { gameType, year } = req.query;
        const queryYear = parseInt(year as string) || new Date().getFullYear();

        const startOfYear = new Date(queryYear, 0, 1);
        const endOfYear = new Date(queryYear, 11, 31, 23, 59, 59, 999);

        const query: any = {
            createdAt: { $gte: startOfYear, $lte: endOfYear }
        };

        if (gameType) query.game_type = gameType;

        const ggrData = await GameGGRModel.find(query).sort({ createdAt: -1 });
        res.json(ggrData);
    } catch (error) {
        next(error);
    }
});

// Get GGR summary for all games
export const getGGRSummary = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { gameType, startDate, endDate } = req.query;
        const query: any = {};

        if (gameType) query.game_type = gameType;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate as string);
            if (endDate) query.createdAt.$lte = new Date(endDate as string);
        }

        const summary = await GameGGRModel.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$game_type',
                    totalBets: { $sum: '$total_bets' },
                    totalWins: { $sum: '$total_wins' },
                }
            },
            {
                $project: {
                    game_type: '$_id',
                    total_bets: '$totalBets',
                    total_wins: '$totalWins',
                    rtp_percentage: {
                        $cond: [
                            { $eq: ['$totalBets', 0] },
                            0,
                            { $multiply: [{ $divide: ['$totalWins', '$totalBets'] }, 100] }
                        ]
                    }
                }
            },
            { $sort: { total_bets: -1 } }
        ]);

        res.json(summary);
    } catch (error) {
        next(error);
    }
}); 