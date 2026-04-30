import { openDB } from 'idb';

const DB_NAME = 'falagiye_offline';
const DB_VERSION = 2;

class OfflineStorage {
  constructor() {
    this.db = null;
    this.initPromise = null;
  }

  async init() {
    if (this.db) return this.db;
    
    if (!this.initPromise) {
      this.initPromise = this._initializeDB();
    }
    
    return this.initPromise;
  }

  async _initializeDB() {
    try {
      this.db = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db, oldVersion, newVersion, transaction) {
          console.log(`Upgrading DB from ${oldVersion} to ${newVersion}`);

          // Posts Store
          if (!db.objectStoreNames.contains('posts')) {
            const postsStore = db.createObjectStore('posts', { keyPath: '_id' });
            postsStore.createIndex('by_status', 'status');
            postsStore.createIndex('by_city', 'city');
            postsStore.createIndex('by_updated', 'updatedAt');
          }

          // Claims Store
          if (!db.objectStoreNames.contains('claims')) {
            const claimsStore = db.createObjectStore('claims', { keyPath: '_id' });
            claimsStore.createIndex('by_status', 'status');
            claimsStore.createIndex('by_post', 'post');
          }

          // Messages Store
          if (!db.objectStoreNames.contains('messages')) {
            const messagesStore = db.createObjectStore('messages', { 
              keyPath: '_id',
              autoIncrement: true 
            });
            messagesStore.createIndex('by_room', 'chatRoom');
            messagesStore.createIndex('by_timestamp', 'createdAt');
            messagesStore.createIndex('by_synced', 'synced');
          }

          // Sync Queue Store
          if (!db.objectStoreNames.contains('syncQueue')) {
            const queueStore = db.createObjectStore('syncQueue', { 
              keyPath: 'id',
              autoIncrement: true 
            });
            queueStore.createIndex('by_action', 'action');
            queueStore.createIndex('by_timestamp', 'timestamp');
            queueStore.createIndex('by_attempts', 'attempts');
          }

          // User Data Store
          if (!db.objectStoreNames.contains('userData')) {
            db.createObjectStore('userData', { keyPath: 'key' });
          }

          // Drafts Store
          if (!db.objectStoreNames.contains('drafts')) {
            const draftsStore = db.createObjectStore('drafts', { 
              keyPath: 'id',
              autoIncrement: true 
            });
            draftsStore.createIndex('by_type', 'type');
            draftsStore.createIndex('by_updated', 'updatedAt');
          }
        },
      });

      console.log('✅ Offline storage initialized');
      return this.db;
    } catch (error) {
      console.error('Failed to initialize offline storage:', error);
      this.initPromise = null;
      throw error;
    }
  }

  // ============ POSTS ============
  
  async cachePosts(posts) {
    const db = await this.init();
    const tx = db.transaction('posts', 'readwrite');
    
    for (const post of posts) {
      await tx.store.put({
        ...post,
        cachedAt: Date.now(),
      });
    }
    
    await tx.done;
  }

  async getCachedPosts(filters = {}) {
    const db = await this.init();
    const tx = db.transaction('posts', 'readonly');
    
    let posts = await tx.store.getAll();
    
    // Apply filters
    if (filters.status) {
      posts = posts.filter(p => p.status === filters.status);
    }
    if (filters.city) {
      const cityLower = filters.city.toLowerCase();
      posts = posts.filter(p => p.city?.toLowerCase().includes(cityLower));
    }
    if (filters.category) {
      posts = posts.filter(p => p.category === filters.category);
    }
    
    // Sort by date
    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return posts;
  }

  async getPost(id) {
    const db = await this.init();
    return await db.get('posts', id);
  }

  async deletePost(id) {
    const db = await this.init();
    await db.delete('posts', id);
  }

  // ============ CLAIMS ============
  
  async cacheClaims(claims) {
    const db = await this.init();
    const tx = db.transaction('claims', 'readwrite');
    
    for (const claim of claims) {
      await tx.store.put({
        ...claim,
        cachedAt: Date.now(),
      });
    }
    
    await tx.done;
  }

  async getCachedClaims(type = 'all') {
    const db = await this.init();
    const tx = db.transaction('claims', 'readonly');
    
    let claims = await tx.store.getAll();
    
    if (type === 'pending') {
      claims = claims.filter(c => c.status === 'pending');
    } else if (type === 'my') {
      claims = claims.filter(c => c.status !== 'pending');
    }
    
    return claims;
  }

  // ============ MESSAGES ============
  
  async cacheMessage(message) {
    const db = await this.init();
    const tx = db.transaction('messages', 'readwrite');
    
    await tx.store.put({
      ...message,
      synced: message.synced ?? false,
      cachedAt: Date.now(),
    });
    
    await tx.done;
  }

  async cacheMessages(roomId, messages) {
    const db = await this.init();
    const tx = db.transaction('messages', 'readwrite');
    
    for (const message of messages) {
      await tx.store.put({
        ...message,
        chatRoom: roomId,
        synced: true,
        cachedAt: Date.now(),
      });
    }
    
    await tx.done;
  }

  async getCachedMessages(roomId, limit = 50) {
    const db = await this.init();
    const tx = db.transaction('messages', 'readonly');
    const index = tx.store.index('by_room');
    
    let messages = await index.getAll(roomId);
    
    // Sort by timestamp
    messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    // Return last N messages
    return messages.slice(-limit);
  }

  async getUnsyncedMessages() {
    const db = await this.init();
    const tx = db.transaction('messages', 'readonly');
    const index = tx.store.index('by_synced');
    
    return await index.getAll(false);
  }

  async markMessageSynced(messageId) {
    const db = await this.init();
    const tx = db.transaction('messages', 'readwrite');
    
    const message = await tx.store.get(messageId);
    if (message) {
      message.synced = true;
      await tx.store.put(message);
    }
    
    await tx.done;
  }

  // ============ SYNC QUEUE ============
  
  async addToQueue(action, data) {
    const db = await this.init();
    const tx = db.transaction('syncQueue', 'readwrite');
    
    const id = await tx.store.add({
      action,
      data,
      timestamp: Date.now(),
      attempts: 0,
      lastAttempt: null,
    });
    
    await tx.done;
    
    // Register for background sync
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('falagiye-sync');
    }
    
    return id;
  }

  async getQueueItems() {
    const db = await this.init();
    const tx = db.transaction('syncQueue', 'readonly');
    return await tx.store.getAll();
  }

  async updateQueueItem(id, updates) {
    const db = await this.init();
    const tx = db.transaction('syncQueue', 'readwrite');
    
    const item = await tx.store.get(id);
    if (item) {
      Object.assign(item, updates);
      await tx.store.put(item);
    }
    
    await tx.done;
  }

  async removeFromQueue(id) {
    const db = await this.init();
    const tx = db.transaction('syncQueue', 'readwrite');
    await tx.store.delete(id);
    await tx.done;
  }

  async clearQueue() {
    const db = await this.init();
    const tx = db.transaction('syncQueue', 'readwrite');
    await tx.store.clear();
    await tx.done;
  }

  // ============ DRAFTS ============
  
  async saveDraft(type, data) {
    const db = await this.init();
    const tx = db.transaction('drafts', 'readwrite');
    
    // Check if draft exists
    const index = tx.store.index('by_type');
    const existing = await index.get(type);
    
    if (existing) {
      existing.data = data;
      existing.updatedAt = Date.now();
      await tx.store.put(existing);
    } else {
      await tx.store.add({
        type,
        data,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
    
    await tx.done;
  }

  async getDraft(type) {
    const db = await this.init();
    const tx = db.transaction('drafts', 'readonly');
    const index = tx.store.index('by_type');
    
    return await index.get(type);
  }

  async deleteDraft(type) {
    const db = await this.init();
    const tx = db.transaction('drafts', 'readwrite');
    const index = tx.store.index('by_type');
    
    const draft = await index.get(type);
    if (draft) {
      await tx.store.delete(draft.id);
    }
    
    await tx.done;
  }

  async getAllDrafts() {
    const db = await this.init();
    const tx = db.transaction('drafts', 'readonly');
    return await tx.store.getAll();
  }

  // ============ USER DATA ============
  
  async saveUserData(key, data) {
    const db = await this.init();
    const tx = db.transaction('userData', 'readwrite');
    
    await tx.store.put({
      key,
      data,
      updatedAt: Date.now(),
    });
    
    await tx.done;
  }

  async getUserData(key) {
    const db = await this.init();
    const tx = db.transaction('userData', 'readonly');
    
    const result = await tx.store.get(key);
    return result?.data;
  }

  // ============ CLEANUP ============
  
  async cleanup(maxAge = 7 * 24 * 60 * 60 * 1000) {
    const db = await this.init();
    const cutoff = Date.now() - maxAge;
    
    const stores = ['posts', 'claims', 'messages'];
    
    for (const storeName of stores) {
      const tx = db.transaction(storeName, 'readwrite');
      let cursor = await tx.store.openCursor();
      
      while (cursor) {
        const timestamp = cursor.value.cachedAt || 
                         cursor.value.createdAt || 
                         cursor.value.timestamp;
        
        if (timestamp && timestamp < cutoff) {
          await cursor.delete();
        }
        cursor = await cursor.continue();
      }
      
      await tx.done;
    }
    
    console.log('✅ Cleaned up old offline data');
  }

  async clearAll() {
    const db = await this.init();
    const stores = ['posts', 'claims', 'messages', 'syncQueue', 'drafts'];
    
    for (const storeName of stores) {
      const tx = db.transaction(storeName, 'readwrite');
      await tx.store.clear();
      await tx.done;
    }
    
    console.log('✅ All offline data cleared');
  }


async clearStuckItems() {
  const db = await this.init();
  const tx = db.transaction('syncQueue', 'readwrite');
  
  let cursor = await tx.store.openCursor();
  
  while (cursor) {
    // Remove items that have failed 3+ times or are older than 1 day
    const isStuck = cursor.value.attempts >= 3;
    const isOld = Date.now() - cursor.value.timestamp > 24 * 60 * 60 * 1000;
    
    if (isStuck || isOld) {
      console.log(`Removing stuck item: ${cursor.value.id}`);
      await cursor.delete();
    }
    
    cursor = await cursor.continue();
  }
  
  await tx.done;
}
}

export const offlineStorage = new OfflineStorage();
