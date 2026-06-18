import {Food, MAP_SIZE, state} from './game'

let FOOD_ID = 0

export function spawnFood(poop: boolean, playerId: string | null): Food {
	const id = FOOD_ID++

	let x = Math.floor(Math.random() * (MAP_SIZE.width - 100)) + 50
	let y = Math.floor(Math.random() * (MAP_SIZE.height - 100)) + 50

	if (poop && playerId) {
		const player = state.players[playerId]
		if (player) 
		{
			const tail = player.body[player.body.length - 1]
			if (tail) 
			{
				x = tail.x
				y = tail.y
			}
		}
	}

	return {
		id,
		x,
		y,
		feed: poop ? 1 : (id % 5) + 1,
		poop,
	}
}