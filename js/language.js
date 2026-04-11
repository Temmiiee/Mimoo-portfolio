/**
 * Language Manager
 */
(function() {
    if (window.LanguageManager) return;

    window.LanguageManager = {
        currentLang: 'fr',

        start: function() {
            if (!window.translations) return;
            
            const saved = localStorage.getItem('preferred-language');
            const browserLang = navigator.language.substring(0, 2);
            this.currentLang = saved || (window.translations[browserLang] ? browserLang : 'fr');
            
            this.translatePage();
        },

        // Called from HTML onclick
        switch: function(lang) {
            console.log(`🌐 Language: User switch to "${lang}"`);
            if (!lang || !window.translations[lang]) return;

            this.currentLang = lang;
            localStorage.setItem('preferred-language', lang);
            this.translatePage();

            // Notify gallery to update its titles
            if (window.portfolioManager && typeof window.portfolioManager.renderGallery === 'function') {
                window.portfolioManager.renderGallery();
            }
        },

        translatePage: function() {
            console.log(`🌐 Language: Applying "${this.currentLang}"`);
            
            // 1. Update Buttons
            document.querySelectorAll('.lang-btn').forEach(btn => {
                const isActive = btn.dataset.lang === this.currentLang;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-pressed', isActive.toString());
            });

            // 2. Translate Elements
            document.querySelectorAll('[data-translate]').forEach(el => {
                const key = el.dataset.translate;
                const text = this.getTranslation(key);
                if (text) {
                    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = text;
                    else el.textContent = text;
                }
            });

            document.documentElement.lang = this.currentLang;
        },

        getTranslation: function(key) {
            try {
                return key.split('.').reduce((obj, i) => obj ? obj[i] : null, window.translations[this.currentLang]);
            } catch (e) {
                return null;
            }
        }
    };
})();
