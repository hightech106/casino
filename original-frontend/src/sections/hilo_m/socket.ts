import io from 'socket.io-client';
import { SOCKET_URL } from 'src/config-global';

// Export individual socket connections
export const hiloSocket = io(`${SOCKET_URL}/hilo_m`);

// Authenticate websocket connections
export const authenticateSockets = (token: string) => {
  console.log('[WS] Hilo M Authenticating...');

  // Emit auth event for all sockets
  hiloSocket.emit('auth', token);
};
