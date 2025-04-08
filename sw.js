const CACHE_NAME = 'mimoo-portfolio-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/js/translations.js',
    '/js/language.js',
    '/images/mimoo.webp',
    '/fonts/Poppins-Regular.ttf',
    '/images/gallery/illustration1.webp',
    '/images/gallery/illustration2.webp',
    '/images/gallery/illustration3.webp',
    '/images/gallery/illustration4.webp',
    '/images/gallery/character1.webp',
    '/images/gallery/character2.webp',
    '/images/gallery/character3.webp',
    '/images/gallery/character4.webp',
    '/images/gallery/character5.webp',
    '/images/background.jpg'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).then(fetchResponse => {
                if (fetchResponse.status === 404) {
                    return new Response('Page not found', { status: 404 });
                }
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, fetchResponse.clone());
                    return fetchResponse;
                });
            });
        }).catch(() => {
            return new Response('Offline', { status: 503 });
        })
    );
});
