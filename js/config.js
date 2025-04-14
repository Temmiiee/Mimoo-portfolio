/**
 * Configuration pour Mimoo Portfolio
 * Version simplifiée avec uniquement les paramètres essentiels
 */

const CONFIG = {
    // Paramètres généraux
    production: true,
    debug: false,
    logging: {
        level: 'error', // Uniquement les erreurs critiques en production
        console: {
            debug: () => {}, // Désactiver console.debug en production
            log: () => {}, // Désactiver console.log en production
            warn: console.warn, // Garder les avertissements
            error: console.error // Garder les erreurs
        }
    }
};

// Remplacer console en production
if (CONFIG.production) {
    console = { ...console, ...CONFIG.logging.console };
}

// Paramètres de performance
enableLazyLoading: true,
enableImageOptimization: true,

// Paramètres du visualisateur 3D
threeDViewer: {
    defaultBackgroundColor: 0x333333,
    enableShadows: false, // Désactivé pour améliorer les performances
    enableAntialiasing: false, // Désactivé pour améliorer les performances
    autoRotateSpeed: 0.5,
    cameraFOV: 45,
    defaultLightIntensity: 1.0,
    defaultAmbientIntensity: 0.8 // Augmenté pour compenser l'absence d'ombres
},

// URLs des CDN pour les ressources essentielles
cdnUrls: {
    threeJs: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
    objLoader: 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/OBJLoader.js',
    orbitControls: 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js'
};

// Exposer la configuration globalement
window.CONFIG = CONFIG;
