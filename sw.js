const CACHE_NAME = 'braun-online-v3.3-2026';
const LOCAL_ASSETS = [
  './index.html',
  './manifest.json',
  './maskable_icon_x192.png',
  './maskable_icon_x512.png',
  './logo-cup.png',
  './qr-code.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(LOCAL_ASSETS))
      .then(() => self.skipWaiting())
      .catch(err => console.error('[SW] Erro no cache:', err))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => key !== CACHE_NAME && caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        if (cached) return cached;

        return fetch(event.request)
          .then(response => {
            if (response && response.status === 200 &&
                event.request.url.startsWith(self.location.origin)) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
            }
            return response;
          })
          .catch(() => {
            if (event.request.destination === 'document') {
              return caches.match('./index.html');
            }
            if (event.request.destination === 'image') {
              return new Response('', { status: 404 });
            }
            return new Response('Offline', { status: 503 });
          });
      })
  );
});
