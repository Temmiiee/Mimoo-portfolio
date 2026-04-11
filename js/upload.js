// upload.js - Handle image uploads to getPronto (Admin only)

class ImageUploader {
    constructor() {
        this.isAdmin = false;
        this.uploadForm = null;
        this.fileInput = null;
        this.uploadButton = null;
        this.uploadStatus = null;

        this.init();
    }

    init() {
        // Check if user is admin
        this.checkAdminAccess();
    }

    checkAdminAccess() {
        // Simple admin authentication
        const adminPassword = prompt('Mot de passe administrateur pour accéder à l\'upload:');
        if (adminPassword === CONFIG.ADMIN_PASSWORD) {
            this.isAdmin = true;
            // Show upload section
            const uploadSection = document.getElementById('upload');
            if (uploadSection) {
                uploadSection.style.display = 'block';
            }
            this.initializeUploader();
        } else if (adminPassword !== null) { // Not cancelled
            alert('Mot de passe incorrect. Accès refusé.');
            // Keep upload section hidden
        }
    }

    initializeUploader() {
        this.uploadForm = document.getElementById('image-upload-form');
        this.fileInput = document.getElementById('image-file');
        this.uploadButton = document.getElementById('upload-button');
        this.uploadStatus = document.getElementById('upload-status');

        if (this.uploadForm) {
            this.uploadForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.uploadImage();
            });
        }

        // Handle file selection button
        const selectBtn = document.getElementById('select-file-btn');
        if (selectBtn) {
            selectBtn.addEventListener('click', () => {
                this.fileInput.click();
            });
        }

        // Also handle drag and drop
        const dropZone = document.getElementById('upload-drop-zone');
        if (dropZone) {
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('drag-over');
            });

            dropZone.addEventListener('dragleave', () => {
                dropZone.classList.remove('drag-over');
            });

            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('drag-over');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.fileInput.files = files;
                    this.uploadImage();
                }
            });

            // Click on drop zone to select file
            dropZone.addEventListener('click', () => {
                this.fileInput.click();
            });
        }
    }

    async uploadImage() {
        if (!this.isAdmin) {
            this.showStatus('Accès non autorisé', 'error');
            return;
        }

        const file = this.fileInput.files[0];
        if (!file) {
            this.showStatus('Veuillez sélectionner une image', 'error');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showStatus('Veuillez sélectionner un fichier image valide', 'error');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            this.showStatus('Le fichier est trop volumineux (max 10MB)', 'error');
            return;
        }

        this.showStatus('Upload en cours...', 'loading');
        this.uploadButton.disabled = true;

        try {
            // Using getPronto API structure
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('https://api.getpronto.io/v1/files/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${CONFIG.GETPRONTO_API_KEY}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();

            if (result.data && result.data.url) {
                this.addImageToGallery(result.data.url, file.name);
                this.showStatus('Image ajoutée à la galerie avec succès!', 'success');
                this.fileInput.value = ''; // Reset form
            } else {
                throw new Error('URL de l\'image non trouvée dans la réponse');
            }

        } catch (error) {
            console.error('Upload error:', error);
            this.showStatus('Erreur lors de l\'upload: ' + error.message, 'error');
        } finally {
            this.uploadButton.disabled = false;
        }
    }

    addImageToGallery(imageUrl, fileName) {
        // Get existing uploaded images from localStorage
        let uploadedImages = JSON.parse(localStorage.getItem('uploadedImages') || '[]');

        // Add new image
        uploadedImages.push({
            url: imageUrl,
            name: fileName,
            uploadedAt: new Date().toISOString()
        });

        // Keep only last 50 images to avoid storage bloat
        if (uploadedImages.length > 50) {
            uploadedImages = uploadedImages.slice(-50);
        }

        // Save to localStorage
        localStorage.setItem('uploadedImages', JSON.stringify(uploadedImages));

        // Trigger gallery refresh
        if (window.PortfolioImageManager) {
            window.PortfolioImageManager.refreshGallery();
        }
    }

    showStatus(message, type) {
        if (this.uploadStatus) {
            this.uploadStatus.textContent = message;
            this.uploadStatus.className = `upload-status ${type}`;
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ImageUploader();
});