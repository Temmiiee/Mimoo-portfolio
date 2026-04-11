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
   - L'upload est disponible sur une page séparée : `admin.html`
   - Accessible via l'URL directe (non liée dans la navigation principale)
   - Authentification par mot de passe requise
   - Changez le mot de passe dans `js/config.js` (variable `ADMIN_PASSWORD`)

3. **Upload d'images** :
   - Connectez-vous sur `/admin.html`
   - Les images sont automatiquement envoyées vers getPronto
   - Elles s'affichent immédiatement dans la galerie du portfolio

4. **Sécurité** :
   - Validation des fichiers (type image, taille max 10MB)
   - Authentification admin requise
   - Clé API non exposée dans le code public

### Variables d'environnement avec GitHub Pages

GitHub Pages étant un hébergement statique, les variables d'environnement traditionnelles ne sont pas disponibles. Voici les solutions :

#### Solution actuelle (recommandée)
- **Fichier config.js** dans `.gitignore` : Les secrets restent locaux et ne sont pas committés
- **Avantages** : Simple, sécurisé pour le développement
- **Inconvénient** : Nécessite de gérer manuellement le fichier sur le serveur

#### Alternatives avancées
1. **GitHub Actions + Build** :
   - Utiliser des secrets GitHub pour stocker les clés API
   - Générer le fichier config.js lors du build
   - Exemple de workflow GitHub Actions

2. **Service externe** :
   - Stocker les secrets dans un service comme Vercel, Netlify
   - Injecter les variables lors du déploiement

Pour votre usage actuel, la solution avec `config.js` dans `.gitignore` est parfaitement adaptée !

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
