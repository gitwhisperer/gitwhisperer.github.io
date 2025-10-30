const CACHE_NAME = 'harshit-v11';
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
  const url = new URL(e.request.url);
  
  // Network-first for HTML, CSS, JS to get latest updates without hard refresh
  if (url.pathname.endsWith('.html') || url.pathname.endsWith('.css') || url.pathname.endsWith('.js') || url.pathname === '/' || url.pathname === '/index.html') {
    e.respondWith(
      fetch(e.request)
        .then(response => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, responseClone));
          return response;
        })
        .catch(() => caches.match(e.request))
    );
  } else {
    // Cache-first for images and other assets
    e.respondWith(
      caches.match(e.request).then((resp) => resp || fetch(e.request))
    );
  }
});
