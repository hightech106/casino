/**
 * Global error handling middleware for Express application.
 * Converts errors to ApiError format, handles operational vs non-operational errors, and formats error responses.
 * Includes separate handler for Telegram bot errors (Grammy/HttpError).
 */
import { NextFunction, Request, Response } from 'express';
import HttpStatusCodes from 'http-status';
import { GrammyError, HttpError } from "grammy";
import config from '../config';
import logger from '../config/logger';
import ApiError from '../utils/ApiError';
import { MongooseError } from 'mongoose';

const errorConverter = (err: any, req: Request, res: Response, next: NextFunction) => {
    let error = err;
    if (!(error instanceof ApiError)) {
        const statusCode =
            error.statusCode || error instanceof MongooseError
                ? HttpStatusCodes.BAD_REQUEST
                : HttpStatusCodes.INTERNAL_SERVER_ERROR;
        const message = error.message || HttpStatusCodes[statusCode];
        error = new ApiError(statusCode, message, false, err.stack);
    }
    next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let { statusCode, message } = err;
    if (config.env === 'production' && !err.isOperational) {
        statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR;
        message = HttpStatusCodes[HttpStatusCodes.INTERNAL_SERVER_ERROR];
    }

    res.locals.errorMessage = err.message;

    const response = {
        code: statusCode,
        message,
        ...(config.env === 'development' && { stack: err.stack })
    };

    if (config.env === 'development') {
        logger.error(err);
    }
    console.log('send error: ' + statusCode + ' ' + JSON.stringify(response));
    res.status(statusCode).send(response);
};


const errorBotHandler = (err: any) => {
    const e = err.error;

    if (e instanceof GrammyError)
        console.error("Error in request:", e.description);
    else if (e instanceof HttpError)
        console.error("Could not contact Telegram:", e);
    else console.error("Unknown error:", e);
};


export { errorConverter, errorHandler, errorBotHandler };
