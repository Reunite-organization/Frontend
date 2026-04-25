import { io } from 'socket.io-client';
import logger from '../../../utils/logger';

class SocketClient {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    if (this.socket?.connected) return;
    
    const socketUrl = import.meta.env.DEV 
      ? 'http://localhost:5500'  
      : import.meta.env.VITE_API_URL; 

    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.close();
    }

    this.socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket'], // Prefer websocket for performance
      autoConnect: false,
    });

    // 3. Native Socket.io listeners
    this.socket.on('connect', () => logger.info('Socket connected'));
    this.socket.on('disconnect', (reason) => logger.info('Socket disconnected', { reason }));
    this.socket.on('connect_error', (err) => logger.error('Socket connection error', { error: err.message }));

    this.socket.connect();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      // Optimization: wipe the socket so connect() can start fresh
      this.socket = null; 
    }
  }

  // 4. Delegate directly to the socket instance
  on(event, callback) {
    this.socket?.on(event, callback);
  }

  off(event, callback) {
    this.socket?.off(event, callback);
  }

  emit(event, ...args) {
    if (this.socket?.connected) {
      this.socket.emit(event, ...args);
    }
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

export const socketClient = new SocketClient();
