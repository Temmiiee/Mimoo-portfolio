/**
 * Script de chargement des ressources
 * Ce script est utilisé pour charger les ressources nécessaires au fonctionnement du site
 */

// Fonction pour précharger les images importantes
function preloadImages() {
    const imagesToPreload = [
        'images/background.webp',
        'images/mimoo.webp'
    ];
    
    imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Précharger les images au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    preloadImages();
});
