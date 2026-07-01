#!/bin/bash

# Script de compilation Tailwind CSS pour le développement
# Usage: ./compile-tailwind.sh

set -e

echo "🎨 Compilation Tailwind CSS..."

# Vérifier que tailwindcss est installé
if ! command -v tailwindcss &> /dev/null; then
    echo "❌ tailwindcss n'est pas installé"
    echo "Installez les dépendances: npm install -D tailwindcss@^3 postcss autoprefixer"
    exit 1
fi

cd services/nginx/frontend

echo "📝 Compilation game/style/style.src.css..."
npx tailwindcss -i ./game/style/style.src.css -o ./game/style/style-theme.css --minify

echo "📝 Compilation hub/style/hub.src.css..."
npx tailwindcss -i ./hub/style/hub.src.css -o ./hub/style/hub.css --minify

echo "📝 Compilation stats/stats.src.css..."
npx tailwindcss -i ./stats/stats.src.css -o ./stats/stats.css --minify

echo "📝 Compilation error/error.src.css..."
npx tailwindcss -i ./error/error.src.css -o ./error.css --minify

echo "✅ Compilation terminée!"
echo ""
echo "📁 Fichiers générés:"
echo "  - game/style/style-theme.css"
echo "  - hub/style/hub.css"
echo "  - stats/stats.css"
echo "  - error.css"
