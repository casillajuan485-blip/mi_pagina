
/* ==========================================
   SERVICE WORKER - MI PÁGINA PERSONAL
   Versión offline mejorada
========================================== */

const CACHE_NAME = "beimar-original-pwa-v3";

const CORE_ASSETS = [
    "./",
    "./index.html",
    "./manifest.json",

    // Archivos CSS
    "./css/estilo.css",
    "./css/efectos.css",
    "./css/menu.css",
    "./css/extra.css",

    // Archivos JavaScript
    "./js/app.js",
    "./js/efectos.js",
    "./js/menu.js",

    // Imágenes locales
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

    // Iconos de instalación
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];

// ==========================================
// INSTALACIÓN
// ==========================================

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(CORE_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// ==========================================
// ACTIVACIÓN
// ==========================================

self.addEventListener("activate", event => {
    event.waitUntil(
        (async () => {
            const nombres = await caches.keys();

            await Promise.all(
                nombres
                    .filter(nombre =>
                        nombre.startsWith("beimar-original-pwa-") &&
                        nombre !== CACHE_NAME
                    )
                    .map(nombre => caches.delete(nombre))
            );

            await self.clients.claim();
        })()
    );
});

// ==========================================
// INTERCEPTAR SOLICITUDES
// ==========================================

self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") return;

    const url = new URL(event.request.url);

    // Los recursos externos siguen usando Internet.
    if (url.origin !== self.location.origin) return;

    event.respondWith(
        (async () => {

            const cache = await caches.open(CACHE_NAME);

            // Primero intentar desde la caché
            const recursoGuardado =
                await cache.match(event.request);

            if (recursoGuardado) {
                return recursoGuardado;
            }

            // Si no existe en caché, intentar Internet
            try {
                const respuesta = await fetch(event.request);

                if (respuesta.ok) {
                    await cache.put(
                        event.request,
                        respuesta.clone()
                    );
                }

                return respuesta;

            } catch (error) {

                // Respaldo para navegación sin conexión
                if (event.request.mode === "navigate") {
                    const inicio =
                        await cache.match("./index.html");

                    if (inicio) return inicio;
                }

                return Response.error();
            }
        })()
    );
});
