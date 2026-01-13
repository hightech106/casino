/**
 * Authentication logging service for tracking user login/logout events.
 * Records IP addresses, user agents, device types, and session lifecycle events.
 * Used for security auditing and user activity monitoring.
 */
import { AuthLogModel } from '@models/index';

export interface ICreateAuthLog {
    userId: string;
    ip: string;
    userAgent: string;
    device: string;
    isLive: boolean;
}

const createAuthLog = async (data: ICreateAuthLog) => {
    return await AuthLogModel.updateOne({ userId: data.userId, ip: data.ip }, data, { new: true });
};

const updateAuthLog = async (userId: string, endReason: string) => {
    return await AuthLogModel.findOneAndUpdate({ userId, isLive: true }, { endReason, isLive: false }, { new: true });
};

export default {
    createAuthLog,
    updateAuthLog
};
