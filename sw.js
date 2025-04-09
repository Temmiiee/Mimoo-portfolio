/**
 * Service Worker pour Mimoo Portfolio
 * Gère le cache et assure que les utilisateurs ont toujours la dernière version du site
 */

// Version du cache - à incrémenter à chaque mise à jour majeure
const CACHE_VERSION = '1.0.1';
const CACHE_NAME = `mimoo-portfolio-${CACHE_VERSION}`;

// Liste des fichiers à mettre en cache immédiatement
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/css/unified-styles.css',
    '/css/fixes.css',
    '/css/accessibility-menu.css',
    '/js/translations.js',
    '/js/language.js',
    '/js/config.js',
    '/js/accessibility-manager.js',
    '/js/accessibility-preferences.js',
    '/js/optimize-animations.js',
    '/js/redirect-optimized.js',
    '/js/script.js',
    '/js/3dviewer.js',
    '/images/favicon.ico',
    '/images/mimoo.webp',
    '/images/gallery/illustration1.webp',
    '/images/gallery/illustration2.webp',
    '/images/gallery/illustration3.webp',
    '/images/gallery/illustration4.webp',
    '/images/gallery/character1.webp',
    '/images/gallery/character2.webp',
    '/images/gallery/character3.webp',
    '/images/gallery/character4.webp',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Mise en cache des fichiers essentiels');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => {
                // Force l'activation immédiate sans attendre la fermeture des onglets
                return self.skipWaiting();
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Supprimer les anciens caches
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Suppression de l\'ancien cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            // Prendre le contrôle de tous les clients sans recharger
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', event => {
    // Ignorer les requêtes non GET
    if (event.request.method !== 'GET') return;

    // Ignorer les requêtes vers d'autres domaines
    const url = new URL(event.request.url);
    if (url.origin !== self.location.origin) return;

    // Stratégie pour les fichiers HTML et CSS : toujours depuis le réseau d'abord
    if (event.request.url.includes('.html') ||
        event.request.url.includes('.css') ||
        event.request.url.includes('.js') ||
        event.request.url.endsWith('/')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // Mettre en cache une copie de la réponse
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                    return response;
                })
                .catch(() => {
                    // En cas d'échec, essayer de servir depuis le cache
                    return caches.match(event.request);
                })
        );
        return;
    }

    // Stratégie pour les autres fichiers : cache d'abord, puis réseau
    event.respondWith(
        caches.match(event.request).then(response => {
            // Retourner la réponse du cache si elle existe
            if (response) {
                return response;
            }

            // Sinon, faire une requête réseau
            return fetch(event.request).then(fetchResponse => {
                if (fetchResponse.status === 404) {
                    return new Response('Page not found', { status: 404 });
                }

                // Mettre en cache la nouvelle réponse
                const responseClone = fetchResponse.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseClone);
                });

                return fetchResponse;
            }).catch(error => {
                console.error('Fetch failed:', error);
                return new Response('Network error', { status: 500 });
            });
        })
    );
});

// Gestion des messages
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.delete(CACHE_NAME).then(() => {
                console.log('Service Worker: Cache effacé sur demande');
            })
        );
    }
});
