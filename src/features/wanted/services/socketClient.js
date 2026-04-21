import { io } from 'socket.io-client';

class SocketClient {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(token) {
    if (this.socket?.connected) return;

    this.socket = io(import.meta.env.VITE_API_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 10,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected');
      this.emit('connect');
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
      this.emit('disconnect');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      this.emit('error', error);
    });

    // Forward all events to registered listeners
    this.socket.onAny((event, ...args) => {
      const listeners = this.listeners.get(event) || [];
      listeners.forEach(callback => callback(...args));
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    const listeners = this.listeners.get(event) || [];
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }

  emit(event, ...args) {
    if (this.socket) {
      this.socket.emit(event, ...args);
    } else {
      console.warn('Socket not connected, cannot emit:', event);
    }
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

export const socketClient = new SocketClient();
