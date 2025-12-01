self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open("pwa-static-v1").then((cache) => {
      return cache.addAll(["/offline.html"]);
    })
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});

const API_CACHE = "pwa-api-cache-v1";

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Only handle same-origin API calls (adjust if proxying)
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(API_CACHE);
        const cached = await cache.match(event.request);

        const networkFetch = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => null);

        return cached || (await networkFetch) || (await caches.match("/offline.html"));
      })()
    );
    return;
  }

  // Default: try network then cache
  event.respondWith(
    fetch(event.request)
      .then((r) => r)
      .catch(async () => {
        const cache = await caches.open("pwa-static-v1");
        return (await cache.match(event.request)) || (await cache.match("/offline.html"));
      })
  );
});

self.addEventListener("sync", (event) => {
  if (event.tag === "sync-cambios") {
    event.waitUntil(
      self.registration.fetch && fetch("/api/sync-pending", { method: "POST" }).catch(()=>{})
    );
  }
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "TRIGGER_SYNC") {
    self.registration.sync && self.registration.sync.register("sync-cambios").catch(()=>{});
  }
});
