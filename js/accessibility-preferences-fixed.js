/**
 * Module de préférences d'accessibilité
 * Permet aux utilisateurs de personnaliser leur expérience
 */

document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si les préférences d'accessibilité sont déjà définies
    const highContrast = localStorage.getItem('highContrast') === 'true';
    const reducedMotion = localStorage.getItem('reducedMotion') === 'true';
    const darkTheme = localStorage.getItem('darkTheme') === 'true';
    const textSize = localStorage.getItem('textSize') || '100';

    // Appliquer les préférences au chargement
    if (highContrast) {
        document.documentElement.classList.add('high-contrast');
    }
    
    if (reducedMotion) {
        document.documentElement.classList.add('reduced-motion');
    }
    
    if (darkTheme) {
        document.documentElement.classList.add('dark-theme');
    }
    
    document.documentElement.style.fontSize = `${textSize}%`;

    // Créer le bouton d'accessibilité
    const accessibilityButton = document.createElement('button');
    accessibilityButton.className = 'accessibility-button';
    accessibilityButton.setAttribute('aria-label', 'Accessibility options');
    accessibilityButton.innerHTML = '<span class="accessibility-icon">♿</span>';
    document.body.appendChild(accessibilityButton);

    // Créer le menu d'accessibilité
    const accessibilityMenu = document.createElement('div');
    accessibilityMenu.className = 'accessibility-menu';
    accessibilityMenu.innerHTML = `
        <div class="accessibility-content">
            <div class="accessibility-header">
                <h3>Options d'accessibilité</h3>
                <button class="close-button" aria-label="Fermer le menu d'accessibilité">&times;</button>
            </div>
            <div class="accessibility-options">
                <div class="option">
                    <label for="high-contrast">Contraste élevé</label>
                    <button id="high-contrast" class="toggle-button" role="switch" aria-checked="${highContrast}" aria-pressed="${highContrast}">
                        <span class="toggle-track"></span>
                        <span class="toggle-thumb"></span>
                    </button>
                </div>
                <div class="option">
                    <label for="reduced-motion">Réduire les animations</label>
                    <button id="reduced-motion" class="toggle-button" role="switch" aria-checked="${reducedMotion}" aria-pressed="${reducedMotion}">
                        <span class="toggle-track"></span>
                        <span class="toggle-thumb"></span>
                    </button>
                </div>
                <div class="option">
                    <label for="dark-theme">Mode sombre</label>
                    <button id="dark-theme" class="toggle-button" role="switch" aria-checked="${darkTheme}" aria-pressed="${darkTheme}">
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
        </div>
    `;
    document.body.appendChild(accessibilityMenu);

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
        highContrastButton.setAttribute('aria-checked', !isPressed);
        document.documentElement.classList.toggle('high-contrast');
        localStorage.setItem('highContrast', !isPressed);
    });

    // Gestionnaire pour la réduction des animations
    const reducedMotionButton = accessibilityMenu.querySelector('#reduced-motion');
    reducedMotionButton.addEventListener('click', function() {
        const isPressed = reducedMotionButton.getAttribute('aria-pressed') === 'true';
        reducedMotionButton.setAttribute('aria-pressed', !isPressed);
        reducedMotionButton.setAttribute('aria-checked', !isPressed);
        document.documentElement.classList.toggle('reduced-motion');
        localStorage.setItem('reducedMotion', !isPressed);
    });

    // Gestionnaire pour le mode sombre
    const darkThemeButton = accessibilityMenu.querySelector('#dark-theme');
    darkThemeButton.addEventListener('click', function() {
        const isPressed = darkThemeButton.getAttribute('aria-pressed') === 'true';
        darkThemeButton.setAttribute('aria-pressed', !isPressed);
        darkThemeButton.setAttribute('aria-checked', !isPressed);
        document.documentElement.classList.toggle('dark-theme');
        localStorage.setItem('darkTheme', !isPressed);
    });

    // Gestionnaires pour la taille du texte
    const textSizeDecrease = accessibilityMenu.querySelector('#text-size-decrease');
    const textSizeReset = accessibilityMenu.querySelector('#text-size-reset');
    const textSizeIncrease = accessibilityMenu.querySelector('#text-size-increase');

    textSizeDecrease.addEventListener('click', function() {
        const currentSize = parseInt(localStorage.getItem('textSize') || '100');
        const newSize = Math.max(currentSize - 10, 70);
        document.documentElement.style.fontSize = `${newSize}%`;
        localStorage.setItem('textSize', newSize);
    });

    textSizeReset.addEventListener('click', function() {
        document.documentElement.style.fontSize = '100%';
        localStorage.setItem('textSize', 100);
    });

    textSizeIncrease.addEventListener('click', function() {
        const currentSize = parseInt(localStorage.getItem('textSize') || '100');
        const newSize = Math.min(currentSize + 10, 150);
        document.documentElement.style.fontSize = `${newSize}%`;
        localStorage.setItem('textSize', newSize);
    });
});
