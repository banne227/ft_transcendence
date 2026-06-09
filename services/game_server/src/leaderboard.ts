import {Player, Game} from './game'

export function update_leaderboard(state: Game): void {
	const players = Object.values(state.players)

	if (players.length === 0) return

	const leaderboard: Player[] = []

	for (let i = 0; i < players.length; i++) {
		let max: Player | undefined = undefined

		for (let j = 0; j < players.length; j++) {
			const player = players[j]

			if (!player || !player.alive || leaderboard.includes(player))
				continue

			if (!max || player.score > max.score) max = player
		}

		if (max) leaderboard.push(max)
	}
	state.leaderbord = leaderboard
}