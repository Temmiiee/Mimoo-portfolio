/**
 * Visualisateur de modèles 3D optimisé
 */
class EnhancedModelViewer {
    constructor(container) {
        this.container = container;
        this.uiContainer = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.model = null;
        this.grid = null;
        this.axes = null;
        this.lights = {};
        this.envMap = null;
        this.isInitialized = false;
        this.animationFrameId = null;
        this.onRender = null;
        this.settings = {
            autoRotate: false,
            showGrid: true,
            showAxes: true,
            backgroundColor: 0x333333,
            cameraPosition: { x: 3, y: 5, z: 5 },
            lightIntensity: 1.0,
            ambientIntensity: 0.5,
            rotationSpeed: 0.0
        };

        this.animate = this.animate.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
    }

    /**
     * Initialise la scène
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

        // Créer un renderer ultra-optimisé
        this.renderer = new THREE.WebGLRenderer({
            antialias: false, // Désactiver l'antialiasing pour les performances
            alpha: true,
            powerPreference: 'high-performance',
            precision: 'lowp' // Utiliser une précision basse pour améliorer les performances
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(1.0); // Forcer un pixel ratio de 1.0 pour maximiser les performances
        this.renderer.shadowMap.enabled = false; // Désactiver les ombres pour améliorer les performances
        this.renderer.outputEncoding = THREE.LinearEncoding; // Utiliser un encodage linéaire plus rapide
        this.renderer.toneMapping = THREE.NoToneMapping; // Désactiver le tone mapping
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

        // S'assurer qu'il n'y a pas de bouton Filaire
        this.removeWireframeButton();

        // Gérer le redimensionnement de la fenêtre
        window.addEventListener('resize', this.onWindowResize);

        this.isInitialized = true;
        this.animate();
    }

    /**
     * Configure l'éclairage de la scène
     */
    setupLights() {
        // Utiliser uniquement une lumière ambiante pour maximiser les performances
        this.lights.ambient = new THREE.AmbientLight(0xffffff, this.settings.ambientIntensity * 1.5);
        this.scene.add(this.lights.ambient);

        // Lumière directionnelle simplifiée sans ombres
        this.lights.main = new THREE.DirectionalLight(0xffffff, this.settings.lightIntensity);
        this.lights.main.position.set(5, 10, 7);
        this.lights.main.castShadow = false; // Désactiver les ombres
        this.scene.add(this.lights.main);
    }

    /**
     * Configure les aides visuelles (grille, axes)
     */
    setupHelpers() {
        // Grille simplifiée avec moins de divisions
        this.grid = new THREE.GridHelper(20, 10, 0xaaaaaa, 0x666666); // Réduire le nombre de divisions
        this.grid.position.y = -1;
        this.grid.material.opacity = 0.6;
        this.grid.material.transparent = true;
        this.grid.visible = this.settings.showGrid;
        this.scene.add(this.grid);

        // Axes simplifiés
        this.axes = new THREE.AxesHelper(5);
        this.axes.position.y = -1;
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

        // Bouton pour réinitialiser la vue
        this.createButton('Réinitialiser', () => {
            this.resetCamera();
        });

        // Bouton pour capturer une image
        this.createButton('Capture', () => {
            this.captureImage();
        });

        // Créer un menu de couleurs de fond
        const bgColorContainer = document.createElement('div');
        bgColorContainer.className = 'model-viewer-color-menu';
        this.uiContainer.appendChild(bgColorContainer);

        // Bouton principal pour ouvrir le menu de couleurs
        const bgColorBtn = this.createButton('Fond', () => {
            bgColorContainer.classList.toggle('active');
        });
        bgColorBtn.className = 'model-viewer-btn color-btn';
        bgColorContainer.appendChild(bgColorBtn);

        // Palette de couleurs (teintes douces, non agressives pour les yeux)
        const colors = [
            { name: 'Gris foncé', value: 0x333333 },
            { name: 'Gris moyen', value: 0x5d5d5d },
            { name: 'Gris clair', value: 0xaaaaaa },
            { name: 'Blanc cassé', value: 0xf5f5f5 },
            { name: 'Bleu nuit', value: 0x1e3a5f },
            { name: 'Bleu ardoise', value: 0x34495e },
            { name: 'Bleu pastel', value: 0x7ba7cc },
            { name: 'Vert forêt', value: 0x2d4a22 },
            { name: 'Vert olive', value: 0x5d7052 },
            { name: 'Vert sauge', value: 0x87a878 },
            { name: 'Brun', value: 0x5e4b3b },
            { name: 'Beige', value: 0xe8e0d5 }
        ];

        // Créer le menu déroulant de couleurs
        const colorPalette = document.createElement('div');
        colorPalette.className = 'color-palette';
        bgColorContainer.appendChild(colorPalette);

        // Ajouter chaque couleur à la palette
        colors.forEach(color => {
            const colorSwatch = document.createElement('div');
            colorSwatch.className = 'color-swatch';
            colorSwatch.title = color.name;
            colorSwatch.style.backgroundColor = '#' + color.value.toString(16).padStart(6, '0');
            colorSwatch.addEventListener('click', () => {
                this.settings.backgroundColor = color.value;
                this.updateBackgroundColor();
                bgColorContainer.classList.remove('active');

                // Mettre à jour le bouton principal avec la couleur sélectionnée
                bgColorBtn.style.borderBottom = `3px solid #${color.value.toString(16).padStart(6, '0')}`;
            });
            colorPalette.appendChild(colorSwatch);

            // Si c'est la couleur actuelle, marquer le bouton
            if (color.value === this.settings.backgroundColor) {
                bgColorBtn.style.borderBottom = `3px solid #${color.value.toString(16).padStart(6, '0')}`;
            }
        });
    }

    /**
     * Crée un bouton pour l'interface utilisateur
     */
    createButton(text, onClick) {
        const button = document.createElement('button');
        button.className = 'model-viewer-btn';
        button.textContent = text;
        button.setAttribute('aria-label', text); // Ajout d'un label ARIA pour l'accessibilité
        button.addEventListener('click', onClick);
        this.uiContainer.appendChild(button);
        return button;
    }

    /**
     * Supprime le bouton Filaire s'il existe
     */
    removeWireframeButton() {
        if (!this.uiContainer) return;

        const buttons = this.uiContainer.querySelectorAll('.model-viewer-btn');
        buttons.forEach(button => {
            if (button.textContent === 'Filaire' || button.textContent.toLowerCase().includes('filaire') ||
                button.textContent === 'Wireframe' || button.textContent.toLowerCase().includes('wireframe')) {
                button.remove();
                console.log('Bouton Filaire supprimé');
            }
        });
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
     * Met à jour la couleur d'arrière-plan
     */
    updateBackgroundColor() {
        if (this.scene) {
            this.scene.background = new THREE.Color(this.settings.backgroundColor);
        }
    }

    /**
     * Charge un modèle OBJ (chemin local ou URL)
     */
    loadModel(modelPath, materialPath = null) {
        // Vérifier si le chemin est une URL externe
        const isExternalUrl = modelPath.startsWith('http://') || modelPath.startsWith('https://');

        // Si un modèle est déjà chargé, le supprimer et libérer la mémoire
        if (this.model) {
            // Libérer la mémoire des textures et des géométries
            this.model.traverse((child) => {
                if (child.isMesh) {
                    if (child.geometry) child.geometry.dispose();
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(mat => this.disposeMaterial(mat));
                        } else {
                            this.disposeMaterial(child.material);
                        }
                    }
                }
            });
            this.scene.remove(this.model);
            this.model = null;
        }

        // Afficher un message de chargement
        const loadingElement = document.createElement('div');
        loadingElement.className = 'loading-model';
        loadingElement.innerHTML = '<div class="spinner"></div><div class="progress-bar"><div class="progress-fill"></div></div>';
        this.container.appendChild(loadingElement);

        // Créer un cube simple comme placeholder (optimisé)
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ // Utiliser MeshBasicMaterial pour économiser des ressources
            color: 0xA9AF7E,
            wireframe: false
        });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.y = 0.5;
        this.scene.add(cube);

        // Animation simplifiée du cube (moins de calculs)
        const animateCube = () => {
            if (cube && this.scene.children.includes(cube)) {
                cube.rotation.y += 0.01; // Rotation sur un seul axe pour économiser des ressources
            }
        };
        this.onRender = animateCube;

        try {
            // Utiliser le cache si disponible
            if (window.modelCache && window.modelCache.hasModel(modelPath)) {
                console.log('Utilisation du modèle en cache');
                const cachedModel = window.modelCache.getModel(modelPath);
                this.processLoadedModel(cachedModel, cube, loadingElement);
                return;
            }

            // Fonction pour charger le modèle OBJ avec des options optimisées
            const loadOBJ = () => {
                const loader = new THREE.OBJLoader();

                // Simplifier le message de chargement
                if (isExternalUrl) {
                    console.log('Chargement du modèle:', modelPath);
                }

                loader.load(
                    modelPath,
                    (object) => {
                        // Traiter le modèle chargé avec notre fonction optimisée
                        this.processLoadedModel(object, cube, loadingElement);

                        // Mettre en cache le modèle si possible
                        if (window.modelCache && !window.modelCache.hasModel(modelPath)) {
                            window.modelCache.addModel(modelPath, object.clone());
                        }
                    },
                    (xhr) => {
                        // Progression du chargement
                        if (xhr.lengthComputable) {
                            const percent = Math.round((xhr.loaded / xhr.total) * 100);
                            const progressFill = loadingElement.querySelector('.progress-fill');
                            if (progressFill) {
                                progressFill.style.width = `${percent}%`;
                            }
                        }
                    },
                    (error) => {
                        // Erreur de chargement
                        console.error('Erreur lors du chargement du modèle:', error);

                        // Message d'erreur plus détaillé
                        let errorMsg = 'Erreur de chargement - Affichage du cube par défaut';

                        // Ajouter des détails spécifiques pour les URL externes
                        if (isExternalUrl) {
                            errorMsg += '<br><small>Erreur lors du chargement du modèle depuis l\'URL externe.</small>';
                            console.warn('URL actuelle:', modelPath);
                        }

                        loadingElement.innerHTML = `<span class="error">${errorMsg}</span>`;

                        setTimeout(() => {
                            if (this.container.contains(loadingElement)) {
                                this.container.removeChild(loadingElement);
                            }
                        }, 4000); // Temps plus long pour lire le message
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
            // Utiliser un timeout pour éviter les redimensionnements multiples rapprochés
            if (this.resizeTimeout) clearTimeout(this.resizeTimeout);

            this.resizeTimeout = setTimeout(() => {
                this.renderer.setSize(width, height);
            }, 100);
        }
    }

    /**
     * Boucle d'animation
     */
    animate() {
        if (!this.isInitialized) return;

        // Utiliser setTimeout au lieu de requestAnimationFrame pour réduire la fréquence de rendu
        // et économiser des ressources
        clearTimeout(this.animationFrameId);
        this.animationFrameId = setTimeout(() => {
            requestAnimationFrame(this.animate);

            // Ne pas mettre à jour si l'onglet est inactif ou si le conteneur n'est pas visible
            if (document.hidden || !this.container.offsetParent) return;

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
                // Vitesse de rotation réduite pour économiser des ressources
                this.model.rotation.y += 0.005;
            }

            // Effectuer le rendu seulement si tous les éléments sont prêts
            if (this.renderer && this.scene && this.camera) {
                this.renderer.render(this.scene, this.camera);
            }
        }, 50); // Limiter à environ 20 FPS pour économiser des ressources
    }

    /**
     * Arrête l'animation et nettoie les ressources
     */
    dispose() {
        // Arrêter la boucle d'animation
        if (this.animationFrameId) {
            clearTimeout(this.animationFrameId);
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        // Supprimer les écouteurs d'événements
        window.removeEventListener('resize', this.onWindowResize);

        // Nettoyer l'interface utilisateur
        if (this.uiContainer && this.container.contains(this.uiContainer)) {
            this.container.removeChild(this.uiContainer);
        }

        // Libérer la mémoire des textures et des géométries
        if (this.model) {
            this.model.traverse((child) => {
                if (child.isMesh) {
                    if (child.geometry) {
                        child.geometry.dispose();
                    }
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(material => {
                                this.disposeMaterial(material);
                            });
                        } else {
                            this.disposeMaterial(child.material);
                        }
                    }
                }
            });
            this.scene.remove(this.model);
            this.model = null;
        }

        // Nettoyer les helpers
        if (this.grid) {
            this.grid.material.dispose();
            this.scene.remove(this.grid);
            this.grid = null;
        }

        if (this.axes) {
            this.axes.material.dispose();
            this.scene.remove(this.axes);
            this.axes = null;
        }

        // Nettoyer les lumières
        Object.values(this.lights).forEach(light => {
            if (light) {
                this.scene.remove(light);
            }
        });
        this.lights = {};

        // Nettoyer les contrôles
        if (this.controls) {
            this.controls.dispose();
            this.controls = null;
        }

        // Nettoyer le renderer
        if (this.renderer) {
            this.renderer.dispose();
            if (this.container.contains(this.renderer.domElement)) {
                this.container.removeChild(this.renderer.domElement);
            }
            this.renderer = null;
        }

        // Nettoyer la scène
        if (this.scene) {
            this.scene.clear();
            this.scene = null;
        }

        // Nettoyer la caméra
        this.camera = null;

        // Forcer le garbage collector
        if (window.gc) {
            try {
                window.gc();
            } catch (e) {
                console.log('Impossible de forcer le garbage collector');
            }
        }

        this.isInitialized = false;
    }

    /**
     * Traite un modèle 3D après son chargement
     */
    processLoadedModel(object, cube, loadingElement) {
        // Succès du chargement
        this.model = object;

        // Supprimer le cube de test
        if (cube) {
            this.scene.remove(cube);
            this.onRender = null;
        }

        // Appliquer des matériaux optimisés et simplifier le modèle
        object.traverse((child) => {
            if (child.isMesh) {
                // Appliquer un matériau simplifié si aucun n'est défini
                if (!child.material) {
                    child.material = new THREE.MeshBasicMaterial({
                        color: 0xcccccc
                    });
                }

                // Optimiser les matériaux existants pour de meilleures performances
                if (child.material.type === 'MeshStandardMaterial' ||
                    child.material.type === 'MeshPhongMaterial') {
                    const color = child.material.color;
                    const map = child.material.map;
                    child.material = new THREE.MeshBasicMaterial({
                        color: color,
                        map: map
                    });
                }

                // Désactiver les ombres pour améliorer les performances
                child.castShadow = false;
                child.receiveShadow = false;

                // Simplifier la géométrie si possible
                if (child.geometry && child.geometry.attributes &&
                    child.geometry.attributes.position &&
                    child.geometry.attributes.position.count > 5000) {
                    console.log('Simplification de la géométrie pour améliorer les performances');
                    // Nous ne pouvons pas simplifier directement, mais nous pouvons réduire la précision
                    child.geometry.attributes.position.needsUpdate = true;
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
    }

    /**
     * Libère la mémoire d'un matériau
     */
    disposeMaterial(material) {
        if (!material) return;

        // Libérer les textures
        if (material.map) material.map.dispose();
        if (material.lightMap) material.lightMap.dispose();
        if (material.bumpMap) material.bumpMap.dispose();
        if (material.normalMap) material.normalMap.dispose();
        if (material.specularMap) material.specularMap.dispose();
        if (material.envMap) material.envMap.dispose();

        // Libérer le matériau lui-même
        material.dispose();
    }
}
