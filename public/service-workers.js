const CACHE_NAME = 'falagiye-v2';
const OFFLINE_URL = '/offline.html';
const API_CACHE_NAME = 'falagiye-api-v2';
const IMAGE_CACHE_NAME = 'falagiye-images-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/wanted',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico',
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)),
      self.skipWaiting(),
    ])
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return name !== CACHE_NAME && 
                   name !== API_CACHE_NAME && 
                   name !== IMAGE_CACHE_NAME;
          })
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network first with cache fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (!url.origin.includes(self.location.origin)) {
    return;
  }

  // API requests - Network first, cache fallback, then offline queue
  if (url.pathname.includes('/api/')) {
    event.respondWith(handleAPIRequest(request));
    return;
  }

  // Image requests - Cache first, network fallback
  if (request.destination === 'image') {
    event.respondWith(handleImageRequest(request));
    return;
  }

  // Static assets - Cache first, network fallback
  if (request.destination === 'style' || 
      request.destination === 'script' || 
      request.destination === 'font') {
    event.respondWith(handleStaticRequest(request));
    return;
  }

  // Navigation requests - Network first, offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  // Default - Network first
  event.respondWith(
    fetch(request)
      .catch(() => caches.match(request))
      .catch(() => caches.match(OFFLINE_URL))
  );
});

// Handle API requests
async function handleAPIRequest(request) {
  try {
    // Try network first
    const response = await fetch(request.clone());
    
    // Cache successful GET responses
    if (request.method === 'GET' && response.ok) {
      const cache = await caches.open(API_CACHE_NAME);
      await cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If POST/PUT/DELETE, add to sync queue via message
    if (request.method !== 'GET') {
      // Send message to client to queue the request
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({
          type: 'OFFLINE_QUEUE',
          request: {
            url: request.url,
            method: request.method,
            body: await request.clone().text(),
            headers: Object.fromEntries(request.headers),
          },
        });
      });
    }
    
    // Return offline response
    return new Response(
      JSON.stringify({
        success: false,
        offline: true,
        message: 'You are offline. This action will be synced when you reconnect.',
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// Handle image requests
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE_NAME);
  
  // Try cache first
  const cached = await cache.match(request);
  if (cached) {
    // Update cache in background
    fetch(request).then((response) => {
      if (response.ok) {
        cache.put(request, response);
      }
    }).catch(() => {});
    
    return cached;
  }
  
  // Not in cache, try network
  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Return placeholder
    return new Response(
      '<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#F5F0E8"/><text x="50" y="55" text-anchor="middle" fill="#C4654A" font-size="14">📷</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
}

// Handle static asset requests
async function handleStaticRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  
  const cached = await cache.match(request);
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response('Resource not available offline', { status: 503 });
  }
}

// Handle navigation requests
async function handleNavigationRequest(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (error) {
    // Try to return cached page
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    
    // Return offline page
    return caches.match(OFFLINE_URL);
  }
}

// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'falagiye-sync') {
    event.waitUntil(syncOfflineData());
  }
});

async function syncOfflineData() {
  const clients = await self.clients.matchAll();
  
  clients.forEach(client => {
    client.postMessage({
      type: 'SYNC_TRIGGERED',
    });
  });
}

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  
  const options = {
    body: data.body || 'You have a new notification from Falagiye',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/wanted',
      ...data.data,
    },
    actions: data.actions || [],
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'ፈላጊዬ Falagiye',
      options
    )
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const url = event.notification.data?.url || '/wanted';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Check if already open
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
