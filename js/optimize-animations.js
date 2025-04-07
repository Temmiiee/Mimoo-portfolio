/**
 * Optimisation des animations pour Mimoo Portfolio
 * Ce script améliore les performances des animations en utilisant les propriétés
 * will-change et transform pour les animations composées
 */

(function() {
    // Attendre que le DOM soit chargé
    document.addEventListener('DOMContentLoaded', function() {
        // Optimiser les animations AOS
        function optimizeAOSAnimations() {
            // Si AOS n'est pas encore chargé, réessayer plus tard
            if (typeof AOS === 'undefined') {
                setTimeout(optimizeAOSAnimations, 1000);
                return;
            }
            
            // Sélectionner tous les éléments avec des animations AOS
            const animatedElements = document.querySelectorAll('[data-aos]');
            
            // Ajouter will-change aux éléments animés
            animatedElements.forEach(element => {
                // Déterminer la propriété à optimiser en fonction du type d'animation
                const animationType = element.getAttribute('data-aos');
                let propertyToChange = 'transform';
                
                if (animationType.includes('fade')) {
                    propertyToChange = 'opacity, transform';
                }
                
                // Ajouter will-change uniquement aux éléments visibles ou presque visibles
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.style.willChange = propertyToChange;
                        } else {
                            entry.target.style.willChange = 'auto';
                        }
                    });
                }, {
                    rootMargin: '100px'
                });
                
                observer.observe(element);
            });
        }
        
        // Optimiser les animations GSAP
        function optimizeGSAPAnimations() {
            // Si GSAP n'est pas encore chargé, réessayer plus tard
            if (typeof gsap === 'undefined') {
                setTimeout(optimizeGSAPAnimations, 1000);
                return;
            }
            
            // Ajouter un plugin pour optimiser automatiquement les animations GSAP
            gsap.registerPlugin({
                name: "optimizePlugin",
                init: function(target, vars) {
                    // Ajouter will-change au début de l'animation
                    const originalOnStart = vars.onStart;
                    vars.onStart = function() {
                        target.style.willChange = "transform, opacity";
                        if (originalOnStart) originalOnStart.call(this);
                    };
                    
                    // Réinitialiser will-change à la fin de l'animation
                    const originalOnComplete = vars.onComplete;
                    vars.onComplete = function() {
                        target.style.willChange = "auto";
                        if (originalOnComplete) originalOnComplete.call(this);
                    };
                }
            });
        }
        
        // Optimiser les animations CSS
        function optimizeCSSAnimations() {
            // Sélectionner tous les éléments avec des animations ou transitions CSS
            const animatedElements = document.querySelectorAll('.animated, .btn, .gallery-item, .social-links a');
            
            // Ajouter will-change aux éléments animés
            animatedElements.forEach(element => {
                // Ajouter will-change uniquement aux éléments visibles ou presque visibles
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
                
                observer.observe(element);
            });
        }
        
        // Exécuter les optimisations
        optimizeAOSAnimations();
        optimizeGSAPAnimations();
        optimizeCSSAnimations();
    });
})();
