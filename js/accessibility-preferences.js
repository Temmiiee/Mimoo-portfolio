/**
 * Accessibility Preferences Manager
 * Détecte et applique les préférences d'accessibilité des utilisateurs
 */

document.addEventListener('DOMContentLoaded', function() {
    // Détecter si l'utilisateur préfère un contraste élevé
    const prefersHighContrast = window.matchMedia('(prefers-contrast: more)').matches;
    if (prefersHighContrast) {
        document.documentElement.classList.add('high-contrast');
        console.log('Mode contraste élevé activé');
    }

    // Détecter si l'utilisateur préfère réduire les animations
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        document.documentElement.classList.add('reduced-motion');
        console.log('Mode animations réduites activé');
    }

    // Détecter si l'utilisateur utilise un thème sombre
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDarkMode) {
        document.documentElement.classList.add('dark-theme');
        console.log('Mode sombre activé');
    }

    // Ajouter un bouton d'accessibilité dans le coin inférieur droit
    const accessibilityButton = document.createElement('button');
    accessibilityButton.className = 'accessibility-button';
    accessibilityButton.setAttribute('aria-label', 'Accessibility options');
    accessibilityButton.innerHTML = '<span class="accessibility-icon">♿</span>';
    document.body.appendChild(accessibilityButton);

    // Les styles sont maintenant dans un fichier CSS séparé (css/accessibility-menu.css)

    // Créer le menu d'accessibilité
    const accessibilityMenu = document.createElement('div');
    accessibilityMenu.className = 'accessibility-menu';
    accessibilityMenu.innerHTML = `
        <div class="accessibility-header">
            <h3>Accessibility Options</h3>
            <button class="close-button" aria-label="Close accessibility menu">×</button>
        </div>
        <div class="accessibility-options">
            <div class="option">
                <label for="high-contrast">High Contrast</label>
                <button id="high-contrast" class="toggle-button" aria-pressed="${prefersHighContrast}">
                    <span class="toggle-track"></span>
                    <span class="toggle-thumb"></span>
                </button>
            </div>
            <div class="option">
                <label for="reduced-motion">Reduced Motion</label>
                <button id="reduced-motion" class="toggle-button" aria-pressed="${prefersReducedMotion}">
                    <span class="toggle-track"></span>
                    <span class="toggle-thumb"></span>
                </button>
            </div>
            <div class="option">
                <label for="text-size">Text Size</label>
                <div class="text-size-controls">
                    <button id="text-size-decrease" aria-label="Decrease text size">A-</button>
                    <button id="text-size-reset" aria-label="Reset text size">A</button>
                    <button id="text-size-increase" aria-label="Increase text size">A+</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(accessibilityMenu);

    // Ajouter les styles pour le bouton et le menu d'accessibilité
    const style = document.createElement('style');
    style.textContent = `
        .accessibility-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: #2D4A2D;
            color: white;
            border: none;
            cursor: pointer;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .accessibility-icon {
            font-size: 24px;
        }

        .accessibility-menu {
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 300px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            padding: 20px;
            display: none;
        }

        .accessibility-menu.active {
            display: block;
        }

        .accessibility-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }

        .accessibility-header h3 {
            margin: 0;
            color: #2D4A2D;
        }

        .close-button {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #2D4A2D;
        }

        .accessibility-options {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .option {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .toggle-button {
            position: relative;
            width: 50px;
            height: 24px;
            background: none;
            border: none;
            padding: 0;
            cursor: pointer;
        }

        .toggle-track {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            border-radius: 12px;
            transition: background-color 0.3s;
        }

        .toggle-thumb {
            position: absolute;
            top: 2px;
            left: 2px;
            width: 20px;
            height: 20px;
            background-color: white;
            border-radius: 50%;
            transition: transform 0.3s;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        .toggle-button[aria-pressed="true"] .toggle-track {
            background-color: #2D4A2D;
        }

        .toggle-button[aria-pressed="true"] .toggle-thumb {
            transform: translateX(26px);
        }

        .text-size-controls {
            display: flex;
            gap: 5px;
        }

        .text-size-controls button {
            background-color: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
            font-weight: bold;
        }

        .text-size-controls button:hover {
            background-color: #e5e5e5;
        }

        /* Styles pour les modes d'accessibilité */
        .high-contrast {
            --primary-color: #1A2E1A;
            --secondary-color: #1A2E1A;
            --accent-color: #2D4A2D;
            --light-color: #FFFFFF;
            --bg-color: #FFFFFF;
            --text-color: #000000;
            --overlay-color: rgba(0, 0, 0, 0.9);
            --dark-color: #000000;
        }

        .reduced-motion * {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
            scroll-behavior: auto !important;
        }

        .dark-theme {
            --primary-color: #7D9D7D;
            --secondary-color: #7D9D7D;
            --accent-color: #A9CF9A;
            --light-color: #FFFFFF;
            --bg-color: #222222;
            --text-color: #FFFFFF;
            --overlay-color: rgba(0, 0, 0, 0.9);
            --dark-color: #000000;
        }
    `;
    document.head.appendChild(style);

    // Ajouter les gestionnaires d'événements
    accessibilityButton.addEventListener('click', function() {
        accessibilityMenu.classList.toggle('active');
    });

    const closeButton = accessibilityMenu.querySelector('.close-button');
    closeButton.addEventListener('click', function() {
        accessibilityMenu.classList.remove('active');
    });

    // Gestionnaire pour le contraste élevé
    const highContrastButton = accessibilityMenu.querySelector('#high-contrast');
    highContrastButton.addEventListener('click', function() {
        const isPressed = highContrastButton.getAttribute('aria-pressed') === 'true';
        highContrastButton.setAttribute('aria-pressed', !isPressed);
        document.documentElement.classList.toggle('high-contrast');
    });

    // Gestionnaire pour la réduction des animations
    const reducedMotionButton = accessibilityMenu.querySelector('#reduced-motion');
    reducedMotionButton.addEventListener('click', function() {
        const isPressed = reducedMotionButton.getAttribute('aria-pressed') === 'true';
        reducedMotionButton.setAttribute('aria-pressed', !isPressed);
        document.documentElement.classList.toggle('reduced-motion');
    });

    // Gestionnaires pour la taille du texte
    const decreaseButton = accessibilityMenu.querySelector('#text-size-decrease');
    const resetButton = accessibilityMenu.querySelector('#text-size-reset');
    const increaseButton = accessibilityMenu.querySelector('#text-size-increase');

    decreaseButton.addEventListener('click', function() {
        const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        document.documentElement.style.fontSize = (currentSize * 0.9) + 'px';
    });

    resetButton.addEventListener('click', function() {
        document.documentElement.style.fontSize = '';
    });

    increaseButton.addEventListener('click', function() {
        const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        document.documentElement.style.fontSize = (currentSize * 1.1) + 'px';
    });

    // Fermer le menu en cliquant en dehors
    document.addEventListener('click', function(event) {
        if (!accessibilityMenu.contains(event.target) && !accessibilityButton.contains(event.target) && accessibilityMenu.classList.contains('active')) {
            accessibilityMenu.classList.remove('active');
        }
    });
});
