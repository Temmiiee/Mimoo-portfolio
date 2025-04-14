(function() {
    if (window.SITE_VERSION) return; // Éviter la redéclaration

    window.SITE_VERSION = '1.0.0';
})();

// Fonction simplifiée pour le chargement des ressources
function refreshResources() {
    // Cette fonction a été simplifiée pour éviter les problèmes de cache
    // Les ressources sont maintenant chargées directement sans paramètres de version
    return; // Ne rien faire
}

// Fonction pour initialiser toutes les fonctionnalités du site
function initializeSite() {
    // Initialiser les fonctionnalités essentielles immédiatement
    initializeNavigation();
    initializeGalleryFilters();
    initializeLightbox();

    // Initialiser l'escargot et les créatures flottantes immédiatement
    initializeSnail();
    createFloatingCreatures();

    // Fixer la hauteur du hero-content-wrapper
    const heroWrapper = document.querySelector('.hero-content-wrapper');
    if (heroWrapper) {
        // Définir une hauteur minimale fixe
        heroWrapper.style.minHeight = '300px';
        // Empêcher les changements de taille brusques
        heroWrapper.style.transition = 'height 0.3s ease-in-out';
    }

    // Observer les changements de contenu dans hero-content-wrapper
    const observer = new ResizeObserver(entries => {
        for (let entry of entries) {
            const height = entry.contentRect.height;
            // Si la hauteur est inférieure à 300px, la forcer à 300px
            if (height < 300) {
                entry.target.style.height = '300px';
            }
        }
    });

    if (heroWrapper) {
        observer.observe(heroWrapper);
    }

    // Initialiser les autres fonctionnalités décoratives avec un délai
    setTimeout(() => {
        initializeHoverEffects();

        // Ajouter une classe au body pour indiquer que tout est chargé
        document.body.classList.add('animations-loaded');
    }, 300);
}

// Fonction pour initialiser la navigation
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Vérifier si les éléments existent
    if (!hamburger || !navLinks) {
        console.error('Elements de navigation manquants');
        return;
    }

    // Fonction simple pour ouvrir/fermer le menu mobile
    function toggleMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');

        // Mettre à jour l'état ARIA
        const isExpanded = hamburger.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isExpanded);
    }

    // Gestionnaire d'événements pour le bouton hamburger
    hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        toggleMenu();
    });

    // Fermer le menu quand on clique sur un lien
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Fermer le menu avec la touche Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && hamburger.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Ajouter des attributs ARIA pour l'accessibilité
    hamburger.setAttribute('aria-label', 'Menu principal');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-controls', 'nav-links');
    navLinks.id = 'nav-links';
}

// Fonction pour initialiser les filtres de la galerie
function initializeGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Retirer la classe active de tous les boutons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Ajouter la classe active au bouton cliqué
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Activer le filtre "all" par défaut
    const defaultFilter = document.querySelector('.filter-btn[data-filter="all"]');
    if (defaultFilter) {
        defaultFilter.click();
    }
}

// Fonction pour initialiser la lightbox
function initializeLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxTitle = document.querySelector('.lightbox-title');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    let currentIndex = 0;

    function showImage(index) {
        const item = galleryItems[index];
        const img = item.querySelector('img');
        const title = item.querySelector('.overlay h3').textContent;
        
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxTitle.textContent = title;
        currentIndex = index;
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            showImage(index);
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    });

    lightboxPrev.addEventListener('click', () => {
        if (currentIndex > 0) {
            showImage(currentIndex - 1);
        }
    });

    lightboxNext.addEventListener('click', () => {
        if (currentIndex < galleryItems.length - 1) {
            showImage(currentIndex + 1);
        }
    });

    // Fermer avec la touche Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Fermer en cliquant en dehors de l'image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Fonction pour initialiser les effets de survol
function initializeHoverEffects() {
    // Ajouter des effets de survol pour les éléments de la galerie
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        const overlay = item.querySelector('.overlay');

        if (!overlay) return;

        item.addEventListener('mouseenter', () => {
            overlay.style.opacity = '1';
        });

        item.addEventListener('mouseleave', () => {
            overlay.style.opacity = '0';
        });
    });

    // Ajouter des effets de survol pour les liens sociaux
    const socialLinks = document.querySelectorAll('.social-link');

    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-3px)';
        });

        link.addEventListener('mouseleave', () => {
            link.style.transform = '';
        });
    });
}

// Fonction pour initialiser l'escargot
function initializeSnail() {
    const snailContainer = document.querySelector('.snail-container');
    const snail = document.querySelector('.snail');
    if (!snail || !snailContainer) return;

    // Adapter la vitesse de l'escargot en fonction de la taille de l'écran
    function updateSnailSpeed() {
        const windowWidth = window.innerWidth;
        let duration;

        // Définir la durée de l'animation en fonction de la largeur de l'écran
        if (windowWidth < 768) {
            duration = '30s'; // Plus rapide sur petit écran
        } else if (windowWidth > 1600) {
            duration = '50s'; // Plus lent sur grand écran
        } else {
            // Interpolation linéaire entre 30s et 50s
            const factor = (windowWidth - 768) / (1600 - 768);
            const seconds = Math.round(30 + factor * 20);
            duration = `${seconds}s`;
        }

        // Appliquer la durée à l'animation
        snail.style.animationDuration = duration;
    }

    // Mettre à jour la vitesse initiale
    updateSnailSpeed();

    // Mettre à jour la vitesse lors du redimensionnement
    window.addEventListener('resize', updateSnailSpeed);

    // Variable pour suivre si l'escargot est en train de sauter
    let isJumping = false;

    // Fonction pour faire sauter l'escargot
    function jump() {
        if (isJumping) return; // Éviter les sauts multiples
        isJumping = true;

        // Créer un élément de style temporaire pour l'animation de saut
        const style = document.createElement('style');
        const jumpId = `jump-${Date.now()}`; // ID unique pour l'animation

        style.textContent = `
            @keyframes ${jumpId} {
                0% { transform: translateY(0) translateZ(0); }
                50% { transform: translateY(-15px) translateZ(0); }
                100% { transform: translateY(0) translateZ(0); }
            }
        `;
        document.head.appendChild(style);

        // Sauvegarder l'animation originale
        const originalAnimation = snail.style.animation;

        // Appliquer l'animation de saut tout en préservant l'animation horizontale
        snail.style.animation = `${originalAnimation}, ${jumpId} 0.5s ease-in-out`;

        // Nettoyer après l'animation
        setTimeout(() => {
            // Restaurer l'animation originale
            snail.style.animation = originalAnimation;
            // Supprimer le style temporaire
            document.head.removeChild(style);
            // Réinitialiser l'état
            isJumping = false;
        }, 500);
    }

    // Faire sauter l'escargot au clic
    snail.addEventListener('click', () => {
        jump();
    });

    // Faire sauter l'escargot aléatoirement (moins fréquemment)
    setInterval(() => {
        if (Math.random() < 0.05 && !isJumping) { // 5% de chance toutes les 5 secondes
            jump();
        }
    }, 5000);

    // Permettre l'activation au clavier
    snail.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !isJumping) {
            e.preventDefault();
            jump();
        }
    });
}

// Fonction pour créer des créatures flottantes
function createFloatingCreatures() {
    const container = document.querySelector('.hero');
    if (!container) return;

    const creatures = ['🦋', '🌸', '🍃', '🌿', '🍂'];
    let activeCreatures = 0;
    const maxCreatures = 8;

    function createCreature() {
        if (activeCreatures >= maxCreatures) return;

        const creature = document.createElement('div');
        creature.className = 'floating-creature';
        
        // Choisir un emoji aléatoire
        const emoji = creatures[Math.floor(Math.random() * creatures.length)];
        creature.textContent = emoji;

        // Position initiale (à gauche de l'écran)
        const startY = Math.random() * (container.offsetHeight - 30);
        
        // Styles initiaux
        Object.assign(creature.style, {
            position: 'absolute',
            left: '-30px',
            top: `${startY}px`,
            opacity: '0.6',
            fontSize: `${Math.random() * 8 + 12}px`, // Taille entre 12px et 20px
            pointerEvents: 'none',
            zIndex: '1'
        });

        container.appendChild(creature);
        activeCreatures++;

        // Animation de déplacement
        const duration = Math.random() * 8000 + 12000; // Entre 12 et 20 secondes
        const startTime = performance.now();
        const endX = container.offsetWidth + 50; // Dépasse légèrement à droite

        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = elapsed / duration;

            if (progress < 1) {
                // Mouvement horizontal
                const currentX = (-30) + (endX * progress);
                
                // Mouvement vertical ondulant
                const wave = Math.sin(progress * Math.PI * 4) * 20;
                const currentY = startY + wave;

                // Rotation douce
                const rotation = Math.sin(progress * Math.PI * 2) * 10;

                creature.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotation}deg)`;
                requestAnimationFrame(animate);
            } else {
                container.removeChild(creature);
                activeCreatures--;
                // Créer une nouvelle créature
                setTimeout(createCreature, Math.random() * 1000);
            }
        }

        requestAnimationFrame(animate);
    }

    // Création initiale des créatures
    for (let i = 0; i < maxCreatures; i++) {
        setTimeout(createCreature, i * 800);
    }
}

// Fonction pour gérer les animations au scroll
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate');
    
    // Vérifier si l'utilisateur préfère réduire les animations
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Désactiver toutes les animations
        animatedElements.forEach(element => {
            element.classList.remove('animate');
            element.style.opacity = '1';
            element.style.visibility = 'visible';
        });
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // Optionnel : arrêter d'observer l'élément une fois animé
                // observer.unobserve(entry.target);
            } else {
                // Réinitialiser l'animation quand l'élément sort du viewport
                entry.target.classList.remove('in-view');
            }
        });
    }, {
        threshold: 0.15, // Déclencher quand 15% de l'élément est visible
        rootMargin: '50px' // Marge de déclenchement
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialiser les animations au chargement du DOM
document.addEventListener('DOMContentLoaded', initScrollAnimations);

// Fonction pour gérer les redirections
function handleRedirects() {
    // Obtenir le chemin actuel
    const path = window.location.pathname;
    const basePath = window.basePath || '/';

    // Si nous sommes sur une page qui n'existe pas, rediriger vers la page d'accueil
    if (path !== basePath && path !== basePath + 'index.html' && !document.querySelector('main')) {
        window.location.href = basePath;
    }
}

// Exécuter la fonction de redirection
handleRedirects();
