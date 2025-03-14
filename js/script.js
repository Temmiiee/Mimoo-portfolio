document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeGallery();
    initializeLightbox();
    initializeAOS();
    initializeSnail();
    createFloatingCreatures();
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
    const snail = document.querySelector('.snail');
    
    snail.addEventListener('click', () => {
        if (!snail.classList.contains('jumping')) {
            snail.classList.add('jumping');
            
            setTimeout(() => {
                snail.classList.remove('jumping');
            }, 500);
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

    // Pour les éléments de la galerie
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

function initializeGallery() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    let currentIndex = 0;

    // Gestion des filtres
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Mise à jour des boutons de filtre
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
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

    // Fonction pour afficher une image dans la lightbox
    function showImage(index) {
        const visibleItems = Array.from(galleryItems).filter(item => 
            item.style.display !== 'none'
        );
        currentIndex = index;
        const imgSrc = visibleItems[index].querySelector('img').src;
        lightboxImg.src = imgSrc;
        lightbox.classList.add('active');

        // Mise à jour des boutons de navigation
        prevBtn.style.visibility = index === 0 ? 'hidden' : 'visible';
        nextBtn.style.visibility = index === visibleItems.length - 1 ? 'hidden' : 'visible';
    }

    // Gestion de la lightbox
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            const visibleItems = Array.from(galleryItems).filter(item => 
                item.style.display !== 'none'
            );
            const visibleIndex = visibleItems.indexOf(item);
            showImage(visibleIndex);
        });
    });

    // Fermeture de la lightbox
    closeBtn.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    // Navigation dans la lightbox
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            showImage(currentIndex - 1);
        }
    });

    nextBtn.addEventListener('click', () => {
        const visibleItems = Array.from(galleryItems).filter(item => 
            item.style.display !== 'none'
        );
        if (currentIndex < visibleItems.length - 1) {
            showImage(currentIndex + 1);
        }
    });

    // Fermeture avec la touche Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
        }
        // Navigation avec les flèches
        if (lightbox.classList.contains('active')) {
            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                showImage(currentIndex - 1);
            }
            if (e.key === 'ArrowRight') {
                const visibleItems = Array.from(galleryItems).filter(item => 
                    item.style.display !== 'none'
                );
                if (currentIndex < visibleItems.length - 1) {
                    showImage(currentIndex + 1);
                }
            }
        }
    });

    // Fermeture en cliquant en dehors de l'image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });
}

function initializeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item img'));
    let currentIndex = 0;

    function showImage(index) {
        currentIndex = index;
        const imgSrc = galleryItems[index].src;
        lightboxImg.src = imgSrc;
        lightbox.classList.add('active');
        
        // Mettre à jour la visibilité des boutons de navigation
        prevBtn.style.visibility = index === 0 ? 'hidden' : 'visible';
        nextBtn.style.visibility = index === galleryItems.length - 1 ? 'hidden' : 'visible';
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            showImage(index);
        });
    });

    closeBtn.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    prevBtn?.addEventListener('click', () => {
        if (currentIndex > 0) {
            showImage(currentIndex - 1);
        }
    });

    nextBtn?.addEventListener('click', () => {
        if (currentIndex < galleryItems.length - 1) {
            showImage(currentIndex + 1);
        }
    });

    // Fermer avec la touche Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
        }
    });

    // Fermer en cliquant en dehors de l'image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
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

// Fonction pour créer les émojis flottants
function createFloatingCreatures() {
    const creatures = ['🦋', '🍃', '🌸'];
    const container = document.body;
    
    function createCreature() {
        const creature = document.createElement('div');
        creature.className = 'floating-creature';
        creature.textContent = creatures[Math.floor(Math.random() * creatures.length)];
        
        // Position initiale
        creature.style.left = '-50px';
        creature.style.top = Math.random() * (window.innerHeight - 100) + 'px';
        creature.style.opacity = '0';
        
        container.appendChild(creature);

        const timeline = gsap.timeline({
            onComplete: () => {
                container.removeChild(creature);
                setTimeout(createCreature, Math.random() * 5000 + 8000); // Délai entre 8 et 13 secondes
            }
        });

        timeline
            .to(creature, {
                opacity: 0.4,
                duration: 2,
                ease: "power2.in"
            })
            .to(creature, {
                left: window.innerWidth + 50 + 'px',
                top: '+=' + (Math.random() * 100 - 50) + 'px',
                rotation: Math.random() * 180,
                duration: 25 + Math.random() * 10,
                ease: "none"
            }, "-=0.5")
            .to(creature, {
                opacity: 0,
                duration: 2,
                ease: "power2.out"
            }, "-=3");

        gsap.to(creature, {
            scale: 1.2,
            duration: 3,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
        });
    }

    // Démarrage initial avec 3 créatures espacées
    for (let i = 0; i < 3; i++) {
        setTimeout(createCreature, i * 4000);
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    createFloatingCreatures();
});

