const CACHE_NAME = 'bbraun-scales-v5';

// Lista de arquivos para cache (devem ser nomes exatos do seu GitHub)
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './maskable_icon_x192.png',
  './maskable_icon_x512.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=JetBrains+Mono:wght@700&display=swap',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200'
];

// Instalação: Salva os arquivos essenciais no cache do navegador
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Arquivos em cache com sucesso!');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // Força a ativação imediata
});

// Ativação: Limpa versões antigas do cache para não dar conflito
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Interceptação de Busca: Essencial para o Chrome liberar o botão "Instalar"
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Retorna o arquivo do cache se existir, senão busca na internet
      return response || fetch(event.request);
    })
  );
});

