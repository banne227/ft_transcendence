# ft_transcendence

## Prérequis

- Node.js `>= 18` (recommandé: Node 20)
- npm

Si `nvm` est installé:

```bash
nvm install 20
nvm use 20
```

Vérifier les versions:

```bash
node -v
npm -v
```

## Installation

Depuis la racine du projet:

```bash
cd back
npm install
```

## Lancer le projet (backend)

Option 1 (depuis la racine):

```bash
npm run dev
```

Option 2 (depuis `back/`):

```bash
cd back
npm run dev
```

Le serveur démarre sur:

```text
http://localhost:3000
```

## Lancer les tests backend

Depuis la racine:

```bash
npm test
```

Ou depuis `back/`:

```bash
cd back
npm run test
```

## Dépannage rapide

Si tu vois une erreur comme `SyntaxError: Unexpected token '?'`, tu es probablement sur une version de Node trop ancienne.

```bash
node -v
nvm use 20
```