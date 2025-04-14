// Utiliser une IIFE pour éviter les conflits globaux
(function() {
    if (window.LanguageManager) return; // Éviter la redéclaration

    window.LanguageManager = {
        constructor: function() {
            // S'assurer que les traductions sont chargées
            if (typeof window.translations === 'undefined') {
                // Translations not loaded
                return;
            }
            this.currentLang = localStorage.getItem('preferred-language') || 'fr';
            this.init();
        },

        init: function() {
            this.updateLanguageButtons();
            this.translatePage();
            this.setupEventListeners();
        },

        updateLanguageButtons: function() {
            document.querySelectorAll('.lang-btn').forEach(btn => {
                const isActive = btn.dataset.lang === this.currentLang;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-pressed', isActive);
            });
        },

        translatePage: function() {
            document.querySelectorAll('[data-translate]').forEach(element => {
                const key = element.dataset.translate;
                const translation = this.getTranslation(key);
                if (translation) {
                    element.textContent = translation;
                }
            });
        },

        getTranslation: function(key) {
            return key.split('.').reduce((obj, i) => obj ? obj[i] : null, window.translations[this.currentLang]);
        },

        setupEventListeners: function() {
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.currentLang = btn.dataset.lang;
                    localStorage.setItem('preferred-language', this.currentLang);
                    this.updateLanguageButtons();
                    this.translatePage();
                });
            });
        }
    };
})();  // Ajout de la parenthèse fermante manquante ici
