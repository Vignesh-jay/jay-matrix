const CACHE_NAME = "jay-matrix-v1";

const urlsToCache = [

    "/",
    "/index.html",
    "/css/style.css",
    "/js/app.js",
    "/manifest.json",
    "/assets/favicon.ico",
    "/assets/icon-192.png",
    "/assets/icon-512.png"
];

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)
        .then(cache =>
            cache.addAll(urlsToCache)
        )
    );
});

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)
        .then(response => {

            return response ||
                   fetch(event.request);
        })
    );
});