import { state, Segment, Player, Food , MAP_SIZE} from './game'
import { spawnFood } from './food'

const SPEED = 5

//creation d'un joueur ! il faudra check si le pseudo existe deja sinon je l'ecrase
// export = fonction public qui peut etre reutiliser en dehors du fichier
export function addPlayer(id: string, name: string): void{
	console.log(`Player ${name} join`)
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
		score: 5,
		direction: 'RIGHT',
		boost: false,
		width: 1,
		popTail: 0
	}
}

export function update_width(id: string): void{
	if (state.players[id] && state.players[id].alive)
		state.players[id].width = state.players[id].score / 10
}

function setDead(id: string): boolean {
	const player = state.players[id]
	if (!player)
		return false

	player.alive = false
	console.log(`Player ${state.players[id]?.name} died`)
	return false
}

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
	console.log(`Bye ${state.players[id]?.name}`)
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
	let distance = 25
	return foods.findIndex(food =>
		Math.abs(food.x - head.x) < distance &&
		Math.abs(food.y - head.y) < distance
	)
}

export function setBoost(id: string): void{
	if (state.players[id])
	{
		if (state.players[id].score <= 0 || state.players[id].body.length <= 1)
		{
			console.log(`player ${id} can't speed up`)
			return
		}	
		state.players[id].boost = true
	}
}

export function unsetBoost(id: string): void{
	if (state.players[id])
		state.players[id].boost = false
}

export function dropPoop(id: string): void {
	if (state.players[id] && state.players[id].alive)
	{
		let player = state.players[id]
		player.popTail += 1
		if (player.popTail % 3 === 0)
		{
			state.foods.push(spawnFood(true, id))
			player.body.pop()
			player.score -= 1
			update_width(id)
		}
	}
}

export function movePlayer(id: string): boolean {
	const player = state.players[id]
	if (!player)
		return false

	//copie de la tete actuel
	const head = player.body[0]
	if (!head) return false
	const newhead: Segment = { x: head.x, y: head.y }

	let speed = player.boost ? SPEED * 10 : SPEED
	// Déplacer selon la direction
	if (player.direction === 'UP')    newhead.y -= speed
	if (player.direction === 'DOWN')  newhead.y += speed
	if (player.direction === 'LEFT')  newhead.x -= speed
	if (player.direction === 'RIGHT') newhead.x += speed

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
			// console.log(`Player ${id} ate food ${food.id} (+${food.feed})`)
			if (!state.foods[foodIndex]?.poop)
				state.foods.push(spawnFood(false, null)) //spawn une nouvelle
			state.foods.splice(foodIndex, 1) //suprimer ce qui a ete manger
		}
	}
	player.body.unshift(newhead) //ajouter la tete au debut de la liste
	return true
}
