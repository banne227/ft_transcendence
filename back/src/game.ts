/*
 * Author: banne
 * File: game.ts
 * Created: 2026-05-30
*/

const MAP_SIZE = { width: 2000, height: 2000 }
const TICK_RATE = 200   // on met à jour le jeu toutes les 50ms = 20 fois/seconde
const SPEED = 4
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
function spawnFood(state: Game): Food{
    const id = FOOD_ID++
    let x = Math.floor(Math.random() * (MAP_SIZE.width - 100)) + 50
    let y = Math.floor(Math.random() * (MAP_SIZE.height - 100)) + 50
    return {id, x, y, feed: (id % 5) + 1}
}

export function displayState(state: Game): void {
    console.log('--- tick ---')
    for (const player of Object.values(state.players)) {
        const head = player.body && player.body[0]
        const headStr = head ? `(${head.x},${head.y})` : '(no-head)'
        console.log(`${player.id} ${player.name} alive=${player.alive} score=${player.score} head=${headStr} len=${player.body.length}`)
    }
}


function setDead(id: string): boolean {
    const player = state.players[id]
    if (!player)
        return false

    player.alive = false
    console.log(`Player ${id} died`)
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
    state.foods.push(spawnFood(state))
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
    {
        if ((state.players[id].direction === 'DOWN' || state.players[id].direction === 'UP') 
            && (dir === 'DOWN' || dir === 'UP'))
            return
        else if ((state.players[id].direction === 'RIGHT' || state.players[id].direction === 'LEFT') 
            && (dir === 'RIGHT' || dir === 'LEFT'))
            return
        else
            state.players[id].direction = dir
    }
       
}

export function removePlayer(id: string): void {
    if (state.players[id])
        delete state.players[id]
}

//permet de regarder si la tete du joueur entre en collision avec un joueur
function findCollision(head: Segment, segments: Segment[]): number {
    let distance = 15
    return segments.findIndex(segment =>
        Math.abs(segment.x - head.x) < distance &&
        Math.abs(segment.y - head.y) < distance
    );
}

// collision entre une tête et la nourriture
function findFoodCollision(head: Segment, foods: Food[]): number {
    let distance = 15
    return foods.findIndex(food =>
        Math.abs(food.x - head.x) < distance &&
        Math.abs(food.y - head.y) < distance
    )
}

export function movePlayer(id: string): boolean {
    const player = state.players[id]
    if (!player)
        return false

    //copie de la tete actuel
    const head = player.body[0]
    if (!head) return false
    const newhead: Segment = { x: head.x, y: head.y }

    // Déplacer selon la direction
    if (player.direction === 'UP')    newhead.y -= SPEED
    if (player.direction === 'DOWN')  newhead.y += SPEED
    if (player.direction === 'LEFT')  newhead.x -= SPEED
    if (player.direction === 'RIGHT') newhead.x += SPEED

    //si la tete touche un mur
    if (newhead.x <= 0 || newhead.x >= MAP_SIZE.width || newhead.y <= 0 || newhead.y >= MAP_SIZE.height)
        return setDead(id)

    //je verifie s'il y a une collision avec un joueur
    for (const otherPlayer of Object.values(state.players)) {
        if (otherPlayer.id === id)
            continue

        if (findCollision(newhead, otherPlayer.body) !== -1)
            return setDead(id)
    }

    //si la tete touche de la nourriture je ne supprime pas le dernier segment du corp impression de +1
    const foodIndex = findFoodCollision(newhead, state.foods)
    if (foodIndex === -1)  // pas de nourriture
        player.body.pop()
    else 
    {
        const food = state.foods[foodIndex]
        if (food)
        {
            player.score += food.feed //ajt au score
            console.log(`Player ${id} ate food ${food.id} (+${food.feed})`)
            state.foods.splice(foodIndex, 1) //suprimer ce qui a ete manger
            state.foods.push(spawnFood(state)) //spawn une nouvelle            
        }
    }
    player.body.unshift(newhead) //ajouter la tete au debut de la liste 
    return true
}

// La game loop — appelée par server.ts
export function startGameLoop(makeAction: (state: Game) => void): void {
    setInterval(() => 
        {
        for (const player of Object.values(state.players)) 
        {
            if (player.alive)
                movePlayer(player.id)
        }
        makeAction(state)
    }, TICK_RATE)
}

export { state }

