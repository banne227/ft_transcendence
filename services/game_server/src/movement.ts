import { state, Segment, Player, Food , MAP_SIZE, Vector} from './game'
import {setDead, findCollision, findFoodCollision} from './player'
import { spawnFood } from './food'
import { rotate, MAX_TURN_RATE, addAngleToVect } from './rotation'

const SPEED = 5

//Pour avoir un vecteur avec des nombre toujours entre 0 et 1
function normalize(vect: Vector): Vector {
    const len = Math.sqrt(vect.x * vect.x + vect.y * vect.y)
    if (len === 0) return { x: 0, y: 0 }
    return { 
        x: vect.x / len, 
        y: vect.y / len }
}

function getDirectionToMouse(id: string, mousePos: Vector): Vector | undefined {
    let headPos = state.players[id]?.body[0]
    if (headPos)
    {
        return normalize({
            x: mousePos.x - headPos.x,
            y: mousePos.y - headPos.y
        })
    }
}

export function updateDirArrow(id: string, dir: string): void
{
    let player = state.players[id]
    if (dir && player)
    {
		if (dir === "LEFT")
			player.direction = addAngleToVect(player.direction, -MAX_TURN_RATE)
		else
			player.direction = addAngleToVect(player.direction, MAX_TURN_RATE)
	}
}

export function updateDirMouse(id: string, mousePos: Vector): void
{
    let vect = getDirectionToMouse(id, mousePos)
    let player = state.players[id]
    if (vect && player)
        player.direction = rotate(player.direction, vect, MAX_TURN_RATE)
}


function moveHead(player: Player,  speed: number): Segment | undefined{
    if (player && player.body[0])
    {
        return {
            x: player.body[0].x + player.direction.x * speed ,
            y: player.body[0].y + player.direction.y * speed 
        }
    }
}

export function movePlayer(id: string): boolean {
	const player = state.players[id]
	if (!player)
		return false

	let speed = player.boost ? SPEED * 2 : SPEED
	// Déplacer selon la direction
    const newhead = moveHead(player, speed)
    if (!newhead) return (false)

	//si la tete touche un mur
	if (newhead.x <= 0 || newhead.x >= MAP_SIZE.width || newhead.y <= 0 || newhead.y >= MAP_SIZE.height)
		return setDead(id)

	//je verifie s'il y a une collision avec un joueur
	for (const otherPlayer of Object.values(state.players)) {
		if (otherPlayer.id === id || !otherPlayer.alive)
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
