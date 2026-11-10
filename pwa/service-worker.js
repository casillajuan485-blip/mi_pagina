/* PWA: mantiene intactos los scripts, estilos y contenido originales. */
const CACHE_NAME = 'beimar-original-pwa-v2';
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/extra.css",
  "./css/menu.css",
  "./css/efectos.css",
  "./css/estilo.css",
  "./js/menu.js",
  "./js/efectos.js",
  "./js/app.js",
  "./img/silent_hill.jpg",
  "./img/left4_dead.jpg",
  "./img/cuphead.jpg",
  "./img/hit_run.jpg",
  "./img/mobil.jpg",
  "./img/clash_royal.jpg",
  "./img/teken.jpg",
  "./img/resident_evil.jpg",
  "./img/good_of_war.jpg",
  "./img/efootbal.jpg",
  "./img/freddys.jpg",
  "./img/clash_of_clans.jpg",
  "./img/pasatiempo.jpg",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith('beimar-original-pwa-') && name !== CACHE_NAME).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith((async () => {
    try {
      const response = await fetch(event.request);
      if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, response.clone());
      }
      return response;
    } catch (error) {
      const cached = await caches.match(event.request);
      if (cached) return cached;
      if (event.request.mode === 'navigate') {
        const fallback = await caches.match('./index.html');
        if (fallback) return fallback;
      }
      return Response.error();
    }
  })());
});
