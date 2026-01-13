/**
 * User service for managing user accounts, profiles, and user-related operations.
 * Handles user creation, retrieval, updates, balance management, and game history.
 * Integrates with external authentication services for account synchronization.
 */
import { IUser } from '@root/models/user/user.model';
import { GameHistoryModel, UserModel } from '../../models';
import { ICreateAccount } from '@root/types/auth.type';
import axios from 'axios';

const usernameTaken = async (username: string, id?: string) => {
    return await UserModel.isUsernameTaken(username, id);
};

const getUserById = async (userId: string) => {
    return await UserModel.findById(userId);
};

const getUserByCode = async (promoCode: string) => {
    return await UserModel.findOne({ promoCode });
};

const getUserByUserId = async (userId: string) => {
    return await UserModel.findOne({ userId });
};

const getUserByUsername = async (name: string) => {
    return await UserModel.findOne({ name });
};

const getUserByPhoneNumber = async (phoneNumber: string) => {
    return await UserModel.findOne({ phoneNumber });
};

const createAccount = async (data: ICreateAccount) => {
    return await UserModel.findOneAndUpdate({ userId: data.userId }, data, { upsert: true, new: true });
};

const getUserHistory = async (userId: string) => {
    return await GameHistoryModel.find({ user: userId }).sort({ _id: -1 });
};

const updateUserByUserId = async (userId: string, data: IUser) => {
    return await UserModel.findOneAndUpdate({ userId }, data, { new: true });
};

const handleBalance = async (
    userId: string,
    amount: number,
    type: 'BET' | 'DRAW' | 'WIN' | 'CANCEL',
    game: string,
    roundId: string
) => {
    const user = await UserModel.findById(userId);

    if (type === 'BET') {
        user.balance -= Number(amount.toFixed(2));
        user.bet += 1;
    }
    if (type === 'WIN') {
        user.won += 1;
        user.balance += Number(amount.toFixed(2));
    }

    if (user?.callback_url) {
        try {
            const response = await axios.post(user.callback_url, {
                userId: user.userId,
                amount,
                type,
                game,
                roundId: `${game}_${roundId}`
            });
            if (response.status !== 200) {
                return user;
            }
            const { status, message, balance, realBalance } = response.data;

            if (status === 'error') {
                console.error('🚀 ~ callback API ~ error:', message);
                return user;
            }

            user.realBalance = realBalance;
            user.balance = balance;

            await user.save();

            return user;
        } catch (error) {
            console.log('🚀 ~ callback API ~ error:', error);

            return user;
        }
    } else {
        await user.save();
        return user;
    }
};

export default {
    usernameTaken,

    getUserById,
    getUserByCode,
    getUserByUserId,
    getUserByUsername,
    getUserByPhoneNumber,

    createAccount,
    getUserHistory,
    handleBalance,
    updateUserByUserId
};
