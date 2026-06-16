import {Game} from './game'

export function displayState(state: Game): void {
	console.log('--- tick ---')
	for (const player of Object.values(state.players)) {
		const head = player.body && player.body[0]
		const headStr = head ? `(${head.x},${head.y})` : '(no-head)'
		console.log(
			`${player.id} ${player.name} alive=${player.alive} score=${player.score} head=${headStr} len=${player.body.length}`,
		)
	}
}