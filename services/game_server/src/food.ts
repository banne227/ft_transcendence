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

//me permet de creer une instance food a la position souhaitee
function create_rest(x: number, y:number): Food{
	const id = FOOD_ID++

	return {
		id,
		x,
		y,
		feed: (id % 3) + 1,
		poop: true,
	}
}

//je fais spawn les rest du joueurs
export function spawnDead_rest(playerId: string): null {
	let player = state.players[playerId]
	if (!player)
		return null
	for (let idx = player?.body.length - 1; idx >= 0; idx-- )
	{
		if (idx % 4 !== 0) // je fais spawn 1/2
			continue
		let seg = player.body[idx]
		if (seg)
			state.foods.push(create_rest(seg?.x, seg?.y))
	}
	return null
}