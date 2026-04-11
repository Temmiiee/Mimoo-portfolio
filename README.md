# Portfolio Artistique de Mimoo

Un portfolio artistique moderne et interactif créé pour Mimoo, mettant en valeur ses créations digitales, illustrations et character designs.

🔗 **Voir le projet en ligne : [Mimoo Portfolio](https://temmiiee.github.io/Mimoo-portfolio/)**

## 🎨 Caractéristiques

- Design responsive et moderne
- Galerie interactive avec système de filtrage
- Lightbox pour la visualisation des œuvres
- Animations fluides et effets visuels
- Formulaire de contact intégré
- Support multilingue (Français/Anglais)

## 🚀 Technologies Utilisées

- HTML5
- CSS3
- JavaScript (Vanilla)
- Three.js (pas de projet 3d à afficher pour le moment)
- GSAP

## 📝 License

### Code Source
Le code source de ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

### Contenu Artistique
Toutes les œuvres d'art présentées dans la galerie sont la propriété exclusive de Mimoo. Tous droits réservés.
Les images ne peuvent être utilisées, reproduites ou distribuées sans l'autorisation explicite de l'artiste.

## 🖼️ Gestion des Images du Portfolio

Le portfolio utilise un système dynamique pour charger les images depuis un fichier JSON (`images/portfolio-images.json`). Cela permet de facilement mettre à jour les images affichées sans modifier le code HTML.

### Hébergement des Images

### Utilisation de getPronto pour l'hébergement

1. **Configuration de l'API** :
   - Le fichier `js/config.js` contient votre clé API getPronto et le mot de passe admin
   - Ce fichier est ajouté à .gitignore pour la sécurité

2. **Accès administrateur** :
   - L'upload est protégé par un mot de passe administrateur
   - Changez le mot de passe dans `js/config.js` (variable `ADMIN_PASSWORD`)

3. **Upload d'images par les utilisateurs** :
   - Une section "Partagez vos créations" permet aux visiteurs d'uploader des images (après authentification admin)
   - Les images sont automatiquement envoyées vers getPronto
   - Elles s'affichent immédiatement dans la galerie

4. **Sécurité** :
   - Validation des fichiers (type image, taille max 10MB)
   - Authentification admin requise
   - Clé API non exposée dans le code public

### Avantages de getPronto
- Hébergement permanent des images
- API simple pour les uploads automatiques
- URLs directes pour l'affichage rapide
- Gestion centralisée des médias du portfolio

### Automatisation des Changements
Le script `js/portfolio-images.js` peut être étendu pour :
- Charger des images depuis une API externe
- Faire tourner les images automatiquement
- Intégrer avec des services comme Unsplash pour des images aléatoires

Pour activer la rotation automatique, décommentez la ligne `portfolioManager.startRotation(60);` dans `portfolio-images.js`.

Pour toute question concernant :
- Le code source : mattheotermine104@gmail.com
- Les œuvres d'art : Contactez Mimoo via ses réseaux sociaux
