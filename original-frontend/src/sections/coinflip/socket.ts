import io from 'socket.io-client';
import { SOCKET_URL } from 'src/config-global';

// Export individual socket connections
export const coinflipSocket = io(`${SOCKET_URL}/coinflip`);

// Authenticate websocket connections
export const authenticateSockets = (token: string) => {
    console.log('[WS] Coinflip Authenticating...');

    // Emit auth event for all sockets
    coinflipSocket.emit('auth', token)
};
