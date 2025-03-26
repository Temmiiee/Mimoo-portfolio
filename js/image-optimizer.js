/**
 * Image Optimizer Script
 * - Optimizes image loading
 * - Adds lazy loading to images
 * - Ensures proper dimensions are set
 */
document.addEventListener('DOMContentLoaded', function() {
    // Add loading="lazy" to all images that don't have it
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
        img.setAttribute('loading', 'lazy');
        
        // If image doesn't have width/height, set default values
        if (!img.hasAttribute('width') && !img.hasAttribute('height')) {
            img.setAttribute('width', '400');
            img.setAttribute('height', '300');
        }
    });

    // Preload critical images
    const criticalImages = [
        document.querySelector('.hero-background img')
    ].filter(Boolean);

    criticalImages.forEach(img => {
        img.setAttribute('loading', 'eager');
        
        // Create a preload link for critical images
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'image';
        preloadLink.href = img.src;
        document.head.appendChild(preloadLink);
    });

    // Fix 3D model loading issues
    const modelItems = document.querySelectorAll('.gallery-item[data-type="3d"]');
    modelItems.forEach(item => {
        const modelUrl = item.getAttribute('data-model-url');
        if (modelUrl) {
            // Create a prefetch link for 3D models
            const prefetchLink = document.createElement('link');
            prefetchLink.rel = 'prefetch';
            prefetchLink.href = modelUrl;
            document.head.appendChild(prefetchLink);
        }
    });
});
