import { dropPoop, update_width } from './player'
import { movePlayer } from './movement'
import { spawnFood } from './food'
import { update_leaderboard } from './leaderboard'

export const MAP_SIZE = { width: 2500, height: 2500 }
const TICK_RATE = 20 // on met à jour le jeu toutes les 50ms = 20 fois/seconde

//partie du serpent juste des positions
export interface Segment {
	x: number
	y: number
}

export interface Vector {
	x: number
	y: number
}
export interface Player {
	id: string
	name: string
	body: Segment[] //body[0] == tete du serpent
	alive: boolean
	score: number
	direction: Vector
	desiredDirection: Vector
	boost: boolean
	boost_time: number
	width: number
	popTail: number
	color: string
}

export interface Food {
	id: number
	x: number
	y: number
	feed: number
	poop: boolean
}

export interface Game {
	players: Record<string, Player> //liste de tous mes joueurs par id
	foods: Food[] //liste de la nouriture
	leaderbord: Player[] //liste trier de jouer par score
	mapSize: { width: number; height: number }
}

//===init du jeu
let state: Game = {
	players: {},
	leaderbord: [],
	foods: [],
	mapSize: MAP_SIZE,
}

//creation de 100 nourritures au lancement
for (let i = 0; i < 280; i++) {
	state.foods.push(spawnFood(false, null))
}

// La game loop — appelée par server.ts
export function startGameLoop(makeAction: (state: Game) => void): void {
	setInterval(() => {
		for (const player of Object.values(state.players)) {
			if (player.alive) {
				if (player.boost) {
					dropPoop(player.id)
					player.boost_time += 1
					if (
						player.boost_time >= 8
					) //le boost reste actif pendant 5 tick
					{
						player.boost = false
						player.boost_time = 0
					}
				}
				movePlayer(player.id)
				update_width(player.id)
			}
		}
		update_leaderboard(state)
		makeAction(state)
	}, TICK_RATE)
}

export { state }
