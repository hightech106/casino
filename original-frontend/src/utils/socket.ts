/**
 * Socket.IO client connection for real-time communication.
 * Handles socket authentication and provides socket instance for use throughout the application.
 * Note: Socket authentication is performed with user tokens for secure real-time communication.
 */
import io from 'socket.io-client';
import { SOCKET_URL } from 'src/config-global';

export const mainSocket = io(`${SOCKET_URL}`);

export const sockets = [mainSocket];

export const authenticateSockets = (token: string) => {
    console.log('[WS] Authenticating...');

    sockets.forEach((socket) => socket.emit('auth', token));
};
