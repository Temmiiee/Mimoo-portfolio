/**
 * portfolio-images.js
 * Manages the loading and display of gallery images
 */

class PortfolioImageManager {
    constructor() {
        this.jsonUrl = 'images/portfolio-images.json';
        this.staticImages = [];
        this.uploadedImages = [];
        this.galleryGrid = document.querySelector('.gallery-grid');
    }

    async init() {
        if (!this.galleryGrid) return;
        console.log('🖼️ Gallery: Initialization...');
        
        await this.loadStaticImages();
        this.loadUploadedImages();
        this.renderGallery();
    }

    async loadStaticImages() {
        try {
            const response = await fetch(this.jsonUrl);
            if (response.ok) {
                const data = await response.json();
                this.staticImages = data.images || [];
                console.log(`🖼️ Gallery: Loaded ${this.staticImages.length} images from JSON`);
            } else {
                console.error('🖼️ Gallery: Failed to load portfolio-images.json');
            }
        } catch (error) {
            console.error('🖼️ Gallery: Fetch error:', error);
        }
    }

    loadUploadedImages() {
        try {
            const data = localStorage.getItem('uploadedImages');
            this.uploadedImages = data ? JSON.parse(data) : [];
        } catch (error) {
            this.uploadedImages = [];
        }
    }

    sanitizeFilename(url) {
        if (!url) return '';
        const filename = url.split('/').pop().split('.')[0];
        const sanitized = filename
            .replace(/[_-]/g, ' ')             
            .replace(/\(\d+\)/g, '')           
            .replace(/\s+/g, ' ')              
            .trim();
        
        return sanitized.charAt(0).toUpperCase() + sanitized.slice(1);
    }

    renderGallery() {
        if (!this.galleryGrid) return;
        
        const allItems = [
            ...this.staticImages,
            ...this.uploadedImages
        ].map(img => (typeof img === 'string' ? { url: img } : img));

        console.log(`🖼️ Gallery: Rendering ${allItems.length} items`);
        
        // Don't empty if we have nothing to show yet (wait for init)
        if (allItems.length === 0 && this.staticImages.length === 0) {
            // Check if we are still initializing
            return;
        }

        this.galleryGrid.innerHTML = '';

        if (allItems.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.className = 'empty-msg';
            emptyMsg.style.cssText = 'grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-color);';
            emptyMsg.dataset.translate = 'gallery.empty';
            emptyMsg.textContent = 'Aucune image à afficher pour le moment.';
            this.galleryGrid.appendChild(emptyMsg);
        } else {
            allItems.forEach((item, index) => {
                const itemEl = this.createGalleryItem(item, index);
                this.galleryGrid.appendChild(itemEl);
            });
        }

        // Apply translations
        if (window.LanguageManager) {
            window.LanguageManager.translatePage();
        }

        // Init animations
        setTimeout(() => {
            if (typeof window.initScrollAnimations === 'function') {
                window.initScrollAnimations();
            }
        }, 100);
    }

    getTranslationKey(url) {
        if (!url) return null;
        const filename = url.split('/').pop().split('.')[0];
        
        const knownKeys = ['Harley', 'Dragon_arc-en-ciel', 'Dragon_Celeste', 'Chibi', 'Ange_et_dragon', 'Personnage', 'Spider_Wolf', 'Dragon_yeux_et_arc-en-ciel', 'Endroit_Mysterieux'];
        
        if (knownKeys.includes(filename)) return `gallery.items.${filename}.title`;
        return null;
    }

    createGalleryItem(item, index) {
        const div = document.createElement('div');
        div.className = `gallery-item animate fade-up`;
        div.style.animationDelay = `${(index % 3) * 0.1}s`;

        const img = document.createElement('img');
        img.src = item.url;
        img.alt = 'Portfolio Image';
        img.loading = 'lazy';

        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        
        const h3 = document.createElement('h3');
        const translateKey = this.getTranslationKey(item.url);
        if (translateKey) {
            h3.dataset.translate = translateKey;
        }
        h3.textContent = this.sanitizeFilename(item.url);
        
        overlay.appendChild(h3);
        div.appendChild(img);
        div.appendChild(overlay);

        return div;
    }

    refresh() {
        this.loadUploadedImages();
        this.renderGallery();
    }
}

window.portfolioManager = new PortfolioImageManager();

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.portfolioManager) window.portfolioManager.init();
    }, 50);
});