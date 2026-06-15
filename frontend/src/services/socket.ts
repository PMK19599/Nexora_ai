import { io, Socket } from 'socket.io-client';

const URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export const connectSocket = (token: string): Socket | null => {
  try {
    if (socket?.connected) return socket;

    socket = io(URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 2000,
      reconnectionAttempts: 3,
      timeout: 5000,
    });

    socket.on('connect', () => {
      console.log('🔌 Socket connected');
    });

    socket.on('connect_error', (err) => {
      // Silent fail — sockets are optional
      console.debug('Socket connection error (non-critical):', err.message);
    });

    socket.on('disconnect', (reason) => {
      console.debug('Socket disconnected:', reason);
    });

    return socket;
  } catch (err) {
    console.debug('Socket init failed (non-critical):', err);
    return null;
  }
};

export const disconnectSocket = (): void => {
  try {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  } catch (err) {
    console.warn('[Socket] Failed to disconnect cleanly:', err);
    socket = null;
  }
};

export const getSocket = (): Socket | null => socket;

export const joinRoom = (id: string): void => {
  try { socket?.emit('chat:join', id); } catch (err) {
    console.warn(`[Socket] Failed to join room "${id}":`, err);
  }
};

export const leaveRoom = (id: string): void => {
  try { socket?.emit('chat:leave', id); } catch (err) {
    console.warn(`[Socket] Failed to leave room "${id}":`, err);
  }
};

export const sendMessage = (roomId: string, message: string): void => {
  try { socket?.emit('chat:message', { roomId, message }); } catch (err) {
    console.warn(`[Socket] Failed to send message to room "${roomId}":`, err);
  }
};

export const sendTyping = (roomId: string, isTyping: boolean): void => {
  try { socket?.emit('chat:typing', { roomId, isTyping }); } catch (err) {
    console.warn(`[Socket] Failed to send typing indicator to room "${roomId}":`, err);
  }
};
