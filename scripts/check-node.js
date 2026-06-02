const majorVersion = Number(process.versions.node.split('.')[0]);

if (!Number.isFinite(majorVersion) || majorVersion < 18) {
  console.error(`\nNode.js ${process.versions.node} détecté.`);
  console.error('Ce projet nécessite Node.js >= 18 (recommandé: 20).');
  console.error('Commande conseillée: nvm use 20\n');
  process.exit(1);
}
