/**
 * Service Worker pour Mimoo Portfolio
 * Version propre et fonctionnelle
 */

const CACHE_VERSION = '1.1.0';
const CACHE_NAME = `mimoo-portfolio-${CACHE_VERSION}`;

const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './admin.html',
    './css/main.css',
    './css/variables.css',
    './css/base.css',
    './css/components.css',
    './css/layout.css',
    './css/animations.css',
    './css/snail.css',
    './css/utilities.css',
    './css/custom.css',
    './js/translations.js',
    './js/language.js',
    './js/portfolio-images.js',
    './js/config.js',
    './js/script.js',
    './js/upload.js',
    './images/favicon.ico',
    './images/mimoo.webp',
    './images/background.webp',
    './images/snail.png'
];

// Install Event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

// Activate Event
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Event
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);
    
    // External resources (CDN) - Network first, then cache
    if (url.origin !== self.location.origin) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
                    return response;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    // Local resources - Stale While Revalidate
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            const fetchPromise = fetch(event.request).then(networkResponse => {
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse.clone()));
                return networkResponse;
            });
            return cachedResponse || fetchPromise;
        })
    );
});
