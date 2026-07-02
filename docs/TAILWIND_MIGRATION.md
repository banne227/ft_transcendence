# Migration vers Tailwind CSS - Frontend

## Résumé des changements

Tous les fichiers CSS bruts du frontend ont été convertis en Tailwind CSS selon les exigences du sujet ft_transcendence.

### Fichiers générés/modifiés

#### 1. **Fichiers source Tailwind** (à compiler)
- ✅ `game/style/style.src.css` - Styles Tailwind pour la page de jeu
- ✅ `hub/style/hub.src.css` - Styles Tailwind pour le hub
- ✅ `stats/stats.src.css` - Styles Tailwind pour les stats

#### 2. **Fichiers HTML mis à jour**
- ✅ `game/game.html` - Utilise maintenant `style/style-theme.css` compilé
  - Remplacement des `style="..."` inline par des classes Tailwind
  - Classes Tailwind appliquées aux éléments

- ✅ `hub/page.html` - Utilise maintenant `style/hub.css` compilé
  - Suppression des 4 fichiers CSS séparés (base.css, window.css, taskbar.css, desktop.css)
  - Consoé dans un seul fichier compilé

- ✅ `stats/stats.html` - Utilise maintenant `stats.css` compilé
  - Suppression des styles inline
  - Utilisation exclusive de Tailwind CSS

#### 3. **Configuration**
- ✅ `tailwind.config.js` - Mis à jour avec:
  - Fonts personnalisées (Tahoma, Press Start 2P)
  - Couleurs XP (retro Windows aesthetic)
  - Couleurs personnalisées pour les éléments du jeu

#### 4. **Build**
- ✅ `Dockerfile` - Mis à jour pour compiler les 3 fichiers source Tailwind:
  - `game/style/style.src.css` → `game/style/style-theme.css`
  - `hub/style/hub.src.css` → `hub/style/hub.css`
  - `stats/stats.src.css` → `stats/stats.css`

### Anciens fichiers CSS (à supprimer)
Les fichiers CSS bruts suivants sont maintenant remplacés par la compilation Tailwind:
- ❌ `game/style/style.css` (remplacé par style-theme.css compilé)
- ❌ `hub/style/base.css`
- ❌ `hub/style/window.css`
- ❌ `hub/style/taskbar.css`
- ❌ `hub/style/desktop.css`

## Structure des classes Tailwind

### Retro Windows XP Theme
- **Thème**: DOS/Windows XP retro design
- **Palette**: Couleurs personnalisées (bleu XP, gris panel, etc.)
- **Fonts**: Courier New (mono), Tahoma (default), Press Start 2P (retro)

### Patterns utilisés

#### 1. Borders XP (3D effect)
```html
<!-- Boutons 3D XP -->
<button class="border-t-2 border-l-2 border-white
                border-b-2 border-r-2 border-b-xp-border border-r-xp-border">
```

#### 2. Gradients
```html
<!-- Gradients de boutons -->
<div class="bg-gradient-to-b from-xp-btnFrom to-xp-btnTo">
```

#### 3. Layouts flexbox
```html
<div class="flex flex-col h-screen">
  <div class="flex-1">Content</div>
</div>
```

### Configuration Tailwind étendues

**Couleurs personnalisées** (tailwind.config.js):
- `xp.blue`, `xp.blueLight` - Bleus XP
- `xp.panel` - Gris panel
- `xp.border` - Gris border
- `xp.btnFrom/To` - Gradients boutons
- `xp.closeBorder*` - Couleurs bouton fermer
- `custom-red` - Rouge #ff5555
- `custom-green` - Vert #aaffaa

**Fonts étendues**:
- `font-tahoma` - Police Tahoma
- `font-mono` - Courier New

## Avantages de la migration

✅ Consolidation des CSS (4 fichiers → 1)
✅ Réduction de la taille finale CSS (compression Tailwind)
✅ Maintenance simplifiée (classes réutilisables)
✅ Garantie de cohérence visuelle
✅ Meilleure scalabilité
✅ Réponse aux exigences du sujet

## Compilation

La compilation se fait automatiquement lors du build Docker:
```dockerfile
RUN ./node_modules/.bin/tailwindcss -i ./game/style/style.src.css -o ./game/style/style-theme.css --minify
```

Les fichiers compilés sont minifiés pour une production optimale.
