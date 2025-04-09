// Version du site (sans paramètre de version pour éviter les erreurs)
const SITE_VERSION = '';

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

    // Initialiser les autres fonctionnalités décoratives avec un délai
    setTimeout(() => {
        initializeHoverEffects();

        // Ajouter une classe au body pour indiquer que tout est chargé
        document.body.classList.add('animations-loaded');
    }, 300);
}

// Gérer le chargement initial de la page
document.addEventListener('DOMContentLoaded', () => {
    // Forcer le rechargement de toutes les ressources pour éviter les problèmes de cache
    refreshResources();

    // Initialiser le site
    initializeSite();

    // Stocker la version actuelle dans sessionStorage
    sessionStorage.setItem('siteVersion', SITE_VERSION);

    // Ajouter un attribut de version au body pour faciliter le débogage
    document.body.setAttribute('data-version', SITE_VERSION);
});

// Gérer les rechargements de page (F5) et les retours en arrière
window.addEventListener('pageshow', (event) => {
    // Vérifier si la page est chargée depuis le cache
    if (event.persisted) {
        console.log('Page chargée depuis le cache');
        // Vérifier si la version a changé
        const cachedVersion = sessionStorage.getItem('siteVersion');
        if (cachedVersion !== SITE_VERSION) {
            console.log(`Version différente: cache=${cachedVersion}, actuelle=${SITE_VERSION}`);
            // Forcer un rechargement complet si la version a changé
            window.location.reload(true);
        } else {
            console.log('Même version, réinitialisation du site');
            // Réinitialiser l'état du site
            document.body.classList.remove('animations-loaded');
            refreshResources();
            initializeSite();
        }
    } else {
        // Même pour les chargements normaux, vérifier si l'image de fond est bien chargée
        const heroSection = document.getElementById('accueil');
        if (heroSection && heroSection.style.backgroundImage) {
            // Forcer le rechargement de l'image de fond
            const bgImage = heroSection.style.backgroundImage;
            if (bgImage.indexOf('background.webp') > -1 && bgImage.indexOf('?v=') === -1) {
                heroSection.style.backgroundImage = bgImage.replace(/url\(['"](.*?)['"]\)/g,
                    (_, url) => `url('${url.replace(/\?.*|$/, `?v=${SITE_VERSION}`)}')`);
            }
        }
    }
});

function initializeNavigation() {
    const nav = document.querySelector('nav');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navOverlay = document.querySelector('.nav-overlay');
    const navItems = document.querySelectorAll('.nav-links li a');

    // Fonction pour ouvrir le menu mobile
    const openMobileMenu = () => {
        navLinks.classList.add('active');
        hamburger.classList.add('active');
        navOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Empêcher le défilement du body

        // Mettre à jour les attributs ARIA
        hamburger.setAttribute('aria-expanded', 'true');
    };

    // Fonction pour fermer le menu mobile
    const closeMobileMenu = () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Rétablir le défilement du body

        // Mettre à jour les attributs ARIA
        hamburger.setAttribute('aria-expanded', 'false');
    };

    // Gestionnaire d'événement pour le bouton hamburger
    hamburger?.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Gestionnaire d'événement pour l'overlay
    navOverlay?.addEventListener('click', closeMobileMenu);

    // Gestionnaire d'événement pour les liens de navigation
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });

    // Fermer le menu avec la touche Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
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
            }
        });
    });

    // Ajuster la navigation lors du redimensionnement de la fenêtre
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
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

    // Supprimer tous les escargots existants s'ils existent
    const existingSnails = document.querySelectorAll('.snail, .snail-container, .snail-static, .snail-jumping');
    existingSnails.forEach(snail => snail.remove());

    // Créer un conteneur pour l'escargot
    const snailContainer = document.createElement('div');
    snailContainer.className = 'snail-container';
    snailContainer.style.position = 'fixed';
    // Ajuster la position verticale de l'escargot en fonction de la taille de l'écran
    const setSnailPosition = () => {
        const windowWidth = window.innerWidth;
        if (windowWidth > 1600) {
            snailContainer.style.top = '71px';
            snailContainer.style.fontSize = '24px';
        } else if (windowWidth > 1200) {
            snailContainer.style.top = '64px';
            snailContainer.style.fontSize = '23px';
        } else if (windowWidth > 768) {
            snailContainer.style.top = '52px';
            snailContainer.style.fontSize = '22px';
        } else if (windowWidth > 480) {
            snailContainer.style.top = '46px';
            snailContainer.style.fontSize = '20px';
        } else if (windowWidth > 360) {
            snailContainer.style.top = '42px';
            snailContainer.style.fontSize = '18px';
        } else {
            snailContainer.style.top = '38px';
            snailContainer.style.fontSize = '16px';
        }
    };

    // Positionner l'escargot initialement
    setSnailPosition();

    // Ajuster la position lors du redimensionnement de la fenêtre
    window.addEventListener('resize', setSnailPosition);
    snailContainer.style.left = '20px';
    snailContainer.style.zIndex = '9999';
    snailContainer.style.cursor = 'pointer';
    snailContainer.style.userSelect = 'none';
    snailContainer.style.pointerEvents = 'auto';
    snailContainer.style.outline = 'none';
    snailContainer.style.border = 'none';
    snailContainer.style.boxShadow = 'none';
    snailContainer.style.webkitTapHighlightColor = 'transparent';
    snailContainer.style.animation = 'crawlRight 90s linear infinite';

    // Créer l'escargot lui-même
    const snail = document.createElement('div');
    snail.className = 'snail';
    snail.textContent = '🐌'; // Emoji escargot
    snail.style.display = 'block';
    snail.style.outline = 'none';
    snail.style.border = 'none';
    snail.style.boxShadow = 'none';

    // Ajouter l'escargot au conteneur
    snailContainer.appendChild(snail);

    // Ajouter le conteneur au body
    document.body.appendChild(snailContainer);

    // Ajouter les attributs d'accessibilité
    snailContainer.setAttribute('aria-label', 'Escargot interactif');
    snailContainer.setAttribute('role', 'button');
    snailContainer.setAttribute('tabindex', '0');

    // Variable pour suivre si l'escargot est en train de sauter
    let isJumping = false;

    // Fonction pour faire sauter l'escargot
    const jumpSnail = () => {
        if (!isJumping) {
            isJumping = true;

            // Appliquer l'animation de saut à l'escargot lui-même
            snail.style.animation = 'jumpUp 0.5s ease-out';

            // Réinitialiser après l'animation
            setTimeout(() => {
                snail.style.animation = '';
                isJumping = false;
            }, 500);
        }
    };

    // Gérer le clic sur l'escargot et son conteneur
    snail.addEventListener('click', jumpSnail);
    snailContainer.addEventListener('click', jumpSnail);

    // Gérer l'interaction au clavier
    snailContainer.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            jumpSnail();
        }
    });

    // Faire sauter l'escargot après un court délai pour attirer l'attention
    setTimeout(jumpSnail, 1500);

    // Faire sauter l'escargot périodiquement
    setInterval(jumpSnail, 8000); // Toutes les 8 secondes

    // Ajouter les styles d'animation
    if (!document.getElementById('snail-animation-style')) {
        const style = document.createElement('style');
        style.id = 'snail-animation-style';
        style.textContent = `
            @keyframes jumpUp {
                0% { transform: translateY(0); }
                50% { transform: translateY(-20px); }
                100% { transform: translateY(0); }
            }

            @keyframes crawlRight {
                0% { transform: translateX(0); }
                100% { transform: translateX(calc(100vw - 50px)); }
            }

            .snail-container:focus, .snail-container:active, .snail-container:focus-visible,
            .snail:focus, .snail:active, .snail:focus-visible {
                outline: none !important;
                border: none !important;
                box-shadow: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Ajouter un écouteur d'événement pour réinitialiser l'animation lorsque l'escargot atteint le bord
    const checkSnailPosition = () => {
        if (!snailContainer) return;
        const rect = snailContainer.getBoundingClientRect();
        const viewportWidth = window.innerWidth;

        // Si l'escargot est presque au bord droit de l'écran
        if (rect.right >= viewportWidth - 10) {
            // Réinitialiser la position à gauche
            snailContainer.style.animation = 'none';
            snailContainer.style.left = '20px';
            snailContainer.offsetHeight; // Forcer un reflow
            snailContainer.style.animation = 'crawlRight 90s linear infinite';
        }
    };

    // Vérifier la position toutes les secondes
    setInterval(checkSnailPosition, 1000);
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
    // Sélectionner les éléments nécessaires
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryRegion = document.getElementById('gallery-grid');

    // Si la galerie n'existe pas, sortir de la fonction
    if (!galleryRegion || filterBtns.length === 0 || galleryItems.length === 0) {
        console.warn('Gallery elements not found');
        return;
    }

    // Initialiser tous les éléments de la galerie pour qu'ils soient visibles au début
    galleryItems.forEach(item => {
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
        item.style.display = '';
        item.setAttribute('aria-hidden', 'false');
        item.setAttribute('tabindex', '0');
    });

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

    // Activer le filtre "Tout" par défaut
    const defaultFilter = document.querySelector('.filter-btn[data-filter="all"]');
    if (defaultFilter) {
        defaultFilter.click();
    }

    // Ajouter un gestionnaire d'événements pour réinitialiser les filtres lors du redimensionnement
    window.addEventListener('resize', () => {
        // Réinitialiser les filtres si la fenêtre est redimensionnée
        if (window.innerWidth !== window.lastWidth) {
            window.lastWidth = window.innerWidth;
            // Attendre un peu pour éviter les déclenchements multiples
            clearTimeout(window.resizeTimer);
            window.resizeTimer = setTimeout(() => {
                defaultFilter.click();
            }, 250);
        }
    });
}

function initializeLightbox() {
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
        return;
    }

    // Sélectionner tous les éléments de la galerie
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));

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

    // Émojis de fleurs, feuilles et papillons pour une animation aérienne
    const creatures = [
        '🦋', // Papillon
        '🦋', // Papillon (doublé pour augmenter sa fréquence)
        '🦋', // Papillon (triplé pour augmenter sa fréquence)
        '🌸', // Fleur de cerisier
        '🌸', // Fleur de cerisier (doublée)
        '🌺', // Hibiscus
        '🌼', // Fleur éclose
        '🌷', // Tulipe
        '🌻', // Tournesol
        '🌹', // Rose
        '🍃', // Feuille au vent
        '🍃', // Feuille au vent (doublée)
        '🍁', // Feuille d'érable
        '🍂', // Feuille tombée
        '🍂', // Feuille tombée (doublée)
        '🍀'  // Trèfle
    ];

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

        // Taille variable plus petite pour les émojis
        creature.style.fontSize = `${Math.floor(Math.random() * 8) + 16}px`; // 16-24px
        creature.style.opacity = '0.01'; // Commencer presque invisible

        // Position verticale aléatoire avec plus de variation
        const topPosition = Math.random() * 90 + 5; // 5-95% verticalement
        creature.style.top = `${topPosition}%`;

        // Position horizontale initiale (hors écran à gauche)
        creature.style.left = '-50px';

        // Vitesse variable pour un effet plus doux - plus lente pour des mouvements subtils
        const speed = Math.random() * 0.5 + 0.8; // Facteur de vitesse entre 0.8 et 1.3 (plus lent)

        // Durée et délai aléatoires - durée plus longue pour des mouvements plus lents
        const duration = (Math.random() * 15 + 25) / speed; // 25-40s, ajusté par la vitesse (beaucoup plus lent)
        const delay = isInitial ? Math.random() * 8 : Math.random() * 3; // Délai initial ou entre les créatures

        // Choisir une animation avec rotation
        const animationType = Math.random() > 0.4 ? 'flying-float' : 'flying-spin';

        // Appliquer l'animation avec une fonction d'accélération douce pour un mouvement naturel
        creature.style.animation = `${animationType} ${duration}s ease-in-out ${delay}s forwards`;

        // Ajouter des effets visuels très légers et aériens
        creature.style.filter = 'drop-shadow(0 1px 2px rgba(255, 255, 255, 0.2)) blur(0.3px)';
        creature.style.textShadow = '0 1px 2px rgba(255, 255, 255, 0.2)';

        // Ajouter une rotation aléatoire initiale plus douce
        const initialRotation = Math.random() * 180 - 90; // Entre -90 et 90 degrés
        creature.style.transform = `rotate(${initialRotation}deg)`;

        // Ajouter une légère transparence initiale
        creature.style.opacity = '0.01'; // Presque invisible au début

        // Ajouter au conteneur
        container.appendChild(creature);

        // Supprimer la créature après la fin de l'animation
        setTimeout(() => {
            if (container.contains(creature)) {
                container.removeChild(creature);
            }
        }, (duration + delay) * 1000);
    };

    // Créer les créatures initiales (nombre modéré pour un effet équilibré)
    for (let i = 0; i < 4; i++) {
        createCreature(true);
    }

    // Ajouter une règle CSS pour les animations
    if (!document.getElementById('floating-creatures-style')) {
        const style = document.createElement('style');
        style.id = 'floating-creatures-style';
        style.textContent = `
            /* Animation douce avec mouvements légers et variations d'opacité */
            @keyframes flying-float {
                0% { transform: translateX(-50px) translateY(0) rotate(0deg); opacity: 0; }
                10% { transform: translateX(10vw) translateY(-10px) rotate(20deg); opacity: 0.2; }
                20% { transform: translateX(20vw) translateY(8px) rotate(40deg); opacity: 0.4; }
                30% { transform: translateX(30vw) translateY(-12px) rotate(60deg); opacity: 0.3; }
                40% { transform: translateX(40vw) translateY(6px) rotate(80deg); opacity: 0.5; }
                50% { transform: translateX(50vw) translateY(-8px) rotate(100deg); opacity: 0.2; }
                60% { transform: translateX(60vw) translateY(10px) rotate(120deg); opacity: 0.4; }
                70% { transform: translateX(70vw) translateY(-6px) rotate(140deg); opacity: 0.3; }
                80% { transform: translateX(80vw) translateY(4px) rotate(160deg); opacity: 0.5; }
                90% { transform: translateX(90vw) translateY(-2px) rotate(180deg); opacity: 0.2; }
                100% { transform: translateX(calc(100vw + 50px)) translateY(0) rotate(200deg); opacity: 0; }
            }

            /* Animation avec légères rotations et variations d'opacité */
            @keyframes flying-spin {
                0% { transform: translateX(-50px) translateY(0) rotate(0deg); opacity: 0; }
                10% { transform: translateX(10vw) translateY(-15px) rotate(30deg); opacity: 0.3; }
                20% { transform: translateX(20vw) translateY(12px) rotate(60deg); opacity: 0.2; }
                30% { transform: translateX(30vw) translateY(-10px) rotate(90deg); opacity: 0.4; }
                40% { transform: translateX(40vw) translateY(8px) rotate(120deg); opacity: 0.3; }
                50% { transform: translateX(50vw) translateY(-12px) rotate(150deg); opacity: 0.5; }
                60% { transform: translateX(60vw) translateY(10px) rotate(180deg); opacity: 0.2; }
                70% { transform: translateX(70vw) translateY(-8px) rotate(210deg); opacity: 0.4; }
                80% { transform: translateX(80vw) translateY(6px) rotate(240deg); opacity: 0.3; }
                90% { transform: translateX(90vw) translateY(-4px) rotate(270deg); opacity: 0.5; }
                100% { transform: translateX(calc(100vw + 50px)) translateY(0) rotate(300deg); opacity: 0; }
            }

            /* Style de base pour les créatures flottantes avec transitions douces */
            .floating-creature {
                opacity: 0;
                transition: opacity 1.5s ease-in-out;
                will-change: transform, opacity;
                backface-visibility: hidden;
                transform-origin: center center;
                filter: blur(0.4px);
                animation-timing-function: ease-in-out !important;
            }

            /* Masquer les créatures quand la lightbox est active */
            body.lightbox-active .floating-creature {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Créer de nouvelles créatures périodiquement avec un intervalle plus long
    setInterval(() => {
        // Limiter le nombre de créatures simultanées
        if (container.children.length < 6) { // Limite plus basse pour un effet plus subtil
            createCreature(false);
        }
    }, 4000); // Créer une nouvelle créature toutes les 4 secondes
}

