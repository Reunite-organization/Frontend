import { io } from 'socket.io-client';
import { socketServerUrl } from '../../../lib/apiConfig';

class SocketClient {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.currentToken = null;
  }

  notifyListeners(event, ...args) {
    const listeners = this.listeners.get(event);

    if (!listeners) {
      return;
    }

    listeners.forEach((callback) => {
      try {
        callback(...args);
      } catch (error) {
        console.error('Socket listener error:', { event, error });
      }
    });
  }

  connect(token) {
    const normalizedToken = typeof token === 'string' ? token.trim() : '';

    if (!normalizedToken) {
      console.error('Socket connection skipped because the auth token is missing.');
      return null;
    }

    if (this.socket?.connected && this.currentToken === normalizedToken) {
      return this.socket;
    }

    if (this.socket) {
      this.disconnect();
    }

    this.currentToken = normalizedToken;
    this.socket = io(socketServerUrl, {
      auth: { token: normalizedToken },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 10,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.notifyListeners('connect');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected');
      this.notifyListeners('disconnect', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.notifyListeners('error', error);
    });

    this.socket.onAny((event, ...args) => {
      this.notifyListeners(event, ...args);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.currentToken = null;
  }

  on(event, callback) {
    if (typeof callback !== 'function') {
      throw new TypeError(`Socket listener for "${event}" must be a function.`);
    }

    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event).add(callback);
  }

  off(event, callback) {
    const listeners = this.listeners.get(event);

    if (!listeners) {
      return;
    }

    listeners.delete(callback);

    if (listeners.size === 0) {
      this.listeners.delete(event);
    }
  }

  emit(event, ...args) {
    if (typeof event !== 'string' || !event.trim()) {
      throw new TypeError('Socket event name must be a non-empty string.');
    }

    if (!this.socket?.connected) {
      console.warn('Socket not connected, cannot emit:', event);
      return false;
    }

    this.socket.emit(event, ...args);
    return true;
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

export const socketClient = new SocketClient();
