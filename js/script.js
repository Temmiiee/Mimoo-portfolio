document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeGalleryFilters();
    initializeLightbox();
    initializeAOS();
    initializeSnail();
    initializeHoverEffects();
    createFloatingCreatures();
    preload3DModels();
});

function preload3DModels() {
    if (!window.modelCache) return;

    const modelItems = document.querySelectorAll('.gallery-item[data-type="3d"]');

    modelItems.forEach(item => {
        const modelUrl = item.getAttribute('data-model-url') || item.getAttribute('data-model-path');
        if (modelUrl) {
            window.modelCache.preloadModel(modelUrl);
        }
    });
}

function initializeNavigation() {
    const nav = document.querySelector('nav');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

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
    const snail = document.querySelector('.snail');
    if (!snail) {
        console.error("Snail element not found!");
        return;
    }

    snail.addEventListener('click', () => {
        if (!snail.classList.contains('jumping')) {
            snail.classList.add('jumping');
            setTimeout(() => snail.classList.remove('jumping'), 500);
        }
    });
}

function initializeHoverEffects() {
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 5px 15px rgba(85, 113, 83, 0.3)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = 'none';
        });
    });

    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-5px)';
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0)';
        });
    });
}

function initializeGalleryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.style.display = '';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

function initializeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox img');
    const lightboxTitle = document.querySelector('.lightbox-title');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const modelContainer = document.getElementById('model-container');
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
        const modelPath = item.getAttribute('data-model-url') || item.getAttribute('data-model-path');

        if (is3DModel && modelPath) {
            lightboxImg.style.display = 'none';
            modelContainer.classList.add('active');
            document.querySelector('.lightbox-content').classList.add('model-view');

            if (!modelViewer) {
                modelViewer = new EnhancedModelViewer(modelContainer);
            }

            setTimeout(() => {
                modelViewer.init();
                modelViewer.loadModel(modelPath);

                setTimeout(() => {
                    if (modelViewer) {
                        modelViewer.onWindowResize();
                    }
                }, 100);
            }, 50);
        } else {
            lightboxImg.style.display = 'block';
            modelContainer.classList.remove('active');
            document.querySelector('.lightbox-content').classList.remove('model-view');

            if (modelViewer) {
                modelViewer.dispose();
            }

            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
        }

        lightboxTitle.textContent = title;
        lightbox.classList.add('active');
        document.body.classList.add('lightbox-active');

        lightboxPrev.style.visibility = index === 0 ? 'hidden' : 'visible';
        lightboxNext.style.visibility = index === galleryItems.length - 1 ? 'hidden' : 'visible';
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            showLightbox(index);
        });
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

    // Navigation au clavier
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                lightbox.classList.remove('active');
                document.body.classList.remove('lightbox-active');

                if (modelViewer) {
                    modelViewer.dispose();
                    modelViewer = null;
                }
                modelContainer.classList.remove('active');
                document.querySelector('.lightbox-content').classList.remove('model-view');
                break;
            case 'ArrowLeft':
                if (currentIndex > 0) showLightbox(currentIndex - 1);
                break;
            case 'ArrowRight':
                if (currentIndex < galleryItems.length - 1) showLightbox(currentIndex + 1);
                break;
        }
    });

    // Fermer en cliquant en dehors de l'image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.classList.remove('lightbox-active');

            if (modelViewer) {
                modelViewer.dispose();
                modelViewer = null;
            }
            modelContainer.classList.remove('active');
            document.querySelector('.lightbox-content').classList.remove('model-view');
        }
    });
}

function initializeAOS() {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });
}

function createFloatingCreatures() {
    const creatures = ['🦋', '🍃', '🌸'];
    const container = document.body;

    function getRandomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    function createCreature() {
        const creature = document.createElement('div');
        creature.className = 'floating-creature';
        creature.textContent = creatures[Math.floor(Math.random() * creatures.length)];

        const randomSize = getRandomBetween(16, 32);
        creature.style.fontSize = `${randomSize}px`;

        const maxOpacity = getRandomBetween(0.4, 0.9);

        creature.style.left = '-30px';
        creature.style.top = Math.random() * (window.innerHeight - 150) + 50 + 'px';
        creature.style.opacity = '0';

        container.appendChild(creature);

        const timeline = gsap.timeline({
            onComplete: () => {
                container.removeChild(creature);
                setTimeout(createCreature, Math.random() * 2000 + 3000);
            }
        });

        timeline
            .to(creature, {
                opacity: maxOpacity,
                duration: 0.8,
                ease: "power1.in"
            })
            .to(creature, {
                left: window.innerWidth + 30 + 'px',
                top: '+=' + (Math.random() * 60 - 30) + 'px',
                rotation: Math.random() * 360,
                duration: getRandomBetween(8, 15),
                ease: "power1.inOut"
            }, "-=0.8")
            .to(creature, {
                opacity: 0,
                duration: 0.8,
                ease: "power1.out"
            }, "-=2");

        gsap.to(creature, {
            y: `+=${getRandomBetween(10, 20)}`,
            duration: getRandomBetween(1, 2),
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
        });

        gsap.to(creature, {
            rotation: "+=45",
            duration: getRandomBetween(2, 4),
            yoyo: true,
            repeat: -1,
            ease: "none"
        });
    }

    for (let i = 0; i < 5; i++) {
        setTimeout(createCreature, getRandomBetween(0, 3000));
    }
}

