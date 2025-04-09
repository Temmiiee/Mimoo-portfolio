/**
 * Script pour optimiser le chargement des images
 */

// Fonction pour charger les images de manière différée
function lazyLoadImages() {
    // Utiliser l'Intersection Observer API pour charger les images quand elles deviennent visibles
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '200px 0px', // Précharger les images avant qu'elles n'entrent dans la vue
            threshold: 0.01 // Déclencher dès qu'une petite partie de l'image est visible
        });
        
        // Observer toutes les images avec l'attribut data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback pour les navigateurs qui ne supportent pas IntersectionObserver
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
        });
    }
}

// Fonction pour précharger les images critiques
function preloadCriticalImages() {
    const criticalImages = [
        document.querySelector('.hero img'),
        document.querySelector('.profile-img')
    ];
    
    criticalImages.forEach(img => {
        if (img && img.getAttribute('data-src')) {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
        }
    });
}

// Fonction pour optimiser les images de la galerie
function optimizeGalleryImages() {
    // Convertir les images en WebP si le navigateur le supporte
    const supportsWebP = localStorage.getItem('supportsWebP');
    
    if (supportsWebP === null) {
        // Tester le support de WebP
        const webPTest = new Image();
        webPTest.onload = function() {
            localStorage.setItem('supportsWebP', 'true');
            replaceImagesWithWebP();
        };
        webPTest.onerror = function() {
            localStorage.setItem('supportsWebP', 'false');
        };
        webPTest.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
    } else if (supportsWebP === 'true') {
        replaceImagesWithWebP();
    }
    
    function replaceImagesWithWebP() {
        document.querySelectorAll('.gallery-item img[src$=".jpg"], .gallery-item img[src$=".png"]').forEach(img => {
            const src = img.getAttribute('src');
            const webPSrc = src.replace(/\.(jpg|png)$/, '.webp');
            img.setAttribute('data-src', webPSrc);
        });
    }
}

// Initialiser l'optimisation des images au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    preloadCriticalImages();
    optimizeGalleryImages();
    lazyLoadImages();
    
    // Réoptimiser les images après le chargement complet de la page
    window.addEventListener('load', function() {
        setTimeout(lazyLoadImages, 1000);
    });
});
