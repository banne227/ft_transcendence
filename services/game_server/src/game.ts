import { movePlayer, dropPoop } from './player'


export const MAP_SIZE = { width: 2000, height: 2000 }
const TICK_RATE = 200   // on met à jour le jeu toutes les 50ms = 20 fois/seconde
let FOOD_ID = 0


//=======    object pour le jeu

//partie du serpent juste des positions
export interface Segment{
    x: number
    y: number
}

export interface Player{
    id: string
    name: string
    body: Segment[] //body[0] == tete du serpent
    alive: boolean
    score: number
    direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
    boost: boolean
}

export interface Food{
    id: number
    x: number
    y: number
    feed: number
}

interface Game{
    players: Record<string, Player> //liste de tous mes joueurs par id
    foods: Food[] //liste de la nouriture
    leaderbord: Player[] //liste trier de jouer par score
    mapSize: { width: number, height: number }
}


//=fonctions utils
export function spawnFood(poop: boolean): Food{
    const id = FOOD_ID++
    let x = Math.floor(Math.random() * (MAP_SIZE.width - 100)) + 50
    let y = Math.floor(Math.random() * (MAP_SIZE.height - 100)) + 50
    if (poop)
        return {id, x, y, feed: 1}
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

function update_leaderboard(state: Game): void {
    const players = Object.values(state.players);

    if (players.length === 0)
        return;

    const leaderboard: Player[] = [];

    for (let i = 0; i < players.length; i++) 
    {
        let max: Player | undefined = undefined;

        for (let j = 0; j < players.length; j++) {
            const player = players[j];
    
            if (!player || !player.alive || leaderboard.includes(player))
                continue;
    
            if (!max || player.score > max.score)
                max = player;
        }

        if (max)
            leaderboard.push(max);
    }
    state.leaderbord = leaderboard;
}

//===init du jeu
let state: Game = {
    players: {},
    leaderbord: [],
    foods: [],
    mapSize: MAP_SIZE
}

//creation de 100 nourritures au lancement
for (let i = 0; i < 100; i++)
{
    state.foods.push(spawnFood(false))
}

// La game loop — appelée par server.ts
export function startGameLoop(makeAction: (state: Game) => void): void {
    setInterval(() => 
        {
        for (const player of Object.values(state.players)) 
        {
            if (player.alive)
            {
                if (player.boost)
                    dropPoop(player.id)
                movePlayer(player.id)
            }
        }
        update_leaderboard(state)
        makeAction(state)
    }, TICK_RATE)
}

export { state }

