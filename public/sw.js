// Minimal service worker for PWA installability (A2HS)
// Does not provide offline capabilities
self.addEventListener('fetch', (event) => {
  // Just pass the request forward without caching, to satisfy PWA requirements
  event.respondWith(fetch(event.request));
});
