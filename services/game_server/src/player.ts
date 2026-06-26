import { state, Segment, Food, MAP_SIZE } from './game'
import { spawnFood, spawnDead_rest } from './food'
import { addScore, changeSkin } from './api'

export function addPlayer(id: string, name: string): void {
    console.log(`Player ${name} join`)
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
        score: 5,
        direction: { x: 0, y: -1 },
        desiredDirection: { x: 0, y: -1 },
        boost: false,
        boost_time: 0,
        width: 1,
        popTail: 0,
        color: `hsl(0, 0%, 100%)`
    }
}

export function update_width(id: string): void {
    if (state.players[id] && state.players[id].alive)
        state.players[id].width = 10 + state.players[id].body.length / 10
}

export function setDead(id: string): boolean {
    const player = state.players[id]
    if (!player)
        return false
    player.alive = false
    console.log(`Player ${state.players[id]?.name} died`)
    addScore(id, player.score)
    spawnDead_rest(id)
    // changeSkin()
    return false
}

export function removePlayer(id: string): void {
    console.log(`Bye ${state.players[id]?.name}`)
    if (state.players[id])
        delete state.players[id]
}

// permet de regarder si la tete du joueur entre en collision avec un joueur
export function findCollision(head: Segment, segments: Segment[], hitbox1: number, hitbox2: number): number {
    let distance = hitbox1 + hitbox2
    return segments.findIndex(segment =>
        Math.abs(segment.x - head.x) < distance &&
        Math.abs(segment.y - head.y) < distance
    )
}

// collision entre une tête et la nourriture
export function findFoodCollision(head: Segment, foods: Food[], hitbox: number): number {
    let distance = hitbox + 5
    return foods.findIndex(food =>
        Math.abs(food.x - head.x) < distance &&
        Math.abs(food.y - head.y) < distance
    )
}

export function setBoost(id: string): void {
    if (state.players[id]) {
        if (state.players[id].score <= 0 || state.players[id].body.length <= 4) {
            console.log(`player ${id} can't speed up`)
            return
        }
        state.players[id].boost_time = 0
        state.players[id].boost = true
    }
}

export function unsetBoost(id: string): void {
    if (state.players[id])
        state.players[id].boost = false
}

export function dropPoop(id: string): void {
    if (state.players[id] && state.players[id].alive) {
        let player = state.players[id]
        player.popTail += 1
        if (player.popTail % 8 === 0) {
            state.foods.push(spawnFood(true, id))
            player.body.pop()
            player.score -= 1
            update_width(id)
        }
    }
}