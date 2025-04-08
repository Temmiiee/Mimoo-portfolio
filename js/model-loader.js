/**
 * Chargeur de modèles 3D optimisé pour Mimoo Portfolio
 * Ce script gère le chargement des modèles 3D sans utiliser de proxy CORS
 */

class ModelLoader {
    constructor() {
        this.modelCache = new Map();
        this.isLoading = false;
    }

    /**
     * Charge un modèle 3D à partir d'une URL
     * @param {string} url - L'URL du modèle 3D
     * @param {string} type - Le type de modèle (obj, gltf, etc.)
     * @param {function} onProgress - Fonction de callback pour la progression
     * @param {function} onSuccess - Fonction de callback en cas de succès
     * @param {function} onError - Fonction de callback en cas d'erreur
     */
    loadModel(url, type, onProgress, onSuccess, onError) {
        // Vérifier si le modèle est déjà en cache
        if (this.modelCache.has(url)) {
            onSuccess(this.modelCache.get(url));
            return;
        }

        this.isLoading = true;

        // Fonction pour gérer les erreurs
        const handleError = (error) => {
            this.isLoading = false;
            if (onError) {
                onError(error);
            }
        };

        // Fonction pour gérer le succès
        const handleSuccess = (model) => {
            this.isLoading = false;
            this.modelCache.set(url, model);
            if (onSuccess) {
                onSuccess(model);
            }
        };

        // Charger le modèle en fonction du type
        if (type === 'obj') {
            this.loadOBJ(url, onProgress, handleSuccess, handleError);
        } else if (type === 'gltf' || type === 'glb') {
            this.loadGLTF(url, onProgress, handleSuccess, handleError);
        } else {
            handleError(new Error(`Type de modèle non pris en charge: ${type}`));
        }
    }

    /**
     * Charge un modèle OBJ
     * @private
     */
    loadOBJ(url, onProgress, onSuccess, onError) {
        // Vérifier si Three.js est chargé
        if (typeof THREE === 'undefined' || typeof THREE.OBJLoader === 'undefined') {
            onError(new Error('Three.js ou OBJLoader n\'est pas chargé'));
            return;
        }

        // Créer un loader OBJ
        const loader = new THREE.OBJLoader();

        // Charger le modèle
        loader.load(
            url,
            (object) => {
                onSuccess(object);
            },
            (xhr) => {
                if (xhr.lengthComputable && onProgress) {
                    const percent = Math.round((xhr.loaded / xhr.total) * 100);
                    onProgress(percent);
                }
            },
            (error) => {
                onError(error);
            }
        );
    }

    /**
     * Charge un modèle GLTF/GLB
     * @private
     */
    loadGLTF(url, onProgress, onSuccess, onError) {
        // Vérifier si Three.js est chargé
        if (typeof THREE === 'undefined' || typeof THREE.GLTFLoader === 'undefined') {
            onError(new Error('Three.js ou GLTFLoader n\'est pas chargé'));
            return;
        }

        // Créer un loader GLTF
        const loader = new THREE.GLTFLoader();

        // Charger le modèle
        loader.load(
            url,
            (gltf) => {
                onSuccess(gltf.scene);
            },
            (xhr) => {
                if (xhr.lengthComputable && onProgress) {
                    const percent = Math.round((xhr.loaded / xhr.total) * 100);
                    onProgress(percent);
                }
            },
            (error) => {
                onError(error);
            }
        );
    }

    /**
     * Vérifie si un modèle est en cours de chargement
     * @returns {boolean} - true si un modèle est en cours de chargement, false sinon
     */
    isModelLoading() {
        return this.isLoading;
    }

    /**
     * Vérifie si un modèle est en cache
     * @param {string} url - L'URL du modèle 3D
     * @returns {boolean} - true si le modèle est en cache, false sinon
     */
    isModelCached(url) {
        return this.modelCache.has(url);
    }

    /**
     * Récupère un modèle du cache
     * @param {string} url - L'URL du modèle 3D
     * @returns {Object|null} - Le modèle 3D ou null s'il n'est pas en cache
     */
    getModelFromCache(url) {
        return this.modelCache.get(url) || null;
    }

    /**
     * Vide le cache des modèles
     */
    clearCache() {
        this.modelCache.clear();
    }
}

// Créer une instance globale du chargeur de modèles
window.modelLoader = new ModelLoader();
