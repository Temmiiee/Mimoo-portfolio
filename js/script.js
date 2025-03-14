document.addEventListener('DOMContentLoaded', () => {
    console.log("Initializing application...");
    initializeNavigation();
    initializeGallery();
    initializeLightbox();
    initializeAOS();
    initializeSnail();
    initializeHoverEffects();
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

function initializeGallery() {
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
        
        prevBtn.style.visibility = index === 0 ? 'hidden' : 'visible';
        nextBtn.style.visibility = index === galleryItems.length - 1 ? 'hidden' : 'visible';
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            showImage(index);
        });
    });

    closeBtn.addEventListener('click', () => lightbox.classList.remove('active'));

    prevBtn?.addEventListener('click', () => {
        if (currentIndex > 0) showImage(currentIndex - 1);
    });

    nextBtn?.addEventListener('click', () => {
        if (currentIndex < galleryItems.length - 1) showImage(currentIndex + 1);
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                lightbox.classList.remove('active');
                break;
            case 'ArrowLeft':
                if (currentIndex > 0) showImage(currentIndex - 1);
                break;
            case 'ArrowRight':
                if (currentIndex < galleryItems.length - 1) showImage(currentIndex + 1);
                break;
        }
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) lightbox.classList.remove('active');
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
    
    function createCreature() {
        const creature = document.createElement('div');
        creature.className = 'floating-creature';
        creature.textContent = creatures[Math.floor(Math.random() * creatures.length)];
        
        creature.style.left = '-50px';
        creature.style.top = Math.random() * (window.innerHeight - 100) + 'px';
        creature.style.opacity = '0';
        
        container.appendChild(creature);

        const timeline = gsap.timeline({
            onComplete: () => {
                container.removeChild(creature);
                setTimeout(createCreature, Math.random() * 5000 + 8000);
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

    for (let i = 0; i < 3; i++) {
        setTimeout(createCreature, i * 4000);
    }
}
