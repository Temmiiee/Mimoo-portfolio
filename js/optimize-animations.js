/**
 * Optimisation des animations pour Mimoo Portfolio
 * Version simplifiée qui se concentre sur les animations CSS essentielles
 */

(function() {
    // Attendre que le DOM soit chargé
    document.addEventListener('DOMContentLoaded', function() {
        // Détecter si l'utilisateur préfère réduire les animations
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Si l'utilisateur préfère réduire les animations, ne pas optimiser
        if (prefersReducedMotion) {
            document.documentElement.classList.add('reduced-motion');
            return;
        }

        // Optimiser les animations CSS essentielles
        function optimizeCSSAnimations() {
            // Sélectionner les éléments interactifs qui bénéficient le plus de l'optimisation
            const animatedElements = document.querySelectorAll('.gallery-item, .social-links a, .cta-button');

            // Utiliser IntersectionObserver pour optimiser uniquement les éléments visibles
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.willChange = 'transform';
                    } else {
                        entry.target.style.willChange = 'auto';
                    }
                });
            }, {
                rootMargin: '100px'
            });

            // Observer chaque élément
            animatedElements.forEach(element => {
                observer.observe(element);
            });
        }

        // Exécuter l'optimisation des animations CSS
        optimizeCSSAnimations();

        // Optimiser les animations AOS si AOS est chargé
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                once: true,
                offset: 100,
                disable: window.innerWidth < 768 // Désactiver sur mobile pour de meilleures performances
            });
        }
    });
})();
