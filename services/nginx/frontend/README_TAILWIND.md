# Frontend - Tailwind CSS Setup

## 🎨 Architecture CSS

Le frontend utilise **Tailwind CSS v3** pour tous les styles. Les fichiers CSS bruts ont été consolidés en fichiers source Tailwind (`.src.css`) qui sont compilés pendant le build.

### Structure des fichiers

```
services/nginx/frontend/
├── game/
│   ├── game.html              # Page jeu (DOS/XP style)
│   └── style/
│       ├── style.src.css      # Source Tailwind
│       └── style-theme.css    # Compilé (généré au build)
├── hub/
│   ├── page.html              # Page hub
│   └── style/
│       ├── hub.src.css        # Source Tailwind
│       └── hub.css            # Compilé (généré au build)
├── stats/
│   ├── stats.html             # Page leaderboard
│   ├── stats.src.css          # Source Tailwind
│   └── stats.css              # Compilé (généré au build)
├── error/
│   ├── 40x.html               # Erreurs
│   ├── error.src.css          # Source Tailwind
│   └── error.css              # Compilé (généré au build)
└── tailwind.config.js         # Configuration Tailwind
```

## 🚀 Développement local

### Installation des dépendances

```bash
cd services/nginx/frontend
npm install
npm install -D tailwindcss@^3 postcss autoprefixer
```

### Compiler les CSS

Depuis la racine du projet:

```bash
chmod +x compile-tailwind.sh
./compile-tailwind.sh
```

Ou manuellement:

```bash
cd services/nginx/frontend
npx tailwindcss -i ./game/style/style.src.css -o ./game/style/style-theme.css --minify
npx tailwindcss -i ./hub/style/hub.src.css -o ./hub/style/hub.css --minify
npx tailwindcss -i ./stats/stats.src.css -o ./stats/stats.css --minify
npx tailwindcss -i ./error/error.src.css -o ./error.css --minify
```

### Mode watch (pour les changements en temps réel)

```bash
cd services/nginx/frontend
npx tailwindcss -i ./game/style/style.src.css -o ./game/style/style-theme.css -w
# Dans d'autres terminaux:
npx tailwindcss -i ./hub/style/hub.src.css -o ./hub/style/hub.css -w
```

## 🎨 Customisation Tailwind

Voir `tailwind.config.js`:

- **Couleurs XP**: Thème retro Windows personnalisé
- **Fonts**: Tahoma, Courier New, Press Start 2P
- **Spacing**: Extensions personnalisées

### Ajouter une nouvelle couleur

```javascript
// Dans tailwind.config.js
colors: {
  xp: {
    myColor: '#hexcode',
  }
}
```

Puis utiliser: `class="bg-xp-myColor"`

## 📝 Style Guide

### Retro Windows XP

Les designs suivent l'esthétique DOS/Windows XP:

```html
<!-- Bouton XP 3D -->
<button class="border-t-2 border-l-2 border-white
                border-b-2 border-r-2 border-b-xp-border border-r-xp-border
                bg-gradient-to-b from-xp-grayBtnFrom to-xp-panel">
  Cliquer
</button>

<!-- Fenêtre XP -->
<div class="window">
  <div class="titlebar">
    <span class="titlebar-title">Mon App</span>
  </div>
  <div class="window-body">Contenu</div>
</div>
```

### Flexbox/Grid

```html
<!-- Flexbox colonne avec auto-grow -->
<div class="flex flex-col flex-1">
  <div class="flex-1">Expands</div>
  <div>Fixed</div>
</div>
```

## 🏗️ Build Docker

Le Dockerfile compile automatiquement tous les CSS Tailwind:

```bash
docker build -t painter-frontend services/nginx
```

Les fichiers compilés sont minifiés pour la production.

## ✅ Checklist migration

- [x] Tous les CSS bruts → Tailwind CSS
- [x] Consolidation de 5 fichiers CSS → 4 sources Tailwind
- [x] Styles inline → Classes Tailwind
- [x] Configuration Tailwind complète
- [x] Build Docker pour compilation
- [x] Script de compilation pour dev
- [x] Documentation

## 📚 Ressources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Configuration](../tailwind.config.js)
- [Migration Guide](../TAILWIND_MIGRATION.md)
