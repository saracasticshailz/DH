const CACHE_NAME = 'DH4';
const IMAGE_CACHE = 'adcb-images-v1';
const OFFLINE_PAGE = '/offline.html';
const OFFLINE_IMAGE = '/images/offline-image.png';

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  OFFLINE_PAGE,
  OFFLINE_IMAGE,
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)), caches.open(IMAGE_CACHE)])
  );
  // Activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME, IMAGE_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all clients
  return self.clients.claim();
});

// Fetch event - handle different resource types
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // HTML navigation - Network first, fallback to cache, then offline page
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((fetchResponse) => {
          const responseToCache = fetchResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return fetchResponse;
        })
        .catch(() => {
          return caches.match(event.request).then((cacheResponse) => {
            return cacheResponse || caches.match(OFFLINE_PAGE);
          });
        })
    );
    return;
  }

  // API requests - Network only with error fallback
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({ error: 'You are offline' }), {
          headers: { 'Content-Type': 'application/json' },
        });
      })
    );
    return;
  }

  // Images - Cache first, then network with cache update, fallback to placeholder
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request).then((cacheResponse) => {
        const fetchPromise = fetch(event.request)
          .then((fetchResponse) => {
            caches.open(IMAGE_CACHE).then((cache) => {
              cache.put(event.request, fetchResponse.clone());
            });
            return fetchResponse;
          })
          .catch(() => {
            return caches.match(OFFLINE_IMAGE);
          });

        return cacheResponse || fetchPromise;
      })
    );
    return;
  }

  // All other assets - Cache first with network fallback
  event.respondWith(
    caches.match(event.request).then((cacheResponse) => {
      return (
        cacheResponse ||
        fetch(event.request).then((fetchResponse) => {
          // Cache successful responses
          if (fetchResponse.ok) {
            const responseToCache = fetchResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return fetchResponse;
        })
      );
    })
  );
});

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'form-post') {
    event.waitUntil(
      // Get data from IndexedDB and send when online
      sendOfflineData()
    );
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();

    const options = {
      body: data.body || 'New notification',
      icon: '/icon-192x192.png',
      badge: '/badge-icon.png',
      data: {
        url: data.url || '/',
      },
    };

    event.waitUntil(self.registration.showNotification(data.title || 'Notification', options));
  } catch (e) {
    console.error('Push notification error:', e);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(clients.openWindow(event.notification.data.url));
  }
});

// Helper function for background sync
async function sendOfflineData() {
  // Implementation would depend on how you store offline data
  // This is just a placeholder
  try {
    // Get stored form data from IndexedDB
    // const offlineData = await getOfflineDataFromIndexedDB();
    // for (const item of offlineData) {
    //   await fetch(item.url, {
    //     method: item.method,
    //     headers: item.headers,
    //     body: item.body
    //   });
    //
    //   // Remove from IndexedDB if successful
    //   await removeFromIndexedDB(item.id);
    // }
  } catch (error) {
    console.error('Error sending offline data:', error);
  }
}
