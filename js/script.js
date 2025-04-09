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

// Fonction pour initialiser la navigation
function initializeNavigation() {
    const nav = document.querySelector('nav');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navOverlay = document.querySelector('.nav-overlay');
    const body = document.body;

    // Vérifier si les éléments existent
    if (!nav || !hamburger || !navLinks) {
        return;
    }

    // Créer un overlay pour fermer le menu en cliquant à l'extérieur
    if (!navOverlay) {
        const overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);
    }

    // Fonction pour ouvrir/fermer le menu mobile
    function toggleMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.querySelector('.nav-overlay').classList.toggle('active');
        
        // Bloquer le défilement du body quand le menu est ouvert
        if (hamburger.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }

        // Mettre à jour l'état ARIA
        const isExpanded = hamburger.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isExpanded);
        navLinks.setAttribute('aria-hidden', !isExpanded);
    }

    // Gestionnaire d'événements pour le bouton hamburger
    hamburger.addEventListener('click', toggleMenu);

    // Gestionnaire d'événements pour l'overlay
    document.querySelector('.nav-overlay').addEventListener('click', toggleMenu);

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
    navLinks.setAttribute('aria-labelledby', 'hamburger');
    navLinks.setAttribute('aria-hidden', 'true');
    navLinks.id = 'nav-links';
}

// Fonction pour initialiser les filtres de la galerie
function initializeGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryRegion = document.getElementById('gallery-grid');

    // Vérifier si les éléments existent
    if (!filterButtons.length || !galleryItems.length || !galleryRegion) {
        return;
    }

    // Ajouter des attributs ARIA pour l'accessibilité
    galleryRegion.setAttribute('aria-live', 'polite');

    // Ajouter des gestionnaires d'événements pour les boutons de filtre
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Mettre à jour les classes et attributs ARIA des boutons
            filterButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
                b.setAttribute('aria-pressed', 'false');
            });

            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
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
    });

    // Activer le filtre par défaut (Tout)
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
    // Modèle 3D temporairement désactivé
    // const modelContainer = document.getElementById('model-container');

    // Vérifier si les éléments existent
    if (!lightbox || !lightboxImg || !lightboxTitle || !lightboxClose || !lightboxPrev || !lightboxNext) {
        return;
    }

    // Sélectionner tous les éléments de la galerie
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (!galleryItems.length) {
        return;
    }

    // Variables pour suivre l'état de la lightbox
    let currentIndex = 0;
    let modelViewer = null;

    function showLightbox(index) {
        currentIndex = index;
        const item = galleryItems[index];
        const img = item.querySelector('img');
        const overlay = item.querySelector('.overlay');
        const title = overlay.querySelector('h3').textContent;
        
        // Modèle 3D temporairement désactivé
        // const is3DModel = item.getAttribute('data-type') === '3d';
        // const modelPath = item.getAttribute('data-model-url') || item.getAttribute('data-model-path');

        // Afficher l'image dans la lightbox
        lightboxImg.style.display = '';
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || title;
        lightboxTitle.textContent = title;

        // Afficher la lightbox
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Mettre à jour les boutons de navigation
        updateNavButtons();

        // Annoncer l'ouverture de la lightbox pour les lecteurs d'écran
        const statusElement = document.getElementById('lightbox-status') || document.createElement('div');
        statusElement.id = 'lightbox-status';
        statusElement.className = 'sr-only';
        statusElement.setAttribute('aria-live', 'assertive');
        statusElement.textContent = `Image ${currentIndex + 1} sur ${galleryItems.length} : ${title}`;
        if (!document.getElementById('lightbox-status')) {
            lightbox.appendChild(statusElement);
        }

        // Mettre le focus sur la lightbox pour l'accessibilité
        lightbox.focus();
    }

    function hideLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';

        // Modèle 3D temporairement désactivé
        // if (modelViewer) {
        //     modelViewer.dispose();
        //     modelViewer = null;
        // }
        // modelContainer.classList.remove('active');
        // document.querySelector('.lightbox-content').classList.remove('model-view');

        // Annoncer la fermeture de la lightbox pour les lecteurs d'écran
        const statusElement = document.getElementById('lightbox-status');
        if (statusElement) {
            statusElement.textContent = 'Lightbox fermée';
        }
    }

    function showPrevImage() {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        showLightbox(currentIndex);
    }

    function showNextImage() {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        showLightbox(currentIndex);
    }

    function updateNavButtons() {
        // Mettre à jour les attributs ARIA pour l'accessibilité
        lightboxPrev.setAttribute('aria-label', `Image précédente (${currentIndex} sur ${galleryItems.length})`);
        lightboxNext.setAttribute('aria-label', `Image suivante (${currentIndex + 2} sur ${galleryItems.length})`);
    }

    // Ajouter des gestionnaires d'événements pour les éléments de la galerie
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            showLightbox(index);
        });

        // Ajouter la navigation au clavier pour l'accessibilité
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showLightbox(index);
            }
        });
    });

    // Ajouter des gestionnaires d'événements pour les boutons de la lightbox
    lightboxClose.addEventListener('click', hideLightbox);
    lightboxPrev.addEventListener('click', showPrevImage);
    lightboxNext.addEventListener('click', showNextImage);

    // Ajouter la navigation au clavier pour la lightbox
    lightbox.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'Escape':
                hideLightbox();
                break;
            case 'ArrowLeft':
                showPrevImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    });

    // Fermer la lightbox en cliquant en dehors de l'image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            hideLightbox();
        }
    });

    // Ajouter des attributs ARIA pour l'accessibilité
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Visionneuse d\'images');
    lightbox.setAttribute('tabindex', '-1');
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
    const snail = document.querySelector('.escargot');
    if (!snail) return;

    // Position initiale
    let position = 0;
    const speed = 1;
    const container = document.querySelector('.hero');
    const containerWidth = container ? container.offsetWidth : window.innerWidth;
    
    // Définir la taille de l'escargot en fonction de la taille de l'écran
    function updateSnailSize() {
        const windowHeight = window.innerHeight;
        const snailSize = Math.max(30, Math.min(50, windowHeight * 0.05));
        snail.style.width = `${snailSize}px`;
        snail.style.height = `${snailSize}px`;
    }
    
    // Mettre à jour la taille initiale
    updateSnailSize();
    
    // Mettre à jour la taille lors du redimensionnement
    window.addEventListener('resize', updateSnailSize);

    // Animation de l'escargot
    function animateSnail() {
        position += speed;
        
        // Réinitialiser la position si l'escargot sort de l'écran
        if (position > containerWidth) {
            position = -50;
        }
        
        snail.style.left = `${position}px`;
        
        // Faire sauter l'escargot aléatoirement
        if (Math.random() < 0.005) {
            jump();
        }
        
        requestAnimationFrame(animateSnail);
    }
    
    // Fonction pour faire sauter l'escargot
    function jump() {
        snail.classList.add('jump');
        
        // Retirer la classe après l'animation
        setTimeout(() => {
            snail.classList.remove('jump');
        }, 500);
    }
    
    // Démarrer l'animation
    animateSnail();
    
    // Faire sauter l'escargot au clic
    snail.addEventListener('click', () => {
        jump();
    });
    
    // Ajouter des attributs ARIA pour l'accessibilité
    snail.setAttribute('role', 'button');
    snail.setAttribute('aria-label', 'Faire sauter l\'escargot');
    snail.setAttribute('tabindex', '0');
    
    // Permettre l'activation au clavier
    snail.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            jump();
        }
    });
}

// Fonction pour créer des créatures flottantes
function createFloatingCreatures() {
    const container = document.querySelector('.hero');
    if (!container) return;
    
    // Emojis de nature
    const creatures = ['🦋', '🐝', '🌸', '🍃', '🌿', '🍂', '🌱', '🦢', '🐌', '🐞'];
    
    // Créer plusieurs créatures
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            createCreature();
        }, i * 2000); // Créer une nouvelle créature toutes les 2 secondes
    }
    
    function createCreature() {
        const creature = document.createElement('div');
        creature.className = 'floating-creature';
        
        // Choisir un emoji aléatoire
        const emoji = creatures[Math.floor(Math.random() * creatures.length)];
        creature.textContent = emoji;
        
        // Positionner aléatoirement en bas de l'écran
        const startX = -50;
        const startY = Math.random() * (container.offsetHeight - 100) + 50;
        
        // Appliquer des styles
        creature.style.left = `${startX}px`;
        creature.style.top = `${startY}px`;
        creature.style.opacity = '0.7';
        creature.style.fontSize = `${Math.random() * 20 + 10}px`;
        
        // Ajouter au conteneur
        container.appendChild(creature);
        
        // Animation de flottement
        const duration = Math.random() * 15000 + 10000; // 10-25 secondes
        
        // Animation avec requestAnimationFrame pour de meilleures performances
        const startTime = performance.now();
        const endX = container.offsetWidth + 100;
        
        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                // Mouvement horizontal
                const currentX = startX + (endX - startX) * progress;
                
                // Mouvement vertical ondulant
                const wave = Math.sin(progress * 5) * 30;
                const currentY = startY + wave;
                
                creature.style.transform = `translate(${currentX}px, ${currentY}px)`;
                
                requestAnimationFrame(animate);
            } else {
                // Animation terminée, supprimer l'élément
                container.removeChild(creature);
                
                // Créer une nouvelle créature pour remplacer celle-ci
                setTimeout(createCreature, Math.random() * 2000);
            }
        }
        
        requestAnimationFrame(animate);
    }
}

// Initialiser le site au chargement du DOM
document.addEventListener('DOMContentLoaded', initializeSite);

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
