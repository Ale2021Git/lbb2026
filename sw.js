const CACHE_NAME = 'bbraun-v1';
const assets = [
  './',
  './index.html',
  './manifest-v2.json',
  './maskable_icon_x192.png',
  './maskable_icon_x512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(assets))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});

