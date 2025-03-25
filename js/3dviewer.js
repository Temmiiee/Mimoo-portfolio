// Visualisateur de modèles 3D pour le portfolio
class ModelViewer {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.model = null;
        this.isInitialized = false;
        this.animationFrameId = null;
    }

    // Initialiser la scène Three.js
    init() {
        if (this.isInitialized) return;

        // Créer la scène
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf8f9fa);

        // Configurer la caméra
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        this.camera.position.z = 5;

        // Configurer le renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        // Ajouter les contrôles OrbitControls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 10;

        // Ajouter des lumières
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight2.position.set(-1, -1, -1);
        this.scene.add(directionalLight2);

        // Gérer le redimensionnement de la fenêtre
        window.addEventListener('resize', this.onWindowResize.bind(this));

        this.isInitialized = true;
        this.animate();
    }

    // Charger un modèle OBJ
    loadModel(modelPath) {
        // Si un modèle est déjà chargé, le supprimer
        if (this.model) {
            this.scene.remove(this.model);
            this.model = null;
        }

        // Afficher un message de chargement
        const loadingElement = document.createElement('div');
        loadingElement.className = 'loading-model';
        loadingElement.textContent = 'Chargement du modèle...';
        this.container.appendChild(loadingElement);

        // Créer un cube par défaut pour tester le rendu
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0x557153 });
        const cube = new THREE.Mesh(geometry, material);
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
            // Créer un loader OBJ
            const loader = new THREE.OBJLoader();

            // Charger le modèle
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

                    // Centrer le modèle
                    const box = new THREE.Box3().setFromObject(object);
                    const center = box.getCenter(new THREE.Vector3());
                    const size = box.getSize(new THREE.Vector3());
                    const maxDim = Math.max(size.x, size.y, size.z);
                    const scale = 3 / maxDim;

                    object.position.x = -center.x;
                    object.position.y = -center.y;
                    object.position.z = -center.z;
                    object.scale.set(scale, scale, scale);

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
                        loadingElement.textContent = `Chargement: ${percent}%`;
                    } else {
                        loadingElement.textContent = 'Chargement en cours...';
                    }
                },
                (error) => {
                    // Erreur de chargement
                    console.error('Erreur lors du chargement du modèle:', error);
                    loadingElement.textContent = 'Erreur de chargement - Affichage du cube par défaut';
                    setTimeout(() => {
                        if (this.container.contains(loadingElement)) {
                            this.container.removeChild(loadingElement);
                        }
                    }, 2000);
                }
            );
        } catch (error) {
            console.error('Erreur lors de l\'initialisation du chargeur:', error);
            loadingElement.textContent = 'Erreur - Affichage du cube par défaut';
            setTimeout(() => {
                if (this.container.contains(loadingElement)) {
                    this.container.removeChild(loadingElement);
                }
            }, 2000);
        }
    }

    // Gérer le redimensionnement de la fenêtre
    onWindowResize() {
        if (!this.isInitialized) return;

        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    // Boucle d'animation
    animate() {
        if (!this.isInitialized) return;

        this.animationFrameId = requestAnimationFrame(this.animate.bind(this));

        // Mettre à jour les contrôles
        if (this.controls) this.controls.update();

        // Exécuter la fonction de rendu personnalisée si elle existe
        if (this.onRender) this.onRender();

        // Rendre la scène
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    // Arrêter l'animation et nettoyer
    dispose() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        if (this.renderer) {
            this.renderer.dispose();
            if (this.container.contains(this.renderer.domElement)) {
                this.container.removeChild(this.renderer.domElement);
            }
        }

        window.removeEventListener('resize', this.onWindowResize.bind(this));

        this.isInitialized = false;
    }
}
