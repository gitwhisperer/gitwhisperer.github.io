const CACHE_NAME = 'harshit-v5';
self.addEventListener('install', (e) => {
  self.skipWaiting();
  const toCache = [
    './',
    './index.html',
    './styles/style.css',
    './scripts/main.js',
    './assets/favicon.svg',
    './assets/portrait-placeholder.svg',
  './assets/harshit.JPG',
  './robots.txt',
  './sitemap.xml',
  './404.html',
  './harshit.html',
  './tinker.html',
  './web-dev.html',
  './freelance.html'
  ];
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(toCache))
  );
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((resp) => resp || fetch(e.request))
  );
});
