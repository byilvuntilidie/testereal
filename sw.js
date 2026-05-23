const CACHE_NAME = 'rotina-ios-v2';

// Instala o novo Service Worker imediatamente
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

// Estratégia "Rede Primeiro": Tenta ir buscar a versão nova à Vercel. 
// Se não tiver internet, mostra a versão guardada no telemóvel.
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Guarda a versão mais recente silenciosamente
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        return response;
      })
      .catch(() => {
        // Se falhar (offline), usa o que tem guardado
        return caches.match(event.request);
      })
  );
});
