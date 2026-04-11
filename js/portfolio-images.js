// portfolio-images.js
// Script to load portfolio images dynamically from JSON and localStorage

class PortfolioImageManager {
    constructor() {
        this.images = [];
        this.currentIndex = 0;
        this.jsonUrl = 'images/portfolio-images.json'; // JSON file with image URLs
        this.uploadedImages = [];
    }

    async loadImages() {
        try {
            // Load from JSON
            const response = await fetch(this.jsonUrl);
            const data = await response.json();
            this.images = data.images || [];

            // Load uploaded images from localStorage
            this.loadUploadedImages();

            this.displayImages();
        } catch (error) {
            console.error('Error loading images:', error);
            // Fallback to local images
            this.loadLocalImages();
        }
    }

    loadUploadedImages() {
        try {
            const uploaded = JSON.parse(localStorage.getItem('uploadedImages') || '[]');
            this.uploadedImages = uploaded.map(img => img.url);
        } catch (error) {
            console.error('Error loading uploaded images:', error);
            this.uploadedImages = [];
        }
    }

    loadLocalImages() {
        // Fallback to local images if JSON fails
        this.images = [
            'images/gallery/illustration1.webp',
            'images/gallery/illustration2.webp',
            'images/gallery/character1.webp',
            'images/gallery/character2.webp',
            'images/gallery/illustration3.webp',
            'images/gallery/character3.webp',
            'images/gallery/illustration4.webp',
            'images/gallery/character4.webp',
            'images/gallery/character5.webp',
            'images/previews/theiere-preview.jpg'
        ];
        this.displayImages();
    }

    displayImages() {
        const galleryContainer = document.querySelector('.gallery-grid');
        if (!galleryContainer) return;

        // Priority: Show uploaded images if they exist, otherwise show default images
        const allImages = this.uploadedImages.length > 0 
            ? this.uploadedImages 
            : this.images;

        // Clear existing content except filters
        const filters = galleryContainer.querySelector('.gallery-filters');
        galleryContainer.innerHTML = '';
        if (filters) {
            galleryContainer.appendChild(filters);
        }

        allImages.forEach((imageUrl, index) => {
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.alt = `Portfolio image ${index + 1}`;
            imgElement.loading = 'lazy';
            imgElement.className = 'gallery-item';

            const itemDiv = document.createElement('div');
            itemDiv.className = 'gallery-item animate fade-up';
            itemDiv.style.animationDelay = `${(index % 3) * 0.1}s`; // Stagger animations

            // Add overlay for uploaded images
            if (this.uploadedImages.includes(imageUrl)) {
                const overlay = document.createElement('div');
                overlay.className = 'overlay';
                overlay.innerHTML = `
                    <h3>Image Uploadée</h3>
                    <p>Contenu utilisateur</p>
                `;
                itemDiv.appendChild(overlay);
            }

            itemDiv.appendChild(imgElement);
            galleryContainer.appendChild(itemDiv);
        });
    }

    refreshGallery() {
        this.loadUploadedImages();
        this.displayImages();
    }

    // Method to rotate images periodically
    startRotation(intervalMinutes = 60) {
        setInterval(() => {
            this.currentIndex = (this.currentIndex + 1) % this.images.length;
            this.displayImages();
        }, intervalMinutes * 60 * 1000);
    }
}

// Make it globally accessible
window.PortfolioImageManager = null;

// Usage
document.addEventListener('DOMContentLoaded', () => {
    const portfolioManager = new PortfolioImageManager();
    window.PortfolioImageManager = portfolioManager;
    portfolioManager.loadImages();

    // Optional: rotate images every hour
    // portfolioManager.startRotation(60);
});