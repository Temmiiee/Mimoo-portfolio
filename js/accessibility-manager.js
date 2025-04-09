/**
 * Accessibility Manager
 * Gère les préférences d'accessibilité des utilisateurs
 */

class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        // Détecter les préférences de l'utilisateur
        this.detectUserPreferences();
        
        // Ajouter des écouteurs d'événements pour les changements de préférences
        this.addMediaQueryListeners();
        
        // Initialiser les gestionnaires d'événements clavier
        this.initKeyboardHandlers();
    }

    detectUserPreferences() {
        // Détecter si l'utilisateur préfère un contraste élevé
        const prefersHighContrast = window.matchMedia('(prefers-contrast: more)').matches;
        if (prefersHighContrast) {
            document.documentElement.classList.add('high-contrast');
        }
        
        // Détecter si l'utilisateur préfère réduire les animations
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            document.documentElement.classList.add('reduced-motion');
        }
        
        // Détecter si l'utilisateur utilise un thème sombre
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDarkMode) {
            document.documentElement.classList.add('dark-theme');
        }
    }

    addMediaQueryListeners() {
        // Écouter les changements de préférence de contraste
        window.matchMedia('(prefers-contrast: more)').addEventListener('change', e => {
            document.documentElement.classList.toggle('high-contrast', e.matches);
        });
        
        // Écouter les changements de préférence d'animation
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', e => {
            document.documentElement.classList.toggle('reduced-motion', e.matches);
        });
        
        // Écouter les changements de préférence de thème
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            document.documentElement.classList.toggle('dark-theme', e.matches);
        });
    }

    initKeyboardHandlers() {
        // Ajouter un gestionnaire d'événements pour les raccourcis clavier d'accessibilité
        document.addEventListener('keydown', e => {
            // Alt+A pour ouvrir le menu d'accessibilité (à implémenter)
            if (e.altKey && e.key === 'a') {
                e.preventDefault();
                this.toggleAccessibilityMenu();
            }
            
            // Échap pour fermer les modales et menus
            if (e.key === 'Escape') {
                this.handleEscapeKey();
            }
            
            // Tab pour la navigation au clavier
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        // Détecter quand l'utilisateur utilise la souris
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    toggleAccessibilityMenu() {
        // Créer ou afficher le menu d'accessibilité
        let accessibilityMenu = document.getElementById('accessibility-menu');
        
        if (!accessibilityMenu) {
            accessibilityMenu = this.createAccessibilityMenu();
        }
        
        accessibilityMenu.classList.toggle('active');
        
        // Si le menu est actif, mettre le focus sur le premier élément
        if (accessibilityMenu.classList.contains('active')) {
            const firstButton = accessibilityMenu.querySelector('button');
            if (firstButton) {
                firstButton.focus();
            }
        }
    }

    createAccessibilityMenu() {
        // Créer le menu d'accessibilité
        const menu = document.createElement('div');
        menu.id = 'accessibility-menu';
        menu.className = 'accessibility-menu';
        menu.setAttribute('role', 'dialog');
        menu.setAttribute('aria-labelledby', 'accessibility-title');
        
        // Ajouter le contenu du menu
        menu.innerHTML = `
            <div class="accessibility-header">
                <h2 id="accessibility-title">Options d'accessibilité</h2>
                <button class="close-button" aria-label="Fermer le menu d'accessibilité">&times;</button>
            </div>
            <div class="accessibility-options">
                <div class="option">
                    <label for="high-contrast">Contraste élevé</label>
                    <button id="high-contrast" class="toggle-button" aria-pressed="false">
                        <span class="toggle-track"></span>
                        <span class="toggle-thumb"></span>
                    </button>
                </div>
                <div class="option">
                    <label for="reduced-motion">Réduire les animations</label>
                    <button id="reduced-motion" class="toggle-button" aria-pressed="false">
                        <span class="toggle-track"></span>
                        <span class="toggle-thumb"></span>
                    </button>
                </div>
                <div class="option">
                    <label for="text-size">Taille du texte</label>
                    <div class="text-size-controls">
                        <button id="text-size-decrease" aria-label="Réduire la taille du texte">A-</button>
                        <button id="text-size-reset" aria-label="Réinitialiser la taille du texte">A</button>
                        <button id="text-size-increase" aria-label="Augmenter la taille du texte">A+</button>
                    </div>
                </div>
            </div>
        `;
        
        // Ajouter le menu au document
        document.body.appendChild(menu);
        
        // Ajouter les gestionnaires d'événements
        const closeButton = menu.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
            menu.classList.remove('active');
        });
        
        // Gestionnaire pour le contraste élevé
        const highContrastButton = menu.querySelector('#high-contrast');
        highContrastButton.addEventListener('click', () => {
            const isPressed = highContrastButton.getAttribute('aria-pressed') === 'true';
            highContrastButton.setAttribute('aria-pressed', !isPressed);
            document.documentElement.classList.toggle('high-contrast');
        });
        
        // Gestionnaire pour la réduction des animations
        const reducedMotionButton = menu.querySelector('#reduced-motion');
        reducedMotionButton.addEventListener('click', () => {
            const isPressed = reducedMotionButton.getAttribute('aria-pressed') === 'true';
            reducedMotionButton.setAttribute('aria-pressed', !isPressed);
            document.documentElement.classList.toggle('reduced-motion');
        });
        
        // Gestionnaires pour la taille du texte
        const decreaseButton = menu.querySelector('#text-size-decrease');
        const resetButton = menu.querySelector('#text-size-reset');
        const increaseButton = menu.querySelector('#text-size-increase');
        
        decreaseButton.addEventListener('click', () => this.adjustTextSize(-1));
        resetButton.addEventListener('click', () => this.resetTextSize());
        increaseButton.addEventListener('click', () => this.adjustTextSize(1));
        
        return menu;
    }

    handleEscapeKey() {
        // Fermer le menu d'accessibilité s'il est ouvert
        const accessibilityMenu = document.getElementById('accessibility-menu');
        if (accessibilityMenu && accessibilityMenu.classList.contains('active')) {
            accessibilityMenu.classList.remove('active');
            return;
        }
        
        // Fermer la lightbox si elle est ouverte
        const lightbox = document.querySelector('.lightbox.active');
        if (lightbox) {
            const closeButton = lightbox.querySelector('.lightbox-close');
            if (closeButton) {
                closeButton.click();
            }
            return;
        }
        
        // Fermer le menu mobile s'il est ouvert
        const mobileMenu = document.querySelector('.mobile-menu.active');
        if (mobileMenu) {
            const hamburger = document.querySelector('.hamburger');
            if (hamburger) {
                hamburger.click();
            }
        }
    }

    adjustTextSize(direction) {
        // Obtenir la taille de police actuelle
        const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        
        // Calculer la nouvelle taille (augmenter ou diminuer de 10%)
        let newSize;
        if (direction > 0) {
            newSize = currentSize * 1.1; // Augmenter de 10%
        } else {
            newSize = currentSize * 0.9; // Diminuer de 10%
        }
        
        // Limiter la taille entre 12px et 24px
        newSize = Math.max(12, Math.min(24, newSize));
        
        // Appliquer la nouvelle taille
        document.documentElement.style.fontSize = `${newSize}px`;
    }

    resetTextSize() {
        // Réinitialiser la taille de police à la valeur par défaut
        document.documentElement.style.fontSize = '';
    }
}

// Initialiser le gestionnaire d'accessibilité lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    window.accessibilityManager = new AccessibilityManager();
});
