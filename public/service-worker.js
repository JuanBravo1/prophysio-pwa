/* eslint-disable no-restricted-globals */

// Nombre del caché y recursos que se guardarán
const CACHE_NAME = "prophysio-cache-v3";

const urlsToCache = [
  "./",
  "./index.html",
  "./offline.html",
  "./manifest.json",
  "./logo192.png",
  "./logo512.png",
  "./favicon.ico",
  "./static/css/main.bfe85ce1.css",
  "./static/js/main.7aba3e77.js"
];

// Instalar y cachear recursos
self.addEventListener("install", (event) => {
  console.log("🟢 Instalando service worker...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("✅ Archivos cacheados:", urlsToCache);
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activar y limpiar versiones antiguas del caché
self.addEventListener("activate", (event) => {
  console.log("♻️ Activando nuevo service worker...");
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.map((n) => n !== CACHE_NAME && caches.delete(n)))
    )
  );
  self.clients.claim();
});

// Interceptar peticiones
self.addEventListener("fetch", (event) => {
  // Solo maneja peticiones GET
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Devuelve desde caché si existe
      if (cachedResponse) return cachedResponse;

      // Si no, intenta desde red
      return fetch(event.request)
        .then((response) => {
          // Guarda en caché nuevo recurso si la respuesta es válida
          if (!response || response.status !== 200 || response.type !== "basic")
            return response;

          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Si falla, muestra offline.html solo para navegaciones
          if (event.request.mode === "navigate") {
            return caches.match("./offline.html");
          }
        });
    })
  );
});
