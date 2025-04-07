/**
 * Three.js Minimal Bundle pour Mimoo Portfolio
 * Version optimisée qui ne charge que les composants nécessaires
 */

// Fonction pour charger les scripts de manière conditionnelle
(function() {
    // Indicateur pour suivre si Three.js est chargé
    window.threeJsLoaded = false;
    
    // Fonction pour charger un script
    function loadScript(url, callback) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.async = true;
        script.onload = callback;
        document.head.appendChild(script);
    }
    
    // Fonction pour charger Three.js et ses composants
    window.loadThreeJs = function() {
        // Si Three.js est déjà chargé, ne rien faire
        if (window.threeJsLoaded) {
            return Promise.resolve();
        }
        
        return new Promise((resolve) => {
            // Charger uniquement Three.js core
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', function() {
                // Une fois Three.js chargé, charger les loaders nécessaires
                // en fonction du type de modèle à afficher
                const modelElements = document.querySelectorAll('[data-type="3d"]');
                const hasGLTF = Array.from(modelElements).some(el => {
                    const modelPath = el.getAttribute('data-model-path') || el.getAttribute('data-model-url');
                    return modelPath && (modelPath.endsWith('.glb') || modelPath.endsWith('.gltf'));
                });
                
                const hasOBJ = Array.from(modelElements).some(el => {
                    const modelPath = el.getAttribute('data-model-path') || el.getAttribute('data-model-url');
                    return modelPath && modelPath.endsWith('.obj');
                });
                
                // Charger les loaders nécessaires en parallèle
                const loadersToLoad = [];
                
                // OrbitControls est toujours nécessaire
                loadersToLoad.push(new Promise(resolve => {
                    loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.min.js', resolve);
                }));
                
                // Charger OBJLoader si nécessaire
                if (hasOBJ) {
                    loadersToLoad.push(new Promise(resolve => {
                        loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/OBJLoader.min.js', resolve);
                    }));
                    
                    // MTLLoader est souvent utilisé avec OBJLoader
                    loadersToLoad.push(new Promise(resolve => {
                        loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/MTLLoader.min.js', resolve);
                    }));
                }
                
                // Charger GLTFLoader si nécessaire
                if (hasGLTF) {
                    loadersToLoad.push(new Promise(resolve => {
                        loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.min.js', resolve);
                    }));
                    
                    // DRACOLoader est souvent utilisé avec GLTFLoader pour la compression
                    loadersToLoad.push(new Promise(resolve => {
                        loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/DRACOLoader.min.js', resolve);
                    }));
                }
                
                // Attendre que tous les loaders soient chargés
                Promise.all(loadersToLoad).then(() => {
                    window.threeJsLoaded = true;
                    
                    // Déclencher un événement pour indiquer que Three.js est chargé
                    const event = new CustomEvent('threeJsLoaded');
                    document.dispatchEvent(event);
                    
                    resolve();
                });
            });
        });
    };
    
    // Fonction pour attendre que Three.js soit chargé
    window.waitForThreeJs = function() {
        return new Promise((resolve) => {
            if (window.threeJsLoaded) {
                resolve();
            } else {
                document.addEventListener('threeJsLoaded', resolve);
            }
        });
    };
    
    // Ajouter des écouteurs d'événements pour charger Three.js uniquement lorsque nécessaire
    document.addEventListener('DOMContentLoaded', function() {
        // Trouver tous les éléments 3D
        const modelElements = document.querySelectorAll('[data-type="3d"]');
        
        if (modelElements.length > 0) {
            // Ajouter un écouteur d'événements à chaque élément 3D
            modelElements.forEach(element => {
                element.addEventListener('click', function() {
                    // Charger Three.js uniquement lorsque l'utilisateur clique sur un modèle 3D
                    window.loadThreeJs();
                });
            });
            
            // Ajouter un écouteur d'événements pour l'intersection observer
            const observer = new IntersectionObserver((entries) => {
                // Si un élément 3D est visible et que l'utilisateur fait défiler la page
                // précharger Three.js pour améliorer la réactivité
                if (entries.some(entry => entry.isIntersecting)) {
                    // Précharger Three.js après un délai
                    setTimeout(() => {
                        window.loadThreeJs();
                    }, 2000); // Délai de 2 secondes
                    
                    // Arrêter d'observer une fois préchargé
                    observer.disconnect();
                }
            }, {
                rootMargin: '200px' // Commencer à précharger lorsque les éléments sont à 200px de la fenêtre d'affichage
            });
            
            // Observer tous les éléments 3D
            modelElements.forEach(element => {
                observer.observe(element);
            });
        }
    });
})();
