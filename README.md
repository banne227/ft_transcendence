# ft_transcendence

## Docs
[Infrastructures documentation](https://github.com/banne227/ft_transcendence/blob/main/docs/INFRA.md)

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

Depuis le dossier services/game_serve/src:

```bash
npm run dev
```

Le serveur démarre sur:

```text
http://localhost:3000
```

## Lancer les tests backend

Depuis services/game_serve/src:

```bash
npm test
```

Ou depuis pour coonnecter un client:

```bash
node test-client.ts
```

## Dépannage rapide

Si tu vois une erreur comme `SyntaxError: Unexpected token '?'`, tu es probablement sur une version de Node trop ancienne.

```bash
node -v
nvm use 20
```
