const RUNTIME = 'v1.01';
// eslint-disable-next-line no-restricted-globals
const worker = self;

// clean up old caches
worker.addEventListener('activate', (event) => {
  const currentCaches = [RUNTIME];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => cacheNames.filter((cacheName) => !currentCaches.includes(cacheName)))
      .then((cachesToDelete) => Promise.all(cachesToDelete.map((cacheToDelete) => caches.delete(cacheToDelete))))
      .then(() => worker.clients.claim()),
  );
});

worker.addEventListener('fetch', (event) => {
  // cache RUNTIME that is not graphql
  if (event.request.url.startsWith(worker.location.origin) && event.request.url.indexOf('/graphql') === -1) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return caches.open(RUNTIME).then((cache) => fetch(event.request).then((response) => (
          cache.put(event.request, response.clone()).then(() => response)
        )));
      }),
    );
  }
});
