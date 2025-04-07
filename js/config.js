/**
 * Configuration pour Mimoo Portfolio
 * Ce fichier contient les paramètres de configuration pour l'environnement de production
 */

const CONFIG = {
    // Paramètres généraux
    production: true,
    debug: false,
    
    // Paramètres de cache
    cacheVersion: '1.0.0',
    
    // Paramètres de performance
    enableLazyLoading: true,
    enableImageOptimization: true,
    
    // Paramètres du visualisateur 3D
    threeDViewer: {
        defaultBackgroundColor: 0x333333,
        enableShadows: true,
        enableAntialiasing: true,
        maxTextureSize: 1024,
        maxPolygons: 500000,
        autoRotateSpeed: 0.5,
        cameraFOV: 45,
        cameraNear: 0.1,
        cameraFar: 1000,
        defaultLightIntensity: 1.0,
        defaultAmbientIntensity: 0.5
    },
    
    // URLs des CDN pour les ressources externes
    cdnUrls: {
        threeJs: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
        objLoader: 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/OBJLoader.js',
        mtlLoader: 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/MTLLoader.js',
        gltfLoader: 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js',
        dracoLoader: 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/DRACOLoader.js',
        orbitControls: 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js',
        gsap: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js',
        aos: 'https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js',
        aosCSS: 'https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css',
        fontAwesome: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
    },
    
    // Paramètres pour les modèles 3D
    models: {
        // Utiliser des CDN pour les modèles volumineux
        useCDN: true,
        cdnBaseUrl: 'https://portfolio-3d-models.b-cdn.net/',
        
        // Formats préférés (dans l'ordre de priorité)
        preferredFormats: ['glb', 'gltf', 'obj'],
        
        // Paramètres de compression
        enableDraco: true,
        dracoDecoderPath: 'https://www.gstatic.com/draco/versioned/decoders/1.4.1/'
    },
    
    // Paramètres d'analytics
    analytics: {
        enabled: true,
        trackingId: 'UA-XXXXXXXXX-X' // Remplacez par votre ID Google Analytics
    }
};

// Exposer la configuration globalement
window.CONFIG = CONFIG;
