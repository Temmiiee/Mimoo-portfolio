// Définir l'espace de noms THREE s'il n'existe pas déjà
window.THREE = window.THREE || {};

// Indicateur pour suivre le chargement
window.threeJsLoaded = false;

// Fonction pour indiquer que le bundle est chargé
function notifyThreeJsLoaded() {
    window.threeJsLoaded = true;
    // Déclencher un événement personnalisé pour notifier que Three.js est chargé
    const event = new CustomEvent('threeJsLoaded');
    document.dispatchEvent(event);
    console.log('Three.js bundle chargé avec succès');
}

// Charger dynamiquement le contenu minifié de Three.js
(function() {
    // Fonction pour charger un script externe
    function loadScript(url, callback) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = callback;
        document.head.appendChild(script);
    }

    // Charger les scripts dans l'ordre correct
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', function() {
        loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/OBJLoader.js', function() {
            loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/MTLLoader.js', function() {
                loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js', function() {
                    loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/DRACOLoader.js', function() {
                        loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js', function() {
                            // Tous les scripts sont chargés
                            notifyThreeJsLoaded();
                        });
                    });
                });
            });
        });
    });
})();

// Exposer une fonction pour vérifier si Three.js est chargé
window.isThreeJsReady = function() {
    return window.threeJsLoaded;
};

// Exposer une fonction pour attendre que Three.js soit chargé
window.waitForThreeJs = function() {
    return new Promise((resolve) => {
        if (window.threeJsLoaded) {
            resolve();
        } else {
            document.addEventListener('threeJsLoaded', resolve);
        }
    });
};
