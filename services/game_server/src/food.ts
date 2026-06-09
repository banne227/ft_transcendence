import {Food, MAP_SIZE} from './game'

let FOOD_ID = 0

export function spawnFood(poop: boolean): Food {
	const id = FOOD_ID++
	let x = Math.floor(Math.random() * (MAP_SIZE.width - 100)) + 50
	let y = Math.floor(Math.random() * (MAP_SIZE.height - 100)) + 50
	if (poop) return { id, x, y, feed: 1 }
	return { id, x, y, feed: (id % 5) + 1 }
}
