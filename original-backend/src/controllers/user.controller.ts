/**
 * User controller for retrieving user game history and account information.
 * Provides endpoints for authenticated users to view their betting history and transaction records.
 * Integrates with user service to fetch and format user-specific data.
 */
import { Response } from 'express';
// middleware
import { AuthRequest } from '@middlewares/auth';
// services
import { userService } from '@services/index';
// utils
import catchAsync from '@utils/catchAsync';

export const getHistory = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    const data = await userService.getUserHistory(userId);
    return res.json(data);
});