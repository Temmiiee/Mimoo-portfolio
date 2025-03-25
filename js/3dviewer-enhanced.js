/**
 * Visualisateur 3D amélioré pour le portfolio
 * Fonctionnalités :
 * - Chargement de modèles OBJ
 * - Contrôles de caméra avancés
 * - Options d'éclairage
 * - Interface utilisateur personnalisable
 * - Animations et effets
 */
class EnhancedModelViewer {
    constructor(container) {
        // Éléments DOM
        this.container = container;
        this.uiContainer = null;

        // Propriétés Three.js
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.model = null;
        this.grid = null;
        this.axes = null;
        this.lights = {};
        this.envMap = null;

        // État
        this.isInitialized = false;
        this.animationFrameId = null;
        this.onRender = null;
        this.settings = {
            autoRotate: false,
            showGrid: true,
            showAxes: true,
            backgroundColor: 0x333333, // Fond gris foncé pour mieux voir les modèles
            wireframe: false,
            cameraPosition: { x: 3, y: 5, z: 5 }, // Caméra plus haute pour voir le modèle d'en haut
            lightIntensity: 1.0,
            ambientIntensity: 0.5,
            rotationSpeed: 0.0 // Désactivé par défaut
        };

        // Bind des méthodes
        this.animate = this.animate.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
    }

    /**
     * Initialise la scène Three.js et les contrôles
     */
    init() {
        if (this.isInitialized) return;

        // Créer la scène
        this.scene = new THREE.Scene();
        this.updateBackgroundColor();

        // Configurer la caméra
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        this.camera.position.set(
            this.settings.cameraPosition.x,
            this.settings.cameraPosition.y,
            this.settings.cameraPosition.z
        );

        // Configurer le renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        this.container.appendChild(this.renderer.domElement);

        // Ajouter les contrôles OrbitControls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 1;
        this.controls.maxDistance = 20;
        this.controls.maxPolarAngle = Math.PI / 1.5;
        this.controls.autoRotate = this.settings.autoRotate;
        this.controls.autoRotateSpeed = 2.0;

        // Ajouter l'éclairage
        this.setupLights();

        // Ajouter la grille et les axes
        this.setupHelpers();

        // Créer l'interface utilisateur
        this.createUI();

        // Gérer le redimensionnement de la fenêtre
        window.addEventListener('resize', this.onWindowResize);

        this.isInitialized = true;
        this.animate();
    }

    /**
     * Configure l'éclairage de la scène
     */
    setupLights() {
        // Lumière ambiante
        this.lights.ambient = new THREE.AmbientLight(0xffffff, this.settings.ambientIntensity);
        this.scene.add(this.lights.ambient);

        // Lumière principale (directionnelle)
        this.lights.main = new THREE.DirectionalLight(0xffffff, this.settings.lightIntensity);
        this.lights.main.position.set(5, 10, 7);
        this.lights.main.castShadow = true;
        this.lights.main.shadow.mapSize.width = 1024;
        this.lights.main.shadow.mapSize.height = 1024;
        this.lights.main.shadow.camera.near = 0.5;
        this.lights.main.shadow.camera.far = 50;
        this.lights.main.shadow.camera.left = -10;
        this.lights.main.shadow.camera.right = 10;
        this.lights.main.shadow.camera.top = 10;
        this.lights.main.shadow.camera.bottom = -10;
        this.scene.add(this.lights.main);

        // Lumière d'appoint (directionnelle)
        this.lights.fill = new THREE.DirectionalLight(0xffffff, this.settings.lightIntensity * 0.5);
        this.lights.fill.position.set(-5, 5, -5);
        this.scene.add(this.lights.fill);

        // Lumière de contre-jour
        this.lights.back = new THREE.DirectionalLight(0xffffff, this.settings.lightIntensity * 0.2);
        this.lights.back.position.set(0, -5, -10);
        this.scene.add(this.lights.back);
    }

    /**
     * Configure les aides visuelles (grille, axes)
     */
    setupHelpers() {
        // Grille - positionnée en dessous du modèle (y = -1)
        this.grid = new THREE.GridHelper(20, 20, 0xaaaaaa, 0x666666);
        this.grid.position.y = -1; // Positionner la grille en dessous du modèle
        this.grid.material.opacity = 0.6;
        this.grid.material.transparent = true;
        this.grid.visible = this.settings.showGrid;
        this.scene.add(this.grid);

        // Axes - positionnés au niveau de la grille
        this.axes = new THREE.AxesHelper(5);
        this.axes.position.y = -1; // Aligner avec la grille
        this.axes.visible = this.settings.showAxes;
        this.scene.add(this.axes);
    }

    /**
     * Crée l'interface utilisateur pour contrôler la visionneuse
     */
    createUI() {
        // Créer le conteneur UI
        this.uiContainer = document.createElement('div');
        this.uiContainer.className = 'model-viewer-ui';
        this.container.appendChild(this.uiContainer);

        // Bouton de rotation automatique
        const rotateBtn = this.createButton('Rotation Auto', () => {
            this.settings.autoRotate = !this.settings.autoRotate;
            // Ne pas utiliser this.controls.autoRotate qui fait tourner la caméra
            rotateBtn.classList.toggle('active', this.settings.autoRotate);
        });
        rotateBtn.classList.toggle('active', this.settings.autoRotate);

        // Bouton pour afficher/masquer la grille
        const gridBtn = this.createButton('Grille', () => {
            this.settings.showGrid = !this.settings.showGrid;
            this.grid.visible = this.settings.showGrid;
            gridBtn.classList.toggle('active', this.settings.showGrid);
        });
        gridBtn.classList.toggle('active', this.settings.showGrid);

        // Bouton pour afficher/masquer les axes
        const axesBtn = this.createButton('Axes', () => {
            this.settings.showAxes = !this.settings.showAxes;
            this.axes.visible = this.settings.showAxes;
            axesBtn.classList.toggle('active', this.settings.showAxes);
        });
        axesBtn.classList.toggle('active', this.settings.showAxes);

        // Bouton pour le mode filaire
        const wireframeBtn = this.createButton('Filaire', () => {
            this.settings.wireframe = !this.settings.wireframe;
            this.toggleWireframe(this.settings.wireframe);
            wireframeBtn.classList.toggle('active', this.settings.wireframe);
        });

        // Bouton pour réinitialiser la vue
        this.createButton('Réinitialiser', () => {
            this.resetCamera();
        });

        // Bouton pour capturer une image
        this.createButton('Capture', () => {
            this.captureImage();
        });

        // Bouton pour changer la couleur de fond
        const bgColorBtn = this.createButton('Fond', () => {
            // Alterner entre différentes couleurs de fond
            if (this.settings.backgroundColor === 0x333333) {
                this.settings.backgroundColor = 0xf8f9fa; // Blanc
            } else if (this.settings.backgroundColor === 0xf8f9fa) {
                this.settings.backgroundColor = 0x557153; // Vert
            } else {
                this.settings.backgroundColor = 0x333333; // Gris foncé
            }
            this.updateBackgroundColor();
        });
    }

    /**
     * Crée un bouton pour l'interface utilisateur
     */
    createButton(text, onClick) {
        const button = document.createElement('button');
        button.className = 'model-viewer-btn';
        button.textContent = text;
        button.addEventListener('click', onClick);
        this.uiContainer.appendChild(button);
        return button;
    }

    /**
     * Réinitialise la position de la caméra
     */
    resetCamera() {
        this.camera.position.set(
            this.settings.cameraPosition.x,
            this.settings.cameraPosition.y,
            this.settings.cameraPosition.z
        );
        this.camera.lookAt(0, 0, 0);
        this.controls.reset();
    }

    /**
     * Capture l'image actuelle du modèle
     */
    captureImage() {
        const link = document.createElement('a');
        link.download = 'model-capture.png';
        this.renderer.render(this.scene, this.camera);
        link.href = this.renderer.domElement.toDataURL('image/png');
        link.click();
    }

    /**
     * Active/désactive le mode filaire pour tous les matériaux
     */
    toggleWireframe(enabled) {
        if (!this.model) return;

        this.model.traverse((child) => {
            if (child.isMesh && child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(mat => {
                        mat.wireframe = enabled;
                    });
                } else {
                    child.material.wireframe = enabled;
                }
            }
        });
    }

    /**
     * Met à jour la couleur d'arrière-plan
     */
    updateBackgroundColor() {
        if (this.scene) {
            this.scene.background = new THREE.Color(this.settings.backgroundColor);
        }
    }

    /**
     * Charge un modèle OBJ
     */
    loadModel(modelPath, materialPath = null) {
        // Si un modèle est déjà chargé, le supprimer
        if (this.model) {
            this.scene.remove(this.model);
            this.model = null;
        }

        // Afficher un message de chargement
        const loadingElement = document.createElement('div');
        loadingElement.className = 'loading-model';
        loadingElement.innerHTML = '<div class="spinner"></div><span>Chargement du modèle...</span>';
        this.container.appendChild(loadingElement);

        // Créer un cube par défaut pour tester le rendu
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({
            color: 0xA9AF7E, // Couleur plus claire pour mieux voir sur fond sombre
            metalness: 0.5,
            roughness: 0.3,
            emissive: 0x222222, // Légère émission de lumière
            emissiveIntensity: 0.2
        });
        const cube = new THREE.Mesh(geometry, material);
        cube.castShadow = true;
        cube.receiveShadow = true;
        cube.position.y = 0.5; // Positionner le cube au-dessus de la grille
        this.scene.add(cube);

        // Animation du cube
        const animateCube = () => {
            if (cube && this.scene.children.includes(cube)) {
                cube.rotation.x += 0.01;
                cube.rotation.y += 0.01;
            }
        };

        // Ajouter l'animation à la boucle de rendu
        this.onRender = animateCube;

        try {
            // Fonction pour charger le modèle OBJ
            const loadOBJ = () => {
                const loader = new THREE.OBJLoader();

                loader.load(
                    modelPath,
                    (object) => {
                        // Succès du chargement
                        this.model = object;

                        // Supprimer le cube de test
                        if (cube) {
                            this.scene.remove(cube);
                            this.onRender = null;
                        }

                        // Appliquer des matériaux et des ombres
                        object.traverse((child) => {
                            if (child.isMesh) {
                                // Appliquer un matériau standard si aucun n'est défini
                                if (!child.material) {
                                    child.material = new THREE.MeshStandardMaterial({
                                        color: 0xcccccc,
                                        metalness: 0.3,
                                        roughness: 0.7
                                    });
                                }

                                // Activer les ombres
                                child.castShadow = true;
                                child.receiveShadow = true;

                                // Appliquer le mode filaire si activé
                                if (this.settings.wireframe) {
                                    if (Array.isArray(child.material)) {
                                        child.material.forEach(mat => {
                                            mat.wireframe = true;
                                        });
                                    } else {
                                        child.material.wireframe = true;
                                    }
                                }
                            }
                        });

                        // Centrer et dimensionner le modèle
                        this.centerAndScaleModel(object);

                        // Ajouter le modèle à la scène
                        this.scene.add(object);

                        // Supprimer le message de chargement
                        if (this.container.contains(loadingElement)) {
                            this.container.removeChild(loadingElement);
                        }

                        // Forcer un redimensionnement
                        this.onWindowResize();
                    },
                    (xhr) => {
                        // Progression du chargement
                        if (xhr.lengthComputable) {
                            const percent = Math.round((xhr.loaded / xhr.total) * 100);
                            loadingElement.querySelector('span').textContent = `Chargement: ${percent}%`;
                        }
                    },
                    (error) => {
                        console.error('Erreur lors du chargement du modèle:', error);
                        loadingElement.innerHTML = '<span class="error">Erreur de chargement - Affichage du cube par défaut</span>';
                        setTimeout(() => {
                            if (this.container.contains(loadingElement)) {
                                this.container.removeChild(loadingElement);
                            }
                        }, 2000);
                    }
                );
            };

            // Charger le matériau si spécifié, sinon charger directement le modèle
            if (materialPath) {
                const mtlLoader = new THREE.MTLLoader();
                mtlLoader.load(
                    materialPath,
                    (materials) => {
                        materials.preload();
                        const objLoader = new THREE.OBJLoader();
                        objLoader.setMaterials(materials);
                        objLoader.load(
                            modelPath,
                            (object) => {
                                // Succès du chargement
                                this.model = object;

                                // Supprimer le cube de test
                                if (cube) {
                                    this.scene.remove(cube);
                                    this.onRender = null;
                                }

                                // Appliquer des ombres
                                object.traverse((child) => {
                                    if (child.isMesh) {
                                        child.castShadow = true;
                                        child.receiveShadow = true;

                                        // Appliquer le mode filaire si activé
                                        if (this.settings.wireframe) {
                                            if (Array.isArray(child.material)) {
                                                child.material.forEach(mat => {
                                                    mat.wireframe = true;
                                                });
                                            } else {
                                                child.material.wireframe = true;
                                            }
                                        }
                                    }
                                });

                                // Centrer et dimensionner le modèle
                                this.centerAndScaleModel(object);

                                // Ajouter le modèle à la scène
                                this.scene.add(object);

                                // Supprimer le message de chargement
                                if (this.container.contains(loadingElement)) {
                                    this.container.removeChild(loadingElement);
                                }

                                // Forcer un redimensionnement
                                this.onWindowResize();
                            },
                            (xhr) => {
                                // Progression du chargement
                                if (xhr.lengthComputable) {
                                    const percent = Math.round((xhr.loaded / xhr.total) * 100);
                                    loadingElement.querySelector('span').textContent = `Chargement: ${percent}%`;
                                }
                            },
                            (error) => {
                                console.error('Erreur lors du chargement du modèle avec matériaux:', error);
                                // Essayer de charger sans matériaux
                                loadOBJ();
                            }
                        );
                    },
                    undefined,
                    (error) => {
                        console.error('Erreur lors du chargement des matériaux:', error);
                        // Essayer de charger sans matériaux
                        loadOBJ();
                    }
                );
            } else {
                // Charger directement le modèle OBJ sans matériaux
                loadOBJ();
            }
        } catch (error) {
            console.error('Erreur lors de l\'initialisation du chargeur:', error);
            loadingElement.innerHTML = '<span class="error">Erreur - Affichage du cube par défaut</span>';
            setTimeout(() => {
                if (this.container.contains(loadingElement)) {
                    this.container.removeChild(loadingElement);
                }
            }, 2000);
        }
    }

    /**
     * Centre et redimensionne le modèle pour qu'il s'adapte à la vue
     */
    centerAndScaleModel(object) {
        // Calculer la boîte englobante
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Calculer l'échelle pour que le modèle s'adapte bien à la vue
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 4 / maxDim; // Légèrement plus petit pour mieux voir

        // Centrer le modèle horizontalement mais le placer au-dessus de la grille
        object.position.x = -center.x * scale;
        object.position.y = -center.y * scale + 0.5; // Soulever le modèle au-dessus de la grille
        object.position.z = -center.z * scale;

        // Appliquer l'échelle
        object.scale.set(scale, scale, scale);

        // Positionner la caméra pour bien voir le modèle
        const distance = maxDim * 1.5;
        this.camera.position.set(distance, distance * 0.8, distance);
        this.camera.lookAt(0, 0, 0);
        this.controls.update();
    }

    /**
     * Gère le redimensionnement de la fenêtre
     */
    onWindowResize() {
        if (!this.isInitialized) return;

        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        if (this.camera) {
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        }

        if (this.renderer) {
            this.renderer.setSize(width, height);
        }
    }

    /**
     * Boucle d'animation
     */
    animate() {
        if (!this.isInitialized) return;

        this.animationFrameId = requestAnimationFrame(this.animate);

        // Mettre à jour les contrôles
        if (this.controls) {
            this.controls.update();
        }

        // Exécuter la fonction de rendu personnalisée si elle existe
        if (this.onRender) {
            this.onRender();
        }

        // Faire tourner le modèle si l'autorotation est activée
        if (this.settings.autoRotate && this.model) {
            // Vitesse de rotation fixe pour l'autorotation
            this.model.rotation.y += 0.01;
        }

        // Rendre la scène
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    /**
     * Arrête l'animation et nettoie les ressources
     */
    dispose() {
        // Arrêter la boucle d'animation
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        // Supprimer les écouteurs d'événements
        window.removeEventListener('resize', this.onWindowResize);

        // Nettoyer l'interface utilisateur
        if (this.uiContainer && this.container.contains(this.uiContainer)) {
            this.container.removeChild(this.uiContainer);
        }

        // Nettoyer le renderer
        if (this.renderer) {
            this.renderer.dispose();
            if (this.container.contains(this.renderer.domElement)) {
                this.container.removeChild(this.renderer.domElement);
            }
        }

        // Nettoyer la scène
        if (this.scene) {
            this.scene.clear();
        }

        this.isInitialized = false;
    }
}
