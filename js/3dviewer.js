/**
 * Visionneuse 3D simplifiée pour Mimoo Portfolio
 * Version optimisée et simplifiée pour éviter les problèmes de chargement
 */

class Simple3DViewer {
    constructor(container, options = {}) {
        // Conteneur pour la visionneuse 3D
        this.container = container;
        
        // Options par défaut
        this.settings = {
            backgroundColor: 0xf0f0f0,
            wireframe: false,
            autoRotate: true,
            shadows: true,
            ...options
        };
        
        // Initialiser la scène Three.js
        this.initScene();
        
        // Ajouter les contrôles
        this.addControls();
        
        // Démarrer la boucle de rendu
        this.animate();
    }
    
    /**
     * Initialise la scène Three.js
     */
    initScene() {
        // Créer la scène
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.settings.backgroundColor);
        
        // Créer la caméra
        this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.camera.position.set(0, 0, 5);
        
        // Créer le renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // Activer les ombres
        if (this.settings.shadows) {
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }
        
        // Ajouter le renderer au conteneur
        this.container.appendChild(this.renderer.domElement);
        
        // Ajouter les lumières
        this.addLights();
        
        // Ajouter un cube par défaut
        this.addDefaultCube();
        
        // Gérer le redimensionnement de la fenêtre
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }
    
    /**
     * Ajoute les lumières à la scène
     */
    addLights() {
        // Lumière ambiante
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        // Lumière directionnelle
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        directionalLight.castShadow = this.settings.shadows;
        this.scene.add(directionalLight);
        
        // Configurer les ombres
        if (this.settings.shadows) {
            directionalLight.shadow.mapSize.width = 1024;
            directionalLight.shadow.mapSize.height = 1024;
            directionalLight.shadow.camera.near = 0.1;
            directionalLight.shadow.camera.far = 10;
            directionalLight.shadow.camera.left = -5;
            directionalLight.shadow.camera.right = 5;
            directionalLight.shadow.camera.top = 5;
            directionalLight.shadow.camera.bottom = -5;
        }
    }
    
    /**
     * Ajoute un cube par défaut à la scène
     */
    addDefaultCube() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({
            color: 0x557153,
            metalness: 0.3,
            roughness: 0.7,
            wireframe: this.settings.wireframe
        });
        
        this.cube = new THREE.Mesh(geometry, material);
        this.cube.castShadow = this.settings.shadows;
        this.cube.receiveShadow = this.settings.shadows;
        
        this.scene.add(this.cube);
        
        // Animation du cube
        this.onRender = () => {
            this.cube.rotation.x += 0.01;
            this.cube.rotation.y += 0.01;
        };
    }
    
    /**
     * Ajoute les contrôles OrbitControls
     */
    addControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 1;
        this.controls.maxDistance = 10;
        this.controls.maxPolarAngle = Math.PI;
        this.controls.autoRotate = this.settings.autoRotate;
        this.controls.autoRotateSpeed = 1.0;
    }
    
    /**
     * Gère le redimensionnement de la fenêtre
     */
    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
    
    /**
     * Boucle d'animation
     */
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        // Mettre à jour les contrôles
        this.controls.update();
        
        // Exécuter la fonction de rendu personnalisée
        if (this.onRender) {
            this.onRender();
        }
        
        // Rendre la scène
        this.renderer.render(this.scene, this.camera);
    }
    
    /**
     * Charge un modèle 3D
     * @param {string} modelUrl - L'URL du modèle 3D
     * @param {Object} options - Options de chargement
     */
    loadModel(modelUrl, options = {}) {
        // Options par défaut
        const settings = {
            scale: 1.0,
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            ...options
        };
        
        // Créer un élément de chargement
        const loadingElement = document.createElement('div');
        loadingElement.className = 'loading';
        loadingElement.innerHTML = '<div class="spinner"></div><span>Chargement du modèle...</span>';
        this.container.appendChild(loadingElement);
        
        // Déterminer le type de modèle
        const isGLTF = modelUrl.endsWith('.gltf') || modelUrl.endsWith('.glb');
        
        // Fonction pour gérer le modèle chargé
        const onModelLoaded = (object) => {
            // Supprimer le cube par défaut
            if (this.cube) {
                this.scene.remove(this.cube);
                this.cube = null;
            }
            
            // Supprimer l'animation du cube
            this.onRender = null;
            
            // Appliquer l'échelle
            object.scale.set(settings.scale, settings.scale, settings.scale);
            
            // Appliquer la position
            object.position.set(settings.position.x, settings.position.y, settings.position.z);
            
            // Appliquer la rotation
            object.rotation.set(settings.rotation.x, settings.rotation.y, settings.rotation.z);
            
            // Centrer le modèle
            this.centerModel(object);
            
            // Ajouter le modèle à la scène
            this.scene.add(object);
            
            // Supprimer l'élément de chargement
            this.container.removeChild(loadingElement);
        };
        
        // Fonction pour gérer les erreurs
        const onError = (error) => {
            loadingElement.innerHTML = '<span class="error">Erreur de chargement</span>';
            setTimeout(() => {
                this.container.removeChild(loadingElement);
            }, 3000);
        };
        
        // Fonction pour afficher la progression
        const onProgress = (xhr) => {
            if (xhr.lengthComputable) {
                const percent = Math.round((xhr.loaded / xhr.total) * 100);
                loadingElement.querySelector('span').textContent = `Chargement: ${percent}%`;
            }
        };
        
        try {
            // Charger le modèle en fonction de son type
            if (isGLTF) {
                // Charger un modèle GLTF
                const loader = new THREE.GLTFLoader();
                loader.load(
                    modelUrl,
                    (gltf) => onModelLoaded(gltf.scene),
                    onProgress,
                    onError
                );
            } else {
                // Charger un modèle OBJ
                const loader = new THREE.OBJLoader();
                loader.load(
                    modelUrl,
                    onModelLoaded,
                    onProgress,
                    onError
                );
            }
        } catch (error) {
            onError(error);
        }
    }
    
    /**
     * Centre un modèle dans la scène
     * @param {Object} model - Le modèle à centrer
     */
    centerModel(model) {
        // Calculer la boîte englobante
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Calculer l'échelle pour que le modèle tienne dans la vue
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim;
        
        // Appliquer l'échelle
        model.scale.multiplyScalar(scale);
        
        // Recentrer le modèle
        model.position.sub(center.multiplyScalar(scale));
    }
    
    /**
     * Définit la couleur d'arrière-plan
     * @param {number} color - La couleur en hexadécimal
     */
    setBackgroundColor(color) {
        this.scene.background = new THREE.Color(color);
    }
    
    /**
     * Active ou désactive le mode filaire
     * @param {boolean} enabled - true pour activer, false pour désactiver
     */
    setWireframe(enabled) {
        this.settings.wireframe = enabled;
        
        // Appliquer à tous les objets de la scène
        this.scene.traverse((object) => {
            if (object.isMesh && object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => {
                        material.wireframe = enabled;
                    });
                } else {
                    object.material.wireframe = enabled;
                }
            }
        });
    }
    
    /**
     * Active ou désactive la rotation automatique
     * @param {boolean} enabled - true pour activer, false pour désactiver
     */
    setAutoRotate(enabled) {
        this.settings.autoRotate = enabled;
        this.controls.autoRotate = enabled;
    }
}

// Fonction pour initialiser les visionneuses 3D sur la page
function initSimple3DViewers() {
    // Trouver tous les conteneurs de visionneuse 3D
    const containers = document.querySelectorAll('.model-viewer');
    
    // Créer une visionneuse 3D pour chaque conteneur
    containers.forEach((container) => {
        // Récupérer les options
        const backgroundColor = container.getAttribute('data-background-color') || '#f0f0f0';
        const wireframe = container.getAttribute('data-wireframe') === 'true';
        const autoRotate = container.getAttribute('data-auto-rotate') !== 'false';
        const shadows = container.getAttribute('data-shadows') !== 'false';
        
        // Créer la visionneuse
        const viewer = new Simple3DViewer(container, {
            backgroundColor: parseInt(backgroundColor.replace('#', '0x'), 16),
            wireframe,
            autoRotate,
            shadows
        });
        
        // Récupérer l'URL du modèle
        const modelUrl = container.getAttribute('data-model-url');
        
        // Charger le modèle si une URL est spécifiée
        if (modelUrl) {
            // Récupérer les options du modèle
            const scale = parseFloat(container.getAttribute('data-model-scale') || '1.0');
            const posX = parseFloat(container.getAttribute('data-model-position-x') || '0');
            const posY = parseFloat(container.getAttribute('data-model-position-y') || '0');
            const posZ = parseFloat(container.getAttribute('data-model-position-z') || '0');
            const rotX = parseFloat(container.getAttribute('data-model-rotation-x') || '0');
            const rotY = parseFloat(container.getAttribute('data-model-rotation-y') || '0');
            const rotZ = parseFloat(container.getAttribute('data-model-rotation-z') || '0');
            
            // Charger le modèle
            viewer.loadModel(modelUrl, {
                scale,
                position: { x: posX, y: posY, z: posZ },
                rotation: { x: rotX, y: rotY, z: rotZ }
            });
        }
        
        // Stocker la visionneuse dans le conteneur
        container.viewer = viewer;
    });
}

// Initialiser les visionneuses 3D lorsque la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier si Three.js est chargé
    if (typeof THREE === 'undefined') {
        // Charger Three.js
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js';
        script.onload = () => {
            // Charger les loaders
            const loaders = [
                'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.min.js',
                'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/OBJLoader.min.js',
                'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.min.js'
            ];
            
            // Charger les loaders en série
            let loadedCount = 0;
            const loadNextLoader = () => {
                if (loadedCount < loaders.length) {
                    const script = document.createElement('script');
                    script.src = loaders[loadedCount];
                    script.onload = () => {
                        loadedCount++;
                        loadNextLoader();
                    };
                    document.head.appendChild(script);
                } else {
                    // Tous les loaders sont chargés, initialiser les visionneuses
                    initSimple3DViewers();
                }
            };
            
            loadNextLoader();
        };
        document.head.appendChild(script);
    } else {
        // Three.js est déjà chargé, initialiser les visionneuses
        initSimple3DViewers();
    }
});
