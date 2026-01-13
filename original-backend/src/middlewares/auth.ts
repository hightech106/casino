/**
 * Authentication middleware for protecting routes.
 * Validates JWT tokens from Authorization headers, checks session expiration, and attaches user to request.
 * Supports both regular user authentication and admin authentication via external callback URLs.
 */
import moment from 'moment';
import HttpStatusCodes from 'http-status';
import { NextFunction, Request, Response } from 'express';
// config
import config from '@config/index';
// utils
import ApiError from '@utils/ApiError';
// service
import { sessionService, userService } from '@services/index';
import { authCheck } from '@controllers/auth.controller';

export interface AuthRequest extends Request {
    // eslint-disable-next-line
    user?: any;
    // eslint-disable-next-line
    file?: any;
}

const verifyCallback = async (req: AuthRequest, resolve, reject) => {
    function error() {
        return reject(new ApiError(HttpStatusCodes.UNAUTHORIZED, 'Please authenticate'));
    }

    const header = req.headers.authorization || '';
    const token = header.split(/\s+/).pop() || '';
    if (!token) {
        return error();
    }
    const session = await sessionService.getSession(token);

    if (!session) {
        return error();
    }
    if (new Date(session.expiredTime) > new Date()) {
        const expiredTime = moment().add(config.jwt.accessExpirationMinutes, 'minutes').toDate();

        await sessionService.updateSession(String(session._id), { expiredTime });

        const authUser = await userService.getUserById(String(session.userId));
        if (authUser) {
            req.user = authUser;
        } else {
            return error();
        }

        resolve();
    } else {
        await sessionService.deleteSession(String(session.userId));
        return error();
    }
};

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    return new Promise((resolve, reject) => {
        verifyCallback(req, resolve, reject);
    })
        .then(() => next())
        .catch((err) => next(err));
}

export const authAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization || '';
    const token = header.split("_")[0] || '';
    if (!token) return next(new ApiError(HttpStatusCodes.UNAUTHORIZED, 'Please authenticate'));

    const auth_url = header.split("_")[1] || '';
    console.log(auth_url, "===>auth_url");
    // const auth_url = req.headers.auth_url as string || '';
    if (!auth_url) return next(new ApiError(HttpStatusCodes.UNAUTHORIZED, 'Please authenticate'));

    const user = await authCheck(auth_url, token);
    if (!user) return next(new ApiError(HttpStatusCodes.UNAUTHORIZED, 'Please authenticate'));

    req.user = user;

    next();
};
