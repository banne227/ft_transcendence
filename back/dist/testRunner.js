"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("./game");
(0, game_1.addPlayer)('p1', 'Alice');
(0, game_1.addPlayer)('p2', 'Bob');
const p1 = game_1.state.players['p1'];
const p2 = game_1.state.players['p2'];
if (p1 && p1.body[0]) {
    p1.body[0].x = 500;
    p1.body[0].y = 500;
}
if (p2 && p2.body[0]) {
    p2.body[0].x = 900;
    p2.body[0].y = 500;
}
// directions fixes pour observer le déplacement sans collision entre joueurs
(0, game_1.setDirection)('p1', 'RIGHT');
(0, game_1.setDirection)('p2', 'RIGHT');
// place une nourriture devant p1 pour forcer un event eaten rapidement
if (game_1.state.foods[0]) {
    game_1.state.foods[0].x = 510;
    game_1.state.foods[0].y = 500;
}
// démarrer la boucle de jeu et afficher résumé à chaque tick
(0, game_1.startGameLoop)((s) => {
    console.log('--- tick ---');
    for (const p of Object.values(s.players)) {
        const head = p.body && p.body[0];
        const headStr = head ? `(${head.x},${head.y})` : '(no-head)';
        console.log(`${p.id} ${p.name} alive=${p.alive} score=${p.score} head=${headStr} len=${p.body.length}`);
    }
    console.log('Foods:', s.foods.length);
});
//# sourceMappingURL=testRunner.js.map