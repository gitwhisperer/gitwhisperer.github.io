const CACHE_NAME = 'harshit-v3';
self.addEventListener('install', (e) => {
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
  './404.html'
  ];
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(toCache))
  );
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((resp) => resp || fetch(e.request))
  );
});
