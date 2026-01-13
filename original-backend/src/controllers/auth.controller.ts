/**
 * Authentication controller handling user registration, login, logout, and session management.
 * Integrates with external authentication services via callback URLs.
 * Manages auth logs and device tracking for security purposes.
 */
import axios from 'axios';
import moment from 'moment';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { AuthRequest } from '@middlewares/auth';
import { authLogService, authService, sessionService, userService } from '@services/index';
import ApiError from '@utils/ApiError';
import catchAsync from '@utils/catchAsync';
import { getIpAddress } from '@utils/utils';
import { ICreateAccount } from '@root/types/auth.type';

const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

export const register = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.body;

    const param: ICreateAccount = {
        ...req.body
    };

    const exists = await userService.getUserByUserId(userId);

    if (exists) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists');
    }

    const user = await authService.register(param);

    if (user.status !== 'active') {
        throw new ApiError(httpStatus.BAD_REQUEST, `Your account is ${user.status}`);
    }

    const userIp = getIpAddress(req);
    const userAgent = req.headers['user-agent'];
    const isMobile = /Mobile/.test(userAgent);

    await authLogService.createAuthLog({
        userId: String(user._id),
        ip: userIp || '',
        userAgent,
        device: isMobile ? 'mobile' : 'desktop',
        isLive: true
    });

    return res.send(user);
});

export const login = catchAsync(async (req: AuthRequest, res: Response) => {
    const { token, callback_url } = req.body;
    console.log('🚀 ~ login ~ callback_url:', callback_url);

    const response = await axios.post(callback_url, {
        token
    });

    if (response.status !== 200 || !response.data) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
    }

    const data = response.data;

    const user = await userService.updateUserByUserId(data.userId, data);
    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
    }

    const expiredTime = moment().add(180, 'minutes').toDate();

    const userIp = getIpAddress(req);

    const query = {
        userId: String(user._id),
        token,
        ip: userIp || '',
        expiredTime
    };

    await sessionService.createSession(query);

    return res.send({ accessToken: token, user });
});

export const me = catchAsync(async (req: AuthRequest, res: Response) => {
    const { user } = req;
    return res.send(user);
});

export const logout = catchAsync(async (req: AuthRequest, res: Response) => {
    await sessionService.deleteSessionByUserId(String(req.user?._id));
    await authLogService.updateAuthLog(String(req.user?._id), 'Manual logout');

    return res.status(httpStatus.NO_CONTENT).send();
});

export const authCheck = async (url: string, token: string) => {
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: token,
                token: ADMIN_TOKEN
            }
        });

        if (!response?.data) {
            return false;
        }

        return response.data;
    } catch (error) {
        console.error("authCheck ~ error:", error?.response?.data || error)
        return false;
    }
};