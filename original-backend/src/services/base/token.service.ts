/**
 * JWT token generation and management service.
 * Creates access, refresh, reset password, and email verification tokens.
 * Handles token storage, validation, and removal for secure authentication.
 */
import jwt from 'jsonwebtoken';
import moment, { Moment } from 'moment';
import config from '../../config';
import { TokenModel } from '../../models';
import mongoose from 'mongoose';
import { SOCKET_STATUS_OPTIONS } from '../../config/static';

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId: string, expires: Moment, type: string, secret = config.jwt.secret) => {
    const payload = {
        sub: userId,
        iat: moment().unix(),
        exp: expires.unix(),
        type
    };
    return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (token: string, userId: string, expires, type: string, blacklisted = false) => {
    const tokenDoc = await TokenModel.create({
        token,
        user: userId,
        type,
        expires: expires.toDate(),
        blacklisted
    });
    return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @returns {Promise<Token>}
 */
const verifyToken = async (token: string) => {
    try {
        const payload = jwt.verify(token, config.jwt.secret);
        const tokenDoc = await TokenModel.findOne({
            user: new mongoose.Types.ObjectId(String(payload.sub) || ''),
            blacklisted: false
        }).populate('user');
        return tokenDoc;
    } catch (error) {
        console.log(error);
        return false;
    }
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
    const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
    const accessToken = generateToken(user._id, accessTokenExpires, config.jwt.tokenTypes.ACCESS);

    const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
    const refreshToken = generateToken(user._id, refreshTokenExpires, config.jwt.tokenTypes.REFRESH);
    await saveToken(refreshToken, user._id, refreshTokenExpires, config.jwt.tokenTypes.REFRESH);
    return accessToken;
};


/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async (user) => {
    const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
    const verifyEmailToken = generateToken(user._id, expires, config.jwt.tokenTypes.VERIFY_EMAIL);
    await saveToken(verifyEmailToken, user._id, expires, config.jwt.tokenTypes.VERIFY_EMAIL);
    return verifyEmailToken;
};

const removeToken = async (userid) => {
    return await TokenModel.deleteMany({ user: userid });
};

const updateSoketId = async (userId: string, socketId: string) => {
    return await TokenModel.updateOne(
        { user: userId },
        { socketId, status: socketId ? SOCKET_STATUS_OPTIONS[0] : SOCKET_STATUS_OPTIONS[1] }
    );
};

const updateDeviceToken = async (userId: string, deviceToken: string) => {
    return await TokenModel.updateOne({ user: userId }, { deviceToken });
};
const updateActiveReceiver = async (userId: string, receiverId: string) => {
    return await TokenModel.updateOne({ user: userId }, { receiverId });
};

const getOnlineUser = async (receiverId: string) => {
    return await TokenModel.findOne({ user: receiverId });
};

export default {
    updateSoketId,
    getOnlineUser,
    generateToken,
    saveToken,
    verifyToken,
    removeToken,
    generateAuthTokens,
    generateVerifyEmailToken,
    updateActiveReceiver,
    updateDeviceToken
};
