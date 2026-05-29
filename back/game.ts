/*
 * Author: banne
 * File: game.ts
 * Created: 2026-05-30
*/

const MAP_SIZE = { width: 2000, height: 2000 }
const TICK_RATE = 50   // on met à jour le jeu toutes les 50ms = 20 fois/seconde
const SPEED = 5

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
    id: string
    x: number
    y: number
}

interface Game{
    players: Record<string, Player> //liste de tous mes joueurs par id
    foods: Food[] //liste de la nouriture
    mapSize: { width: number, height: number }
}