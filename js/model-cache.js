/**
 * Gestionnaire de cache pour les modèles 3D
 */
class ModelCache {
    constructor() {
        this.models = new Map();
        this.materials = new Map();
        this.pendingLoads = new Map();
    }

    /**
     * Vérifie si un modèle est en cache
     */
    hasModel(url) {
        return this.models.has(url);
    }

    /**
     * Récupère un modèle du cache
     */
    getModel(url) {
        if (!this.hasModel(url)) return null;
        const original = this.models.get(url);
        return original.clone();
    }

    /**
     * Ajoute un modèle au cache
     */
    addModel(url, model) {
        if (!url || !model) return;
        this.models.set(url, model);
    }

    /**
     * Vérifie si un matériau est en cache
     */
    hasMaterial(url) {
        return this.materials.has(url);
    }

    /**
     * Récupère un matériau du cache
     */
    getMaterial(url) {
        if (!this.hasMaterial(url)) return null;
        return this.materials.get(url);
    }

    /**
     * Ajoute un matériau au cache
     */
    addMaterial(url, material) {
        if (!url || !material) return;
        this.materials.set(url, material);
    }

    /**
     * Précharge un modèle 3D
     */
    preloadModel(modelUrl, materialUrl = null) {
        if (this.hasModel(modelUrl)) {
            return Promise.resolve(this.getModel(modelUrl));
        }

        if (this.pendingLoads.has(modelUrl)) {
            return this.pendingLoads.get(modelUrl);
        }

        const loadPromise = new Promise((resolve, reject) => {
            const objLoader = new THREE.OBJLoader();

            if (materialUrl) {
                if (this.hasMaterial(materialUrl)) {
                    const materials = this.getMaterial(materialUrl);
                    objLoader.setMaterials(materials);

                    objLoader.load(
                        modelUrl,
                        (object) => {
                            this.addModel(modelUrl, object);
                            resolve(object.clone());
                            this.pendingLoads.delete(modelUrl);
                        },
                        null,
                        (error) => {
                            console.error('Erreur lors du chargement du modèle:', error);
                            reject(error);
                            this.pendingLoads.delete(modelUrl);
                        }
                    );
                } else {
                    const mtlLoader = new THREE.MTLLoader();
                    mtlLoader.load(
                        materialUrl,
                        (materials) => {
                            materials.preload();
                            this.addMaterial(materialUrl, materials);

                            objLoader.setMaterials(materials);
                            objLoader.load(
                                modelUrl,
                                (object) => {
                                    this.addModel(modelUrl, object);
                                    resolve(object.clone());
                                    this.pendingLoads.delete(modelUrl);
                                },
                                null,
                                (error) => {
                                    console.error('Erreur lors du chargement du modèle:', error);
                                    reject(error);
                                    this.pendingLoads.delete(modelUrl);
                                }
                            );
                        },
                        null,
                        (error) => {
                            console.error('Erreur lors du chargement du matériau:', error);
                            reject(error);
                            this.pendingLoads.delete(modelUrl);
                        }
                    );
                }
            } else {
                objLoader.load(
                    modelUrl,
                    (object) => {
                        this.addModel(modelUrl, object);
                        resolve(object.clone());
                        this.pendingLoads.delete(modelUrl);
                    },
                    null,
                    (error) => {
                        console.error('Erreur lors du chargement du modèle:', error);
                        reject(error);
                        this.pendingLoads.delete(modelUrl);
                    }
                );
            }
        });

        this.pendingLoads.set(modelUrl, loadPromise);
        return loadPromise;
    }

    /**
     * Vide le cache
     */
    clear() {
        this.models.clear();
        this.materials.clear();
        this.pendingLoads.clear();
    }
}

// Créer une instance globale du cache
const modelCache = new ModelCache();
