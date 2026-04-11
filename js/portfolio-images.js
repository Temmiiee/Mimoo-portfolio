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

            // Only call displayImages if we have uploaded images to show
            // Otherwise, let the static HTML gallery remain visible
            if (this.uploadedImages.length > 0) {
                this.displayImages();
            }
        } catch (error) {
            console.error('Error loading images:', error);
            // Don't call loadLocalImages() - let static HTML gallery remain visible
            // The static gallery in index.html will be shown by default
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

    displayImages() {
        const galleryContainer = document.querySelector('.gallery-grid');
        if (!galleryContainer) return;

        // Priority: Show uploaded images if they exist, otherwise show default images
        const allImages = this.uploadedImages.length > 0
            ? this.uploadedImages
            : this.images;

        // Remove only the gallery items, keep filters and structure
        const existingItems = galleryContainer.querySelectorAll('.gallery-item');
        existingItems.forEach(item => item.remove());

        // If no uploaded images, show the static HTML gallery items
        if (this.uploadedImages.length === 0) {
            // Re-show the static gallery items that were hidden
            const staticItems = galleryContainer.querySelectorAll('.gallery-item[style*="display: none"]');
            staticItems.forEach(item => item.style.display = '');
            return; // Don't add dynamic items if showing static ones
        }

        // Add uploaded images dynamically
        allImages.forEach((imageUrl, index) => {
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.alt = `Portfolio image ${index + 1}`;
            imgElement.loading = 'lazy';
            imgElement.width = 400;
            imgElement.height = 400;

            const itemDiv = document.createElement('div');
            itemDiv.className = 'gallery-item animate fade-up';
            itemDiv.style.animationDelay = `${(index % 3) * 0.1}s`; // Stagger animations
            itemDiv.setAttribute('data-category', 'uploaded'); // Mark as uploaded

            // Add overlay for uploaded images
            const overlay = document.createElement('div');
            overlay.className = 'overlay';
            overlay.innerHTML = `
                <h3>Image Uploadée</h3>
                <p>Contenu utilisateur</p>
            `;
            itemDiv.appendChild(overlay);
            itemDiv.appendChild(imgElement);

            galleryContainer.appendChild(itemDiv);
        });
    }

    refreshGallery() {
        this.loadUploadedImages();
        // Always call displayImages to update the gallery
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