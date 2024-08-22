const CACHE_NAME = "online-3d-viewer-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/build/website_dev/o3dv.website.min.js",
  "/build/website_dev/o3dv.website.min.css",
  // 필요한 다른 자산들을 추가하세요
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 네트워크 요청이 성공하면 캐시에 복사본을 저장
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // 네트워크 요청이 실패하면 캐시에서 응답
        return caches.match(event.request);
      })
  );
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
