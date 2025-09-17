/**
 * Script de redirection optimisé pour les URLs inexistantes
 * Ce script détecte si l'URL actuelle ne correspond pas à une section valide
 * et redirige vers la page d'accueil si nécessaire
 * Version optimisée qui ne bloque pas le rendu
 */

// Exécuter la redirection après le chargement du contenu principal
document.addEventListener('DOMContentLoaded', function() {
    // Liste des sections valides (IDs) dans votre site one-page
    const validSections = ['accueil', 'apropos', 'galerie', 'contact'];

    // Utiliser la variable globale basePath définie dans index.html
    function getBasePath() {
        // Si la variable globale basePath est définie, l'utiliser
        if (window.basePath) {
            return window.basePath;
        }

        // Sinon, détecter le chemin de base
        const host = window.location.hostname;

        // Si nous sommes sur GitHub Pages (temmiiee.github.io)
        if (host.includes('github.io')) {
            // Hardcoder le chemin pour Mimoo-portfolio
            return '/Mimoo-portfolio/';
        }

        // Par défaut, retourner la racine
        return '/';
    }

    // Fonction exécutée au chargement de la page
    function handleRedirect() {
        // Obtenir le chemin de base et le chemin complet de l'URL actuelle
        const basePath = getBasePath();
        const fullPath = window.location.pathname;

        // Si nous sommes déjà sur la page d'accueil, ne rien faire
        if (fullPath === basePath || fullPath === basePath + 'index.html') {
            return;
        }

        // Vérifier si l'URL correspond à une section valide
        const hash = window.location.hash.replace('#', '');
        if (hash && validSections.includes(hash)) {
            return;
        }

        // Vérifier si l'URL correspond à un fichier existant
        const extension = fullPath.split('.').pop();
        const isFile = ['html', 'css', 'js', 'jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'ico', 'pdf'].includes(extension);

        // Si ce n'est pas un fichier connu et que ce n'est pas une section valide, rediriger vers l'accueil
        if (!isFile) {
            window.location.href = basePath; // Utiliser le chemin de base détecté
        }
    }

    // Exécuter la fonction de redirection avec un léger délai pour ne pas bloquer le rendu
    setTimeout(handleRedirect, 100);
});
