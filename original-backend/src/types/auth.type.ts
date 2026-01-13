/**
 * Type definitions for authentication-related data structures.
 * Defines the structure for account creation requests from external authentication services.
 * Includes user identification, profile data, and callback URL for session management.
 */
export type ICreateAccount = {
    userId: number;
    username: string;
    email: string;
    balance: number;
    currency: string;
    currencyIcon?: string;
    avatar?: string;
    first_name: string;
    last_name: string;
    callback_url: string;
};
