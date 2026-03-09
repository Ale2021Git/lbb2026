const CACHE_NAME = 'braun-online-v2'; // Nome único para este app
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './style.css', // Verifique se o nome é exatamente este
  './script.js'  // Verifique se o nome é exatamente este
];

// Instalação e Cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Ativação e Limpeza de caches antigos deste app
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME && key.startsWith('braun-')).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Estratégia Offline (Tenta rede, se falhar, usa cache)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

