// Более продвинутый Service Worker
const CACHE_NAME = 'todo-pwa-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/style.css',
  '/src/app.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Установка
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Активация (очистка старых кешей)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Запросы (сначала кеш, потом сеть)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Из кеша
        }
        return fetch(event.request) // Из сети
          .then(response => {
            // Кешируем новые ресурсы
            return caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, response.clone());
                return response;
              });
          })
          .catch(() => {
            // Оффлайн: можно вернуть заглушку
            return caches.match('/index.html');
          });
      })
  );
});