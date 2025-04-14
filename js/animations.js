document.addEventListener('DOMContentLoaded', function() {
    // Vérifier les préférences de réduction de mouvement
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        return; // Ne pas initialiser les animations
    }

    const observerOptions = {
        root: null, // utilise le viewport
        rootMargin: '0px', // pas de marge
        threshold: 0.15 // déclenche quand 15% de l'élément est visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Ajoute la classe seulement quand l'élément entre dans le viewport
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // Ne pas désinscrire l'observer pour permettre les animations répétées
            } else {
                // Retire la classe quand l'élément sort du viewport
                entry.target.classList.remove('in-view');
            }
        });
    }, observerOptions);

    // Observer tous les éléments avec la classe 'animate'
    document.querySelectorAll('.animate').forEach(element => {
        observer.observe(element);
    });
});