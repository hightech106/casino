/**
 * Authentication service for user registration, profile management, and logout.
 * Coordinates between user service and token service for account creation and session management.
 * Handles the authentication flow for external authentication providers.
 */
import tokenService from './token.service';
import userService from '../user/user.service';
import { ICreateAccount } from '@root/types/auth.type';

const register = async (data: ICreateAccount): Promise<any> => {
    return await userService.createAccount(data);
};

const changeProfile = async (): Promise<any> => {
    console.log('==>changeProfile<==');
};

const logout = async (userId: string): Promise<any> => {
    const token = await tokenService.removeToken(userId);
    return token;
};

export default {
    register,
    logout,
    changeProfile
};
