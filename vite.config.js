import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import tailwindcss from "@tailwindcss/vite"

const shouldIgnoreError = (msg) => {
  const ignoredPatterns = [
    'ECONNABORTED',
    'ECONNREFUSED',
    'write ECONNABORTED',
    'ws proxy error',
    'ws proxy socket error',
    'socket hang up',
  ];
  return ignoredPatterns.some(pattern => msg.includes(pattern));
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname), '');
  
  // Ensure we don't proxy to the same port
  let BACKEND_URL = env.VITE_API_URL || 'http://localhost:5500';
  if (BACKEND_URL.includes(':5173')) {
    console.warn('⚠️ VITE_API_URL is pointing to the same port as Vite (5173). Defaulting to http://localhost:5500 for proxy target.');
    BACKEND_URL = 'http://localhost:5500';
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'favicon.ico',
          'apple-touch-icon.png',
          'offline.html',
          'icon-*.png',
        ],
        manifest: false,
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
          globIgnores: ['assets/zego-uikit-prebuilt-*.js'],
          runtimeCaching: [
            {
              urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
              handler: 'NetworkFirst',
              options: {
                cacheName: 'falagiye-api',
                expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: /\.(png|jpg|jpeg|webp|svg|gif)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'falagiye-images',
                expiration: { maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-stylesheets',
                expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-webfonts',
                expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    
    server: {
      port: 5173,
      
      proxy: {
        '/api': {
          target: BACKEND_URL,
          changeOrigin: true,
          secure: false,
          ws: false,  
          configure: (proxy) => {
            proxy.on('error', (err) => {
              if (!shouldIgnoreError(err.message)) {
                console.error(' API Proxy error:', err.message);
              }
            });
          },
        },
        
        '/health': {
          target: BACKEND_URL,
          changeOrigin: true,
          secure: false,
        },
        
        '/uploads': {
          target: BACKEND_URL,
          changeOrigin: true,
          secure: false,
        },
        
        '/socket.io': {
          target: BACKEND_URL,
          changeOrigin: true,
          secure: false,
          ws: true,
          configure: (proxy) => {
            proxy.on('error', (err) => {
              if (!shouldIgnoreError(err.message)) {
                console.error('❌ Socket Proxy error:', err.message);
              }
            });
            proxy.on('proxyReqWs', (proxyReq, req, socket, options, head) => {
              //  Handle WebSocket upgrade properly
              socket.on('error', (err) => {
                if (!shouldIgnoreError(err.message)) {
                  console.error('❌ WS Socket error:', err.message);
                }
              });
            });
          },
        },
      },
      
      hmr: {
        overlay: false,  
      },
    },
    
    //  Override console methods to filter errors
    customLogger: {
      info: (msg) => {
        if (!shouldIgnoreError(msg)) {
          console.log('[vite]', msg);
        }
      },
      warn: (msg) => {
        if (!shouldIgnoreError(msg)) {
          console.warn('[vite]', msg);
        }
      },
      error: (msg) => {
        if (msg.includes('[vite] ws proxy')) {
          return;
        }
        if (!shouldIgnoreError(msg)) {
          console.error('[vite]', msg);
        }
      },
      warnOnce: (msg) => {
        if (!shouldIgnoreError(msg)) {
          console.warn('[vite]', msg);
        }
      },
    },
  };
});
