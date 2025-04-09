// Définir une version pour forcer le rechargement des ressources
const SITE_VERSION = '1.0.2';

// Fonction pour forcer le rechargement des ressources CSS
function refreshCSS() {
    const links = document.getElementsByTagName('link');
    for (let i = 0; i < links.length; i++) {
        if (links[i].rel === 'stylesheet') {
            const href = links[i].href.replace(/\?.*|$/, `?v=${SITE_VERSION}`);
            links[i].href = href;
        }
    }
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

    // Initialiser les autres fonctionnalités décoratives avec un délai
    setTimeout(() => {
        initializeHoverEffects();

        // Ajouter une classe au body pour indiquer que tout est chargé
        document.body.classList.add('animations-loaded');
    }, 300);
}

// Gérer le chargement initial de la page
document.addEventListener('DOMContentLoaded', () => {
    // Forcer le rechargement des CSS pour éviter les problèmes de cache
    refreshCSS();

    // Initialiser le site
    initializeSite();

    // Stocker la version actuelle dans sessionStorage
    sessionStorage.setItem('siteVersion', SITE_VERSION);
});

// Gérer les rechargements de page (F5)
window.addEventListener('pageshow', (event) => {
    // Vérifier si la page est chargée depuis le cache
    if (event.persisted) {
        // Vérifier si la version a changé
        const cachedVersion = sessionStorage.getItem('siteVersion');
        if (cachedVersion !== SITE_VERSION) {
            // Forcer un rechargement complet si la version a changé
            window.location.reload(true);
        } else {
            // Réinitialiser l'état du site
            document.body.classList.remove('animations-loaded');
            refreshCSS();
            initializeSite();
        }
    }
});

function initializeNavigation() {
    const nav = document.querySelector('nav');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    // Sticky navigation
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll <= 0) {
            nav.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !nav.classList.contains('scroll-down')) {
            nav.classList.remove('scroll-up');
            nav.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && nav.classList.contains('scroll-down')) {
            nav.classList.remove('scroll-down');
            nav.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });
}

function initializeSnail() {
    // Vérifier si l'utilisateur préfère réduire les animations
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        return; // Ne pas initialiser l'escargot si l'utilisateur préfère réduire les animations
    }

    // Supprimer l'escargot existant s'il existe
    const existingContainer = document.querySelector('.snail-container');
    if (existingContainer) {
        existingContainer.remove();
    }

    // Créer le conteneur de l'escargot (pour l'animation de déplacement)
    const container = document.createElement('div');
    container.className = 'snail-container';

    // Créer l'escargot lui-même (pour l'animation de saut)
    const snail = document.createElement('div');
    snail.className = 'snail';
    snail.textContent = '🐌'; // Emoji escargot
    snail.setAttribute('aria-label', 'Escargot interactif');
    snail.setAttribute('role', 'button');
    snail.setAttribute('tabindex', '0');

    // Ajouter l'escargot au conteneur, puis le conteneur au body
    container.appendChild(snail);
    document.body.appendChild(container);

    // Gérer le clic sur l'escargot
    snail.addEventListener('click', () => {
        if (!snail.classList.contains('jumping')) {
            snail.classList.add('jumping');

            // Retirer la classe jumping après l'animation
            setTimeout(() => {
                snail.classList.remove('jumping');
            }, 500);
        }
    });

    // Gérer l'interaction au clavier
    snail.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            snail.click();
        }
    });

    // Fonction pour faire sauter l'escargot
    const jumpSnail = () => {
        if (!snail.classList.contains('jumping')) {
            snail.classList.add('jumping');

            // Retirer la classe jumping après l'animation
            setTimeout(() => {
                snail.classList.remove('jumping');
            }, 500);
        }
    };

    // Faire sauter l'escargot après un court délai pour attirer l'attention
    setTimeout(jumpSnail, 1500);

    // Faire sauter l'escargot périodiquement
    setInterval(jumpSnail, 8000); // Toutes les 8 secondes
}

function initializeHoverEffects() {
    // Vérifier si l'utilisateur préfère réduire les animations
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        return; // Ne pas initialiser les effets de survol si l'utilisateur préfère réduire les animations
    }

    // Utiliser des classes CSS plutôt que des styles inline pour de meilleures performances
    const style = document.createElement('style');
    style.textContent = `
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(45, 74, 45, 0.3);
        }

        .gallery-item:hover {
            transform: translateY(-5px);
        }
    `;
    document.head.appendChild(style);
}

function initializeGalleryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryRegion = document.getElementById('gallery-items');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Mettre à jour les attributs ARIA et les classes
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });

            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');

            const filter = btn.getAttribute('data-filter');
            const filterName = btn.textContent.trim();

            // Annoncer le changement de filtre pour les lecteurs d'écran
            galleryRegion.setAttribute('aria-label', `Galerie filtrée par ${filterName}`);

            // Compter les éléments visibles pour l'accessibilité
            let visibleCount = 0;

            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.style.display = '';
                    item.setAttribute('aria-hidden', 'false');
                    item.setAttribute('tabindex', '0');
                    visibleCount++;

                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    item.setAttribute('aria-hidden', 'true');
                    item.setAttribute('tabindex', '-1');

                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });

            // Mettre à jour le message d'accessibilité
            const statusMessage = `${visibleCount} éléments affichés dans la galerie`;

            // Créer ou mettre à jour un élément pour les lecteurs d'écran
            let statusElement = document.getElementById('gallery-status');
            if (!statusElement) {
                statusElement = document.createElement('div');
                statusElement.id = 'gallery-status';
                statusElement.className = 'sr-only';
                statusElement.setAttribute('aria-live', 'polite');
                galleryRegion.appendChild(statusElement);
            }
            statusElement.textContent = statusMessage;
        });

        // Ajouter la gestion du clavier pour l'accessibilité
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    });
}

function initializeLightbox() {
    console.log('Initialisation de la lightbox...');

    // Sélectionner les éléments de la lightbox
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox img');
    const lightboxTitle = document.querySelector('.lightbox-title');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const modelContainer = document.getElementById('model-container');

    // Vérifier si les éléments existent
    if (!lightbox || !lightboxImg || !lightboxTitle || !lightboxClose || !lightboxPrev || !lightboxNext || !modelContainer) {
        console.error('Erreur: Éléments de la lightbox manquants');
        return;
    }

    // Sélectionner tous les éléments de la galerie
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    if (galleryItems.length === 0) {
        console.warn('Aucun élément de galerie trouvé');
    } else {
        console.log(`${galleryItems.length} éléments de galerie trouvés`);
    }

    let currentIndex = 0;
    let modelViewer = null;

    function showLightbox(index) {
        currentIndex = index;
        const item = galleryItems[index];
        const img = item.querySelector('img');
        const overlay = item.querySelector('.overlay');
        const title = overlay.querySelector('h3').textContent;
        const is3DModel = item.getAttribute('data-type') === '3d';
        // Vérifier si le modèle est spécifié par un chemin local ou une URL externe
        const modelPath = item.getAttribute('data-model-url') || item.getAttribute('data-model-path');

        // Gestion de l'affichage de l'image ou du modèle 3D
        if (is3DModel && modelPath) {
            // Afficher un indicateur de chargement
            lightboxImg.style.display = 'none';
            modelContainer.classList.add('active');
            document.querySelector('.lightbox-content').classList.add('model-view');

            // Afficher un message de chargement
            const loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'loading-model';
            loadingIndicator.innerHTML = '<div class="spinner"></div><span>Chargement des scripts 3D...</span>';
            modelContainer.appendChild(loadingIndicator);

            // Charger les scripts 3D à la demande
            if (typeof load3DScripts === 'function') {
                load3DScripts();
            }

            // Vérifier périodiquement si Three.js et le visualisateur sont chargés
            const checkInterval = setInterval(() => {
                if (typeof THREE !== 'undefined' && typeof THREE.OBJLoader !== 'undefined' && typeof EnhancedModelViewer !== 'undefined') {
                    clearInterval(checkInterval);

                    // Supprimer l'indicateur de chargement initial
                    if (modelContainer.contains(loadingIndicator)) {
                        modelContainer.removeChild(loadingIndicator);
                    }

                    // Initialiser le visualisateur 3D
                    if (!modelViewer) {
                        modelViewer = new EnhancedModelViewer(modelContainer);
                    }

                    // Initialiser la scène et charger le modèle
                    setTimeout(() => {
                        modelViewer.init();
                        modelViewer.loadModel(modelPath);

                        // Forcer un redimensionnement après l'initialisation
                        setTimeout(() => {
                            if (modelViewer) modelViewer.onWindowResize();
                        }, 100);
                    }, 50);
                }
            }, 200);

            // Arrêter la vérification après 10 secondes pour éviter une boucle infinie
            setTimeout(() => {
                clearInterval(checkInterval);
                if (!(typeof THREE !== 'undefined' && typeof EnhancedModelViewer !== 'undefined')) {
                    loadingIndicator.innerHTML = '<span class="error">Erreur lors du chargement des scripts 3D</span>';
                }
            }, 10000);
        } else {
            // Afficher l'image normale
            lightboxImg.style.display = 'block';
            modelContainer.classList.remove('active');
            document.querySelector('.lightbox-content').classList.remove('model-view');

            // Nettoyer le visualisateur 3D s'il existe
            if (modelViewer) {
                modelViewer.dispose();
            }

            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
        }

        lightboxTitle.textContent = title;
        lightbox.classList.add('active');
        document.body.classList.add('lightbox-active');

        // Gestion de la visibilité des boutons de navigation
        lightboxPrev.style.visibility = index === 0 ? 'hidden' : 'visible';
        lightboxNext.style.visibility = index === galleryItems.length - 1 ? 'hidden' : 'visible';
    }

    // Ouvrir la lightbox au clic sur une image
    galleryItems.forEach((item, index) => {
        // Vérifier si l'écouteur d'événement existe déjà
        const existingListener = item._lightboxClickListener;
        if (existingListener) {
            item.removeEventListener('click', existingListener);
        }

        // Ajouter un nouvel écouteur d'événement
        const clickListener = (e) => {
            console.log(`Clic sur l'image ${index}`);
            e.preventDefault();
            showLightbox(index);
        };

        // Stocker l'écouteur d'événement pour pouvoir le supprimer plus tard si nécessaire
        item._lightboxClickListener = clickListener;

        // Ajouter l'écouteur d'événement
        item.addEventListener('click', clickListener);

        // Ajouter un style de curseur pour indiquer que l'image est cliquable
        item.style.cursor = 'pointer';
    });

    // Fermer la lightbox
    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.classList.remove('lightbox-active');

        // Nettoyer le visualisateur 3D si nécessaire
        if (modelViewer) {
            modelViewer.dispose();
            modelViewer = null;
        }

        // Réinitialiser l'affichage
        modelContainer.classList.remove('active');
        document.querySelector('.lightbox-content').classList.remove('model-view');
    });

    // Navigation précédent/suivant
    lightboxPrev.addEventListener('click', () => {
        if (currentIndex > 0) showLightbox(currentIndex - 1);
    });

    lightboxNext.addEventListener('click', () => {
        if (currentIndex < galleryItems.length - 1) showLightbox(currentIndex + 1);
    });

    // Ajouter la gestion des événements clavier pour la lightbox
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                lightboxClose.click();
                break;
            case 'ArrowLeft':
                if (currentIndex > 0) {
                    showLightbox(currentIndex - 1);
                }
                break;
            case 'ArrowRight':
                if (currentIndex < galleryItems.length - 1) {
                    showLightbox(currentIndex + 1);
                }
                break;
        }
    });

    // Fermer la lightbox en cliquant en dehors du contenu
    lightbox.addEventListener('click', (e) => {
        // Vérifier si le clic est sur la lightbox elle-même et non sur son contenu
        if (e.target === lightbox) {
            lightboxClose.click();
        }
    });


}

function initializeAOS() {
    // Utiliser la fonction globale d'initialisation d'AOS
    if (window.initAOS) {
        window.initAOS();
    } else {
        // AOS n'est pas encore chargé, on va le charger maintenant
        if (typeof loadAOS === 'function') {
            loadAOS();
        }
    }
}

function createFloatingCreatures() {
    // Vérifier si l'utilisateur préfère réduire les animations
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        return; // Ne pas créer de créatures si l'utilisateur préfère réduire les animations
    }

    // Vérifier si l'appareil est mobile ou à faible puissance
    if (window.innerWidth < 768 || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)) {
        return; // Ne pas créer de créatures sur les appareils mobiles ou à faible puissance
    }

    // Version améliorée avec plus de créatures et de meilleures animations
    const creatures = ['🦋', '🍃', '🌸', '🌿', '🍀', '🍁', '🌺', '🌻', '🌼', '🌷'];

    // Supprimer le conteneur existant s'il existe déjà
    const existingContainer = document.querySelector('.floating-creatures-container');
    if (existingContainer) {
        existingContainer.remove();
    }

    const container = document.createElement('div');
    container.className = 'floating-creatures-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9500';
    container.style.overflow = 'hidden';
    document.body.appendChild(container);

    // Créer des créatures qui traversent l'écran de gauche à droite
    const createCreature = (isInitial = false) => {
        const creature = document.createElement('div');
        creature.className = 'floating-creature';
        creature.textContent = creatures[Math.floor(Math.random() * creatures.length)];

        // Appliquer des styles CSS pour l'animation
        creature.style.position = 'absolute';
        creature.style.fontSize = `${Math.floor(Math.random() * 10) + 25}px`; // Taille variable entre 25px et 35px
        creature.style.opacity = '0'; // Commencer invisible

        // Position verticale aléatoire
        const topPosition = Math.random() * 80 + 10; // 10-90% verticalement
        creature.style.top = `${topPosition}%`;

        // Position horizontale initiale (hors écran à gauche)
        creature.style.left = '-50px';

        // Choisir une animation aléatoire
        const animationType = Math.random() > 0.5 ? 'float-left-to-right' : 'float-with-sway';

        // Durée et délai aléatoires
        const duration = Math.random() * 10 + 20; // 20-30s
        const delay = isInitial ? Math.random() * 15 : 0; // Délai initial pour les premières créatures

        // Appliquer l'animation
        creature.style.animation = `${animationType} ${duration}s ease-in-out ${delay}s forwards`;

        // Ajouter des effets visuels
        creature.style.filter = 'drop-shadow(0 2px 5px rgba(0, 0, 0, 0.2))';
        creature.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';

        // Ajouter au conteneur
        container.appendChild(creature);

        // Supprimer la créature après la fin de l'animation
        setTimeout(() => {
            if (container.contains(creature)) {
                container.removeChild(creature);
            }
        }, (duration + delay) * 1000);
    };

    // Créer les créatures initiales
    for (let i = 0; i < 8; i++) {
        createCreature(true);
    }

    // Ajouter une règle CSS pour l'animation
    if (!document.getElementById('floating-creatures-style')) {
        const style = document.createElement('style');
        style.id = 'floating-creatures-style';
        style.textContent = `
            @keyframes float {
                0% { transform: translate(0, 0) rotate(0deg); }
                25% { transform: translate(10px, 10px) rotate(5deg); }
                50% { transform: translate(0, 20px) rotate(0deg); }
                75% { transform: translate(-10px, 10px) rotate(-5deg); }
                100% { transform: translate(0, 0) rotate(0deg); }
            }

            .floating-creature {
                opacity: 0;
                transition: opacity 1s ease;
            }
        `;
        document.head.appendChild(style);
    }

    // Créer de nouvelles créatures périodiquement
    setInterval(() => {
        // Limiter le nombre de créatures simultanées pour éviter les problèmes de performance
        if (container.children.length < 12) { // Augmenter la limite pour plus d'animation
            createCreature(false);
        }
    }, 3000); // Créer une nouvelle créature toutes les 3 secondes
}

