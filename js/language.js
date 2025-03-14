class LanguageManager {
    constructor() {
        // S'assurer que les traductions sont chargées
        if (typeof window.translations === 'undefined') {
            console.error('Translations not loaded');
            return;
        }
        this.currentLang = localStorage.getItem('preferred-language') || 'fr';
        this.init();
    }

    init() {
        this.updateLanguageButtons();
        this.translatePage();
        this.setupEventListeners();
    }

    updateLanguageButtons() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === this.currentLang);
        });
    }

    translatePage() {
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.dataset.translate;
            const translation = this.getTranslation(key);
            if (translation) {
                element.textContent = translation;
            }
        });
    }

    getTranslation(key) {
        return key.split('.').reduce((obj, i) => obj ? obj[i] : null, window.translations[this.currentLang]);
    }

    setupEventListeners() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentLang = btn.dataset.lang;
                localStorage.setItem('preferred-language', this.currentLang);
                this.updateLanguageButtons();
                this.translatePage();
            });
        });
    }
}

// Attendre que le DOM soit chargé ET que les traductions soient disponibles
document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.translations !== 'undefined') {
        window.languageManager = new LanguageManager();
    } else {
        console.error('Translations not loaded');
    }
});  // Ajout de la parenthèse fermante manquante ici
