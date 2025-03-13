class LanguageManager {
    constructor() {
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
            if (translation) element.textContent = translation;
        });

        // Mettre à jour les attributs spéciaux
        document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
            const key = element.dataset.translatePlaceholder;
            const translation = this.getTranslation(key);
            if (translation) element.placeholder = translation;
        });
    }

    getTranslation(key) {
        return key.split('.').reduce((obj, i) => obj ? obj[i] : null, translations[this.currentLang]);
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

// Initialiser le gestionnaire de langue quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    window.languageManager = new LanguageManager();
});