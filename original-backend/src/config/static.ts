/**
 * Static configuration constants for user statuses, roles, and system options.
 * Defines valid enum values for user management and socket status tracking.
 * Includes EOS blockchain provider API endpoint and callback menu constants.
 */
export const USER_STATUS_OPTION = ['active', 'pending', 'blocked'];
export const USER_GENDER_OPTION = ['male', 'female'];
export const SOCKET_STATUS_OPTIONS = ['active', 'inactive', 'invisible'];
export const ROLE_OPTION = ['admin', 'player'];

export const httpProviderApi = 'http://eos.greymass.com';
export const CALLBACK_MENU = "CALLBACK_MENU";
export const CALLBACK_CHECK_SUBSCRIBE = "CALLBACK_CHECK_SUBSCRIBE";