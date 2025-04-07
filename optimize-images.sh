#!/bin/bash
# Script d'optimisation des images pour Mimoo Portfolio

# Créer un dossier pour les images optimisées
mkdir -p images/optimized

# Redimensionner et optimiser les images JPG
echo "Optimisation des images JPG..."
for img in images/*.jpg images/gallery/*.jpg images/previews/*.jpg; do
  if [ -f "$img" ]; then
    filename=$(basename "$img")
    echo "Traitement de $filename"
    # Redimensionner à max 1200px de large, convertir en WebP et optimiser
    convert "$img" -resize "1200x1200>" -strip -quality 85 "images/optimized/${filename%.*}.webp"
    # Créer aussi une version JPG optimisée pour compatibilité
    convert "$img" -resize "1200x1200>" -strip -quality 85 "images/optimized/$filename"
  fi
done

# Redimensionner et optimiser les images PNG
echo "Optimisation des images PNG..."
for img in images/*.png images/gallery/*.png images/previews/*.png; do
  if [ -f "$img" ]; then
    filename=$(basename "$img")
    echo "Traitement de $filename"
    # Redimensionner à max 1200px de large, convertir en WebP avec transparence
    convert "$img" -resize "1200x1200>" -strip "images/optimized/${filename%.*}.webp"
    # Créer aussi une version PNG optimisée pour compatibilité
    pngquant --force --quality=65-80 --output "images/optimized/$filename" "$img"
  fi
done

echo "Optimisation terminée. Les images optimisées sont dans le dossier 'images/optimized'."
