"use strict";
/*
 * Author: banne
 * File: game.ts
 * Created: 2026-05-30
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.state = void 0;
exports.addPlayer = addPlayer;
exports.setDirection = setDirection;
exports.removePlayer = removePlayer;
exports.movePlayer = movePlayer;
exports.startGameLoop = startGameLoop;
const MAP_SIZE = { width: 2000, height: 2000 };
const TICK_RATE = 500; // on met à jour le jeu toutes les 50ms = 20 fois/seconde
const SPEED = 1;
let FOOD_ID = 0;
//=fonctions utils
function spawnFood() {
    const id = FOOD_ID++;
    const minDist = 120;
    let x, y;
    let attempts = 0;
    outer: while (true) {
        x = Math.floor(Math.random() * MAP_SIZE.width);
        y = Math.floor(Math.random() * MAP_SIZE.height);
        attempts++;
        for (const p of Object.values(state.players)) {
            for (const seg of p.body) {
                const dx = Math.abs(seg.x - x);
                const dy = Math.abs(seg.y - y);
                if (dx < minDist && dy < minDist) {
                    if (attempts > 1000)
                        break outer;
                    continue outer;
                }
            }
        }
        break;
    }
    return {
        id,
        x,
        y,
        feed: (id % 5) + 1
    };
}
function setDead(id) {
    const player = state.players[id];
    if (!player)
        return false;
    player.alive = false;
    console.log(`Player ${id} died`);
    return false;
}
//===init du jeu
let state = {
    players: {},
    foods: [],
    mapSize: MAP_SIZE
};
exports.state = state;
//creation de 100 nourritures au lancement
for (let i = 0; i < 100; i++) {
    state.foods.push(spawnFood());
}
//creation d'un joueur ! il faudra check si le pseudo existe deja sinon je l'ecrase
// export = fonction public qui peut etre reutiliser en dehors du fichier
function addPlayer(id, name) {
    state.players[id] = {
        id: id,
        name: name,
        body: [
            {
                x: Math.floor(Math.random() * (MAP_SIZE.width - 500)) + 100,
                y: Math.floor(Math.random() * (MAP_SIZE.height - 500)) + 100
            }
        ],
        alive: true,
        score: 0,
        direction: 'RIGHT'
    };
}
//==========fonction relative au player
function setDirection(id, dir) {
    if (state.players[id])
        state.players[id].direction = dir;
}
function removePlayer(id) {
    if (state.players[id])
        delete state.players[id];
}
//permet de regarder si la tete du joueur entre en collision avec de la nourriture ou un joueur
function findCollision(head, segments) {
    let distance = 15;
    return segments.findIndex(segment => Math.abs(segment.x - head.x) < distance &&
        Math.abs(segment.y - head.y) < distance);
}
// collision entre une tête et la nourriture
function findFoodCollision(head, foods) {
    let distance = 15;
    return foods.findIndex(food => Math.abs(food.x - head.x) < distance &&
        Math.abs(food.y - head.y) < distance);
}
function movePlayer(id) {
    const player = state.players[id];
    if (!player)
        return false;
    //copie de la tete actuel
    const head = player.body[0];
    if (!head)
        return false;
    const newhead = { x: head.x, y: head.y };
    // Déplacer selon la direction
    if (player.direction === 'UP')
        newhead.y -= SPEED;
    if (player.direction === 'DOWN')
        newhead.y += SPEED;
    if (player.direction === 'LEFT')
        newhead.x -= SPEED;
    if (player.direction === 'RIGHT')
        newhead.x += SPEED;
    //si la tete touche un mur
    if (newhead.x <= 0 || newhead.x >= MAP_SIZE.width || newhead.y <= 0 || newhead.y >= MAP_SIZE.height)
        return setDead(id);
    //je verifie s'il y a une collision avec un joueur
    for (const otherPlayer of Object.values(state.players)) {
        if (otherPlayer.id === id)
            continue;
        if (findCollision(newhead, otherPlayer.body) !== -1)
            return setDead(id);
    }
    //si la tete touche de la nourriture je ne supprime pas le dernier segment du corp impression de +1
    const foodIndex = findFoodCollision(newhead, state.foods);
    const food = foodIndex !== -1 ? state.foods[foodIndex] : undefined;
    if (!food) // pas de nourriture
        player.body.pop();
    else {
        player.score += food.feed; //ajt au score
        console.log(`Player ${id} ate food ${food.id} (+${food.feed})`);
        state.foods.splice(foodIndex, 1); //suprimer ce qui a ete manger
        state.foods.push(spawnFood()); //spawn une nouvelle
    }
    player.body.unshift(newhead); //ajouter la tete au debut de la liste
    return true;
}
// La game loop — appelée par server.ts
function startGameLoop(onTick) {
    setInterval(() => {
        for (const player of Object.values(state.players)) {
            if (player.alive)
                movePlayer(player.id);
        }
        onTick(state);
    }, TICK_RATE);
}
//# sourceMappingURL=game.js.map