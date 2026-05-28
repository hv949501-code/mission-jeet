const CACHE_NAME = 'study-hv-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/drona.html',
  '/aarambh.html',
  '/abhay.html',
  '/styles.css',
  '/sync.js',
  '/icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Try network first, fallback to cache for HTML/CSS/JS.
  // We want to ensure we get the latest if online, but load fast if offline.
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone response and update cache
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
