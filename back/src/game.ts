/*
 * Author: banne
 * File: game.ts
 * Created: 2026-05-30
*/

const MAP_SIZE = { width: 2000, height: 2000 }
const TICK_RATE = 50   // on met à jour le jeu toutes les 50ms = 20 fois/seconde
const SPEED = 5
let FOOD_ID = 0


//=======    object pour le jeu

//partie du serpent juste des positions
interface Segment{
    x: number
    y: number
}

interface Player{
    id: string
    name: string
    body: Segment[] //body[0] == tete du serpent
    alive: boolean
    score: number
    direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
}

interface Food{
    id: number
    x: number
    y: number
    feed: number
}

interface Game{
    players: Record<string, Player> //liste de tous mes joueurs par id
    foods: Food[] //liste de la nouriture
    mapSize: { width: number, height: number }
}


//=fonctions utils
function spawnFood(): Food{
    return {
        id: FOOD_ID++,
        x: Math.floor(Math.random() * MAP_SIZE.width),
        y: Math.floor(Math.random() * MAP_SIZE.height),
        feed: FOOD_ID % 5 + 1
    }
}

function setDead(id: string): boolean {
    const player = state.players[id]
    if (!player)
        return false

    player.alive = false
    return false
}

//===init du jeu
let state: Game = {
    players: {},
    foods: [],
    mapSize: MAP_SIZE
}

//creation de 100 nourritures au lancement
for (let i = 0; i < 100; i++)
{
    state.foods.push(spawnFood())
}


//creation d'un joueur ! il faudra check si le pseudo existe deja sinon je l'ecrase
// export = fonction public qui peut etre reutiliser en dehors du fichier
export function addPlayer(id: string, name: string): void{
    state.players[id] = {
        id: id,
        name: name,
        body : [
            {
                x: Math.floor(Math.random() * (MAP_SIZE.width - 500)) + 100,
                y: Math.floor(Math.random() * (MAP_SIZE.height - 500)) + 100
            }
        ],
        alive: true,
        score: 0,
        direction: 'RIGHT'
    }
}

//==========fonction relative au player

export function setDirection(id: string, dir:Player['direction']): void {
    if (state.players[id])
        state.players[id].direction = dir
}

export function removePlayer(id: string): void {
    if (state.players[id])
        delete state.players[id]
}

//permet de regarder si la tete du joueur entre en collision avec de la nourriture ou un joueur
function findCollision(head: Segment, segments: Segment[]): number {
    let distance = 15
    return segments.findIndex(segment =>
        Math.abs(segment.x - head.x) < distance &&
        Math.abs(segment.y - head.y) < distance
    );
}

export function movePlayer(id: string): boolean {
    const player = state.players[id]
    if (!player)
        return false

    //copie de la tete actuel
    const head = player.body[0]
    const newhead: Segment = { ...head }

    // Déplacer selon la direction
    if (player.direction === 'UP')    newhead.y -= SPEED
    if (player.direction === 'DOWN')  newhead.y += SPEED
    if (player.direction === 'LEFT')  newhead.x -= SPEED
    if (player.direction === 'RIGHT') newhead.x += SPEED

    //si la tete touche un mur
    if (newhead.x <= 0 || newhead.x >= MAP_SIZE.width || newhead.y <= 0 || newhead.y >= MAP_SIZE.height)
        return setDead(id)

    //je verifie s'il y a une collision avec un joueur
    for (const player of Object.values(state.players))
        if (findCollision(newhead, player.body))
            return setDead(id)

    //si la tete touche de la nourriture je ne supprime pas le dernier segment du corp impression de +1
    const foodIndex = findCollision(newhead, state.foods)
    if (foodIndex === -1)  // pas de nourriture
        player.body.pop() 
    else
    {
        player.score += state.foods[foodIndex].feed //ajt au score
        state.foods.splice(foodIndex, 1) //suprimer ce qui a ete manger
        state.foods.push(spawnFood()) //spawn une nouvelle
    }

    player.body.unshift(newhead) //ajouter la tete au debut de la liste
    return true
}

// La game loop — appelée par server.ts
export function startGameLoop(onTick: (state: Game) => void): void {
    setInterval(() => {
        for (const player of Object.values(state.players)) {
            if (player.alive)
                movePlayer(player.id)
        }
        onTick(state)
    }, TICK_RATE)
}

export { state }

