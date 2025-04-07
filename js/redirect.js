/**
 * Script de redirection pour les URLs inexistantes
 * Ce script détecte si l'URL actuelle ne correspond pas à une section valide
 * et redirige vers la page d'accueil si nécessaire
 */

(function() {
    // Liste des sections valides (IDs) dans votre site one-page
    const validSections = ['accueil', 'apropos', 'galerie', 'contact'];
    
    // Fonction exécutée au chargement de la page
    function handleRedirect() {
        // Obtenir le chemin de l'URL actuelle
        const path = window.location.pathname;
        
        // Si nous sommes sur la page d'accueil, ne rien faire
        if (path === '/' || path === '/index.html') {
            return;
        }
        
        // Vérifier si l'URL correspond à une section valide
        const hash = window.location.hash.replace('#', '');
        if (hash && validSections.includes(hash)) {
            return;
        }
        
        // Vérifier si l'URL correspond à un fichier existant
        // (Cette vérification est limitée côté client, mais peut aider dans certains cas)
        const extension = path.split('.').pop();
        const isFile = ['html', 'css', 'js', 'jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'ico', 'pdf'].includes(extension);
        
        // Si ce n'est pas un fichier connu et que ce n'est pas une section valide, rediriger vers l'accueil
        if (!isFile) {
            console.log('URL non reconnue, redirection vers la page d\'accueil');
            window.location.href = '/';
        }
    }
    
    // Exécuter la fonction de redirection
    handleRedirect();
})();
