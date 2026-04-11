/**
 * Mimoo Portfolio - Main Script
 */

(function() {
    'use strict';

    window.SITE_VERSION = '1.1.2';

    /**
     * Helper to initialize scroll animations
     */
    window.initScrollAnimations = function() {
        if (!('IntersectionObserver' in window)) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.animate:not(.in-view)').forEach(el => observer.observe(el));
    };

    /**
     * Main Initialization
     */
    function initializeSite() {
        console.log('🚀 Mimoo Portfolio: Initializing system...');
        
        setupNavigation();
        setupLanguage();
        setupSnail();
        setupLightbox();
        setupDecorations();

        // Reveal site
        setTimeout(() => {
            document.body.classList.add('animations-loaded');
            window.initScrollAnimations();
        }, 300);
    }

    /**
     * Navigation & Hamburger
     */
    function setupNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        const overlay = document.querySelector('.nav-overlay');

        if (!hamburger || !navLinks) return;

        const toggleMenu = () => {
            const isActive = hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            if (overlay) overlay.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isActive);
            document.body.style.overflow = isActive ? 'hidden' : '';
        };

        hamburger.addEventListener('click', e => {
            e.preventDefault();
            toggleMenu();
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (hamburger.classList.contains('active')) toggleMenu();
            });
        });

        if (overlay) overlay.addEventListener('click', toggleMenu);
    }

    /**
     * Language Manager Bridge
     */
    function setupLanguage() {
        if (window.LanguageManager) {
            window.LanguageManager.start();
        }
    }

    /**
     * Snail Jump Logic
     */
    function setupSnail() {
        const snail = document.querySelector('.snail');
        if (!snail) return;

        snail.addEventListener('click', () => {
            if (snail.classList.contains('jumping')) return;
            snail.classList.add('jumping');
            setTimeout(() => {
                snail.classList.remove('jumping');
            }, 600);
        });
    }

    /**
     * Lightbox for Images
     */
    function setupLightbox() {
        const lightbox = document.querySelector('.lightbox');
        const galleryGrid = document.querySelector('.gallery-grid');
        if (!lightbox || !galleryGrid) return;

        const img = lightbox.querySelector('.lightbox-image');
        const title = lightbox.querySelector('.lightbox-title');
        let currentIndex = 0;
        let activeItems = [];

        const updateLightbox = (idx) => {
            activeItems = Array.from(document.querySelectorAll('.gallery-item'));
            if (idx < 0) idx = activeItems.length - 1;
            if (idx >= activeItems.length) idx = 0;
            currentIndex = idx;

            const item = activeItems[currentIndex];
            img.src = item.querySelector('img').src;
            title.textContent = item.querySelector('h3').textContent;
        };

        galleryGrid.addEventListener('click', e => {
            const item = e.target.closest('.gallery-item');
            if (!item) return;

            activeItems = Array.from(document.querySelectorAll('.gallery-item'));
            updateLightbox(activeItems.indexOf(item));
            lightbox.classList.add('active');
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });

        lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
            lightbox.classList.remove('active');
            lightbox.style.display = 'none';
            document.body.style.overflow = '';
        });

        lightbox.querySelector('.lightbox-prev').addEventListener('click', e => { e.stopPropagation(); updateLightbox(currentIndex - 1); });
        lightbox.querySelector('.lightbox-next').addEventListener('click', e => { e.stopPropagation(); updateLightbox(currentIndex + 1); });
        
        lightbox.addEventListener('click', e => {
            if (e.target === lightbox) lightbox.querySelector('.lightbox-close').click();
        });

        // SUPPORT CLAVIER
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'ArrowLeft') updateLightbox(currentIndex - 1);
            if (e.key === 'ArrowRight') updateLightbox(currentIndex + 1);
            if (e.key === 'Escape') lightbox.querySelector('.lightbox-close').click();
        });

        // SUPPORT SWIPE (TOUCH)
        let touchStartX = 0;
        let touchEndX = 0;

        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const threshold = 50;
            if (touchEndX < touchStartX - threshold) updateLightbox(currentIndex + 1); // Swipe gauche -> Suivant
            if (touchEndX > touchStartX + threshold) updateLightbox(currentIndex - 1); // Swipe droite -> Précédent
        }, { passive: true });
    }

    /**
     * Decorative floating elements
     */
    function setupDecorations() {
        const container = document.body;
        const emojis = ['🦋', '🐝', '🐞', '🍃', '🌸'];
        
        for (let i = 0; i < 4; i++) {
            const el = document.createElement('div');
            el.className = 'floating-creature';
            el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            el.style.left = Math.random() * 90 + 'vw';
            el.style.top = Math.random() * 90 + 'vh';
            container.appendChild(el);
            
            el.animate([
                { transform: 'translate(0, 0)', opacity: 0 },
                { opacity: 0.5, offset: 0.2 },
                { transform: `translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px)`, opacity: 0.5, offset: 0.5 },
                { transform: 'translate(0, 0)', opacity: 0 }
            ], {
                duration: 12000 + Math.random() * 10000,
                iterations: Infinity,
                easing: 'ease-in-out'
            });
        }
    }

    // Init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSite);
    } else {
        initializeSite();
    }

})();
