import { movePlayer, dropPoop, update_width } from "./player";
import { displayState } from "./utils";
import { spawnFood } from "./food";
import { update_leaderboard } from "./leaderboard";

export const MAP_SIZE = { width: 2000, height: 2000 };
const TICK_RATE = 50; // on met à jour le jeu toutes les 50ms = 20 fois/seconde

//partie du serpent juste des positions
export interface Segment {
	x: number;
	y: number;
}

export interface Player {
	id: string;
	name: string;
	body: Segment[]; //body[0] == tete du serpent
	alive: boolean;
	score: number;
	direction: "UP" | "DOWN" | "LEFT" | "RIGHT";
	boost: boolean;
	width: number;
}

export interface Food {
	id: number;
	x: number;
	y: number;
	feed: number;
}

export interface Game {
	players: Record<string, Player>; //liste de tous mes joueurs par id
	foods: Food[]; //liste de la nouriture
	leaderbord: Player[]; //liste trier de jouer par score
	mapSize: { width: number; height: number };
}

//===init du jeu
let state: Game = {
	players: {},
	leaderbord: [],
	foods: [],
	mapSize: MAP_SIZE,
};

//creation de 100 nourritures au lancement
for (let i = 0; i < 100; i++) {
	state.foods.push(spawnFood(false));
}

// La game loop — appelée par server.ts
export function startGameLoop(makeAction: (state: Game) => void): void {
	setInterval(() => {
		for (const player of Object.values(state.players)) {
			if (player.alive) {
				if (player.boost) dropPoop(player.id);
				movePlayer(player.id);
				update_width(player.id);
			}
		}
		update_leaderboard(state);
		makeAction(state);
	}, TICK_RATE);
}

for (const food of state.foods) {
	console.log(food.x, food.y, food.feed);
}

export { state };
