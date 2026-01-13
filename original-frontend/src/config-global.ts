/**
 * Global configuration constants for API endpoints and application settings.
 * Centralizes environment variables and default values used across the application.
 * Note: All API URLs and socket URLs are loaded from environment variables at build time.
 */
// API
// ----------------------------------------------------------------------

export const API_URL = import.meta.env.REACT_APP_API_URL;
export const SOCKET_URL = `${import.meta.env.REACT_APP_SOCKET_URL}`;
export const REACT_APP_MODE = import.meta.env.REACT_APP_MODE;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = "/"; // as '/dashboard'

