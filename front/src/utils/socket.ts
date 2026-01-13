/**
 * Socket.IO client connections for real-time communication (main, sports, chat, journey).
 * Handles authentication, reconnection logic, and automatic re-authentication on reconnect.
 * Note: Sockets wait for connection before authenticating, with a 5-second timeout fallback.
 */
import io from 'socket.io-client';
import { API_URL } from 'src/config-global';

console.log('[MAIN] 🔌 Initializing socket connection to:', API_URL);
export const mainSocket = io(`${API_URL}`, {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  // Try polling first, then upgrade to websocket (more reliable for dev)
  transports: ['polling', 'websocket'],
  upgrade: true,
  rememberUpgrade: false, // Don't remember failed upgrades
  forceNew: false,
  timeout: 20000,
  withCredentials: false,
  // Add path if needed (default is /socket.io/)
  path: '/socket.io/',
});

// Log connection state changes
mainSocket.io.on('open', () => {
  console.log('[MAIN] 🔵 Socket.IO transport opened');
});

mainSocket.io.on('close', () => {
  console.log('[MAIN] 🔴 Socket.IO transport closed');
});

mainSocket.io.on('reconnect', (attemptNumber) => {
  console.log('[MAIN] 🔄 Socket.IO reconnecting, attempt:', attemptNumber);
});

mainSocket.io.on('reconnect_error', (error) => {
  console.error('[MAIN] ❌ Socket.IO reconnect error:', error);
});

mainSocket.io.on('reconnect_failed', () => {
  console.error('[MAIN] ❌ Socket.IO reconnect failed');
});

mainSocket.on('connect', () => {
  const transport = (mainSocket.io?.engine as any)?.transport?.name || 'unknown';
  console.log('[MAIN] 🟢 Socket connected:', mainSocket.id, 'to:', API_URL, 'transport:', transport);
});

mainSocket.on('disconnect', (reason) => {
  const transport = (mainSocket.io?.engine as any)?.transport?.name || 'unknown';
  console.log('[MAIN] 🔴 Socket disconnected:', reason, 'transport:', transport);
});

mainSocket.on('connect_error', (error: any) => {
  console.error('[MAIN] ❌ Connection error:', error);
  console.error('[MAIN] ❌ Attempted to connect to:', API_URL);
  console.error('[MAIN] ❌ Error message:', error?.message);
  console.error('[MAIN] ❌ Error type:', error?.type);
  console.error('[MAIN] ❌ Error description:', error?.description);
  if (error?.context) {
    console.error('[MAIN] ❌ Error context:', error.context);
  }
});

mainSocket.on('error', (error: any) => {
  console.error('[MAIN] ❌ Socket error:', error);
});

mainSocket.io.on('error', (error: any) => {
  console.error('[MAIN] ❌ IO error:', error);
});

export const sportsSocket = io(`${API_URL}/sports`, {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  transports: ['websocket', 'polling'],
});

export const chatSocket = io(`${API_URL}/chat`, {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  transports: ['websocket', 'polling'],
});

chatSocket.on('connect', () => {
  console.log('[CHAT] 🟢 Socket connected:', chatSocket.id);
});

chatSocket.on('disconnect', (reason) => {
  console.log('[CHAT] 🔴 Socket disconnected:', reason);
});

chatSocket.on('connect_error', (error) => {
  console.log('[CHAT] ❌ Connection error:', error);
});

export const journeySocket = io(`${API_URL}/journey`, {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  transports: ['websocket', 'polling'],
});

export const sockets = [mainSocket, sportsSocket, chatSocket, journeySocket];

// Store the current token for re-authentication on reconnect
let currentAuthToken: string | null = null;

// Authenticate a single socket, waiting for connection if needed
const authenticateSocket = async (socket: any, token: string, socketName: string): Promise<void> => {
  return new Promise((resolve) => {
    if (socket.connected) {
      console.log(`[WS] 🔑 Authenticating ${socketName} (already connected)`);
      socket.emit('auth', token);
      resolve();
    } else {
      console.log(`[WS] ⏳ Waiting for ${socketName} connection before auth...`);
      const onConnect = () => {
        console.log(`[WS] 🔑 Authenticating ${socketName} (connected: ${socket.id})`);
        socket.emit('auth', token);
        socket.off('connect', onConnect);
        resolve();
      };
      socket.on('connect', onConnect);
      
      // If socket doesn't connect within 5 seconds, try anyway
      setTimeout(() => {
        if (!socket.connected) {
          console.log(`[WS] ⚠️ ${socketName} not connected after 5s, sending auth anyway`);
          socket.emit('auth', token);
          socket.off('connect', onConnect);
          resolve();
        }
      }, 5000);
    }
  });
};

export const authenticateSockets = async (token: string) => {
  currentAuthToken = token;
  console.log(`[WS] 🔑 Authenticating all sockets with token: ${token.substring(0, 10)}...`);
  
  // Authenticate main socket first (most important for balance updates)
  await authenticateSocket(mainSocket, token, 'MAIN');
  
  // Authenticate other sockets in parallel
  await Promise.all([
    authenticateSocket(sportsSocket, token, 'SPORTS'),
    authenticateSocket(chatSocket, token, 'CHAT'),
    authenticateSocket(journeySocket, token, 'JOURNEY'),
  ]);
  
  console.log('[WS] ✅ All sockets authenticated');
};

// Re-authenticate on reconnect
sockets.forEach((socket, index) => {
  socket.on('reconnect', () => {
    console.log(`[WS] 🔄 Socket ${index} reconnected, re-authenticating...`);
    if (currentAuthToken) {
      socket.emit('auth', currentAuthToken);
    }
  });
});