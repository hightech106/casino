/**
 * Return to Player (RTP) controller for managing game RTP configurations.
 * Allows admins to view and update RTP percentages for different game types.
 * Ensures games maintain configured house edge and player return rates.
 */
import { Request, Response, NextFunction } from 'express';
import { GameRTPModel } from '../models';
import catchAsync from '../utils/catchAsync';
import { AuthRequest } from '../middlewares/auth';

// GET RTPs
export const getRTPs = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const config = await GameRTPModel.find({});
        res.json(config);
    } catch (error) {
        next(error);
    }
});



// UPDATE RTPs (admin only)
export const updateRTPs = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { game_type, rtp } = req.body;
        await GameRTPModel.updateOne({ game_type }, { $set: { rtp } }, { upsert: true });
        res.json("success");
    } catch (error) {
        next(error);
    }
});

// Helper to get RTP from game_rtp table
export const getRTPByGame = async (game: string): Promise<number> => {
    const doc = await GameRTPModel.findOne({ game_type: game });
    return doc?.rtp ?? 98;
}
