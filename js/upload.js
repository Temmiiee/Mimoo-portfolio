// upload.js - Handle image uploads via secure backend (Admin page only)
// The backend securely handles GetPronto API authentication

class ImageUploader {
    constructor() {
        this.uploadForm = null;
        this.fileInput = null;
        this.uploadButton = null;
        this.uploadStatus = null;

        this.init();
    }

    init() {
        // This script should only run on admin.html
        if (!window.location.pathname.includes('admin.html')) {
            return; // Exit if not on admin page
        }

        this.initializeUploader();
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
            // Send to backend (backend handles GetPronto API securely)
            const formData = new FormData();
            formData.append('file', file);

            // Use backend URL from config
            const backendUrl = CONFIG.BACKEND_UPLOAD_URL || 'http://localhost:3001';
            const uploadUrl = `${backendUrl}/api/upload`;

            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData
                // No Authorization header - backend handles authentication!
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();

            if (result.error) {
                throw new Error(result.error);
            }

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