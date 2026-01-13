import io from 'socket.io-client';
import { SOCKET_URL } from 'src/config-global';

// Export individual socket connections
export const slideSocket = io(`${SOCKET_URL}/slide`);

// Authenticate websocket connections
export const authenticateSockets = (token: string) => {
    console.log('[WS] Slide Authenticating...');

    // Emit auth event for all sockets
    slideSocket.emit('auth', token)
};
