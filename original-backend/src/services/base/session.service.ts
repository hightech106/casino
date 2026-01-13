/**
 * Session management service for handling user sessions and socket connections.
 * Manages session creation, updates, retrieval, and cleanup for authenticated users.
 * Tracks online users and manages session expiration and socket ID associations.
 */
import { SessionModel } from '@models/index';
import { ISession } from '@models/base/session.model';
import authLogService from './auth-log.service';

export interface ICreateSession {
    userId: string;
    token: string;
    ip: string;
    expiredTime: Date;
}

const createSession = async (newSession: ICreateSession) => {
    return await SessionModel.updateOne(
        { userId: newSession.userId, ip: newSession.ip },
        newSession, { upsert: true, new: true }
    );
};

const getSession = async (token: string) => {
    return await SessionModel.findOne({ token });
};

const getSessionByUserId = async (userId: string) => {
    return await SessionModel.findOne({ userId });
};

const updateSession = async (id: string, updateData: Partial<ISession>) => {
    return await SessionModel.updateOne({ _id: id }, updateData);
};

const updateSessionByToken = async (token: string, updateData: Partial<ISession>) => {
    return await SessionModel.findOneAndUpdate({ token }, updateData);
};

const updateSessionBySocketId = async (socketId: string, updateData: Partial<ISession>) => {
    return await SessionModel.findOneAndUpdate({ socketId }, updateData);
};

const deleteSession = async (id: string) => {
    const data = await SessionModel.findOneAndDelete({ _id: id });
    if (data) {
        await authLogService.updateAuthLog(String(data.userId), 'Session expire');
    }
};

const deleteSessionByUserId = async (userId: string) => {
    return await SessionModel.deleteMany({ userId });
};

const getOnline = async () => {
    return await SessionModel.find({ socketId: { $ne: null } }).populate("userId").select({
        userId: 1,
        socketId: 1
    });
};

export default {
    createSession,
    getSession,
    getSessionByUserId,
    deleteSession,
    deleteSessionByUserId,
    updateSession,
    getOnline,
    updateSessionByToken,
    updateSessionBySocketId
};
