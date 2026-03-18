// Nome do cache - Altere a versão (v1.1, v1.2...) sempre que atualizar o HTML ou CSS
const CACHE_NAME = 'braun-v1.1';

// Lista de arquivos essenciais para o funcionamento offline
const assets = [
  './',
  './index.html',
  './manifest.json',
  './maskable_icon_x192.png',
  './maskable_icon_x512.png'
];

// 1. Instalação: Salva os arquivos essenciais no cache do navegador
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('PWA: Arquivos básicos armazenados no cache.');
      return cache.addAll(assets);
    })
  );
  // Força o Service Worker a se tornar ativo imediatamente
  self.skipWaiting();
});

// 2. Ativação: Remove caches de versões antigas para liberar espaço e evitar conflitos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('PWA: Removendo cache antigo:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  // Garante que o Service Worker controle a página imediatamente
  self.clients.claim();
});

// 3. Interceptação de Busca (Fetch): Estratégia Stale-While-Revalidate
// Serve o conteúdo do cache para velocidade máxima, mas busca atualização na rede
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Se a resposta da rede for válida, atualiza o cache para a próxima visita
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback: Se a rede falhar e não houver cache, você pode retornar uma página offline aqui
      });

      // Retorna o cache se existir, caso contrário espera pela rede
      return cachedResponse || fetchPromise;
    })
  );
});

