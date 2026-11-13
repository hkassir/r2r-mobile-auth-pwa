const CACHE_PREFIX = 'rad2rad-pwa-public-';
const CACHE_NAME = CACHE_PREFIX + '20261002-credentialing-assertion-1';
const BASE = self.registration.scope;
const OFFLINE_URL = new URL('offline.html', BASE).href;
const PUBLIC_URLS = [
  OFFLINE_URL,
  new URL('pwa/icon-180.png', BASE).href,
  new URL('pwa/icon-192.png', BASE).href,
  new URL('pwa/icon-512.png', BASE).href,
];
const ENABLED = self.location.origin === 'https://auth-mobile.intelligentradiology.ai';

self.addEventListener('install', event => {
  if (!ENABLED) return;
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(PUBLIC_URLS.map(url => new Request(url, {
      credentials: 'omit', cache: 'reload',
    })));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  if (!ENABLED) return;
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (!ENABLED || request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(new Request(request, { cache: 'no-store' })).catch(async () => {
      const cache = await caches.open(CACHE_NAME);
      return (await cache.match(OFFLINE_URL)) || new Response(
        'Connection required. Reconnect and reload Rad2Rad.',
        { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
      );
    }));
    return;
  }
  if (!PUBLIC_URLS.includes(url.href)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    return (await cache.match(url.href)) || fetch(request);
  })());
});
