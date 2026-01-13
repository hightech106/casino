import io from 'socket.io-client';
import { SOCKET_URL } from 'src/config-global';

// Export individual socket connections
export const crashSocket = io(`${SOCKET_URL}/crash`);

// Authenticate websocket connections
export const authenticateSockets = (token: string) => {
    console.log('[WS] Crash  Authenticating...');

    crashSocket.emit('auth', token)
};
