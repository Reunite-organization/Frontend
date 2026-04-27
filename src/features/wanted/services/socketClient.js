import { io } from 'socket.io-client';
import { socketServerUrl } from '../../../lib/apiConfig';

class SocketClient {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
  }

  connect(token) {
    if (this.socket?.connected && this.socket.auth?.token === token) {
      return;
    }

    const socketUrl = socketServerUrl;

    // Clean up existing socket
    if (this.socket) {
      // Remove all listeners before disconnecting
      this.listeners.forEach((callbacks, event) => {
        callbacks.forEach(cb => {
          this.socket?.off(event, cb);
        });
      });
      this.socket.removeAllListeners();
      this.socket.close();
      this.socket = null;
    }

    this.socket = io(socketUrl, {
      auth: { token },
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      timeout: 20000,
      autoConnect: true,
      forceNew: true,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('Socket disconnected:', reason);
      
      if (reason === 'io server disconnect') {
        // Server kicked us, try reconnecting
        setTimeout(() => {
          if (this.socket) {
            this.socket.connect();
          }
        }, 1000);
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        this.socket?.disconnect();
      }
    });

    // Re-register stored listeners
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach(cb => {
        this.socket?.on(event, cb);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
    this.reconnectAttempts = 0;
  }

  on(event, callback) {
    // Store callback for reconnection
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    
    // Register on active socket
    this.socket?.on(event, callback);
  }

  off(event, callback) {
    // Remove from stored listeners
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
      if (this.listeners.get(event).size === 0) {
        this.listeners.delete(event);
      }
    }
    
    // Remove from active socket
    this.socket?.off(event, callback);
  }

  emit(event, ...args) {
    if (this.socket?.connected) {
      this.socket.emit(event, ...args);
      return true;
    }
    console.warn(`Cannot emit "${event}": Socket not connected`);
    return false;
  }

  isConnected() {
    return this.socket?.connected || false;
  }

  getSocketId() {
    return this.socket?.id || null;
  }
}

export const socketClient = new SocketClient();
