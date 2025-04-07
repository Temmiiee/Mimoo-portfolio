/**
 * Chargement conditionnel des ressources JavaScript
 * Ce script charge les ressources JavaScript uniquement lorsqu'elles sont nécessaires
 */

(function() {
    // Fonction pour vérifier si un élément est visible dans la fenêtre
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }

    // Fonction pour charger un script
    function loadScript(src, callback) {
        const script = document.createElement('script');
        script.src = src;
        script.onload = callback || function() {};
        document.head.appendChild(script);
    }

    // Fonction pour charger une feuille de style
    function loadStylesheet(href, callback) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = callback || function() {};
        document.head.appendChild(link);
    }

    // Charger Three.js uniquement lorsque nécessaire
    function loadThreeJsWhenNeeded() {
        // Vérifier s'il y a des modèles 3D dans la galerie
        const has3DModels = document.querySelectorAll('[data-type="3d"]').length > 0;

        if (has3DModels) {
            // Créer un observateur d'intersection pour la section galerie
            const gallerySection = document.getElementById('galerie');

            if (gallerySection) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && !window.threeJsLoaded) {
                            // Charger Three.js lorsque la section galerie devient visible
                            loadThreeJsScripts().then(() => {
                                // Three.js chargé avec succès
                            });

                            // Arrêter d'observer une fois chargé
                            observer.disconnect();
                        }
                    });
                }, {
                    rootMargin: '200px'
                });

                observer.observe(gallerySection);
            }
        }
    }

    // Charger Font Awesome uniquement lorsque nécessaire
    function loadFontAwesomeWhenNeeded() {
        // Vérifier s'il y a des icônes Font Awesome dans la page
        const hasIcons = document.querySelectorAll('.fa, .fab, .fas, .far').length > 0;

        if (hasIcons) {
            // Charger Font Awesome immédiatement car les icônes sont probablement visibles
            if (!document.querySelector('link[href*="font-awesome"]')) {
                loadStylesheet('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
            }
        }
    }

    // Charger GSAP uniquement lorsque nécessaire
    function loadGSAPWhenNeeded() {
        // Vérifier si GSAP est déjà chargé
        if (typeof gsap !== 'undefined') return;

        // Charger GSAP lorsque le document est complètement chargé
        window.addEventListener('load', function() {
            setTimeout(function() {
                loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js');
            }, 2000); // Délai de 2 secondes après le chargement de la page
        });
    }

    // Exécuter les fonctions de chargement conditionnel
    document.addEventListener('DOMContentLoaded', function() {
        loadThreeJsWhenNeeded();
        loadFontAwesomeWhenNeeded();
        loadGSAPWhenNeeded();
    });
})();
