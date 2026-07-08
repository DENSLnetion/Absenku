// Naikkan versi ini tiap kali kamu deploy update, biar cache lama dibuang
// dan pengguna otomatis dapet versi terbaru.
const CACHE_NAME = 'absenku-cache-v1';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Install: simpan app shell ke cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// Activate: bersihin cache versi lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: stale-while-revalidate
// -> langsung balikin versi cache (kalau ada) biar cepat & bisa offline,
//    sambil diam-diam ambil versi terbaru dari network buat update cache.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Lewatin request cross-origin (misal API pihak ketiga), fokus ke app shell sendiri saja
  if (new URL(event.request.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);

      return cached || networkFetch;
    })
  );
});
