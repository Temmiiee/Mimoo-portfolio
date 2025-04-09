/**
 * Service Worker pour Mimoo Portfolio
 * Met en cache les ressources statiques pour améliorer les performances
 */

const CACHE_NAME = 'mimoo-portfolio-cache-v1';
// Détecter le chemin de base pour GitHub Pages
const BASE_PATH = self.location.pathname.includes('/Mimoo-portfolio/') ? '/Mimoo-portfolio/' : '/';

const ASSETS_TO_CACHE = [
    BASE_PATH,
    BASE_PATH + 'index.html',
    BASE_PATH + 'style.css',
    BASE_PATH + 'css/accessibility.css',
    BASE_PATH + 'js/script.js',
    BASE_PATH + 'js/config.js',
    BASE_PATH + 'js/translations.js',
    BASE_PATH + 'js/language.js',
    BASE_PATH + 'js/3dviewer-enhanced.js',
    BASE_PATH + 'js/redirect-optimized.js',
    BASE_PATH + 'js/load-resources.js',
    BASE_PATH + 'js/optimize-animations.js',
    BASE_PATH + 'js/model-loader.js',
    BASE_PATH + 'images/mimoo.webp',
    BASE_PATH + 'images/favicon.ico',
    BASE_PATH + 'images/background.webp',
    BASE_PATH + 'site.webmanifest'
];

// Installation du service worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                // Cache ouvert
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Activation du service worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => {
                    return cacheName !== CACHE_NAME;
                }).map(cacheName => {
                    return caches.delete(cacheName);
                })
            );
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
                            return caches.match('/');
                        }

                        throw error;
                    });
            })
    );
});
