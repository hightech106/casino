import io from 'socket.io-client';
import { SOCKET_URL } from 'src/config-global';

// Export individual socket connections
export const baccaratSocket = io(`${SOCKET_URL}/baccarat_m`);

// Authenticate websocket connections
export const authenticateSockets = (token: string) => {
  console.log('[WS] Baccarat M Authenticating...');

  // Emit auth event for all sockets
  baccaratSocket.emit('auth', token);
};
