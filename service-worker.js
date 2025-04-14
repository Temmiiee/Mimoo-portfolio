/**
 * Service Worker pour Mimoo Portfolio
 * Met en cache les ressources statiques pour améliorer les performances
 */

const CACHE_NAME = 'mimoo-portfolio-cache-v4';
const VERSION = '1.0.5';

self.addEventListener('install', event => {
    self.skipWaiting(); // Évite les messages de désinscription
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => cacheName !== CACHE_NAME)
                    .map(cacheName => caches.delete(cacheName))
            );
        }).catch(() => {
            // Silencieusement échouer
        })
    );
});

// Interception des requêtes
self.addEventListener('fetch', event => {
    // Ignorer les requêtes non GET
    if (event.request.method !== 'GET') return;

    // Ignorer les requêtes vers des API ou des services externes
    if (event.request.url.includes('/api/') ||
        event.request.url.includes('analytics') ||
        event.request.url.includes('chrome-extension')) {
        return;
    }

    // Stratégie spéciale pour les images et les polices - toujours aller au réseau d'abord
    if (event.request.url.includes('background.webp') ||
        event.request.url.includes('.webp') ||
        event.request.url.includes('.jpg') ||
        event.request.url.includes('.png') ||
        event.request.url.includes('fonts.googleapis.com') ||
        event.request.url.includes('fonts.gstatic.com') ||
        event.request.url.includes('cdnjs.cloudflare.com')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // Mettre à jour le cache avec la nouvelle réponse
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                    return response;
                })
                .catch(() => {
                    // En cas d'échec, essayer le cache
                    return caches.match(event.request);
                })
        );
        return;
    }

    // Pour les autres ressources, stratégie cache-first
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Retourner la réponse du cache si elle existe
                if (response) {
                    return response;
                }

                // Sinon, faire la requête au réseau
                return fetch(event.request)
                    .then(response => {
                        // Vérifier que la réponse est valide
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Cloner la réponse car elle ne peut être utilisée qu'une fois
                        const responseToCache = response.clone();

                        // Mettre en cache la nouvelle ressource
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                // Ne pas mettre en cache les modèles 3D volumineux
                                if (!event.request.url.endsWith('.obj') &&
                                    !event.request.url.endsWith('.mtl') &&
                                    !event.request.url.endsWith('.glb') &&
                                    !event.request.url.endsWith('.gltf')) {
                                    cache.put(event.request, responseToCache);
                                }
                            });

                        return response;
                    })
                    .catch(error => {
                        // En cas d'erreur réseau, essayer de servir la page d'accueil pour les requêtes de navigation
                        if (event.request.mode === 'navigate') {
                            return caches.match(BASE_PATH);
                        }

                        throw error;
                    });
            })
    );
});
