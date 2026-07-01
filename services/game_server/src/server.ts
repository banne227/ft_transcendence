process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { state, startGameLoop, Vector } from './game'
import { addPlayer, removePlayer, setBoost } from './player'
import { sendMessage } from './chat'
import { updateDirMouse, updateDirArrow } from './movement'
import { changeSkin, register, login, callDecodeJWT } from './api'
import { extractJwt } from './utils'

const { join } = require('node:path')
const app = express() //gestion requete http
const httpServer = createServer(app) //socket.io pour la transmission client serv
const io = new Server(httpServer, {
	cors: { origin: '*' },
	path: '/socket.io/',
})

app.use('/leaderboard', express.static(join(__dirname, 'leaderboard')))

// Better docker stop handling by treated SIGTERM signals
// ref : https://docs.docker.com/reference/cli/docker/container/stop/
process.on('SIGTERM', function (code_signal_error) {
	process.exit(0)
})

//permet de verifier que le server est en place http://localhost:3000/health
app.get('/health', (_req, res) => {
	res.json({ status: 'ok' })
})

io.on('connection', (socket) => {
	socket.on('join', (name: string, token: string) => {
		// console.log(`${name} log with jwt: ${token}`)
		socket.emit('joined', { id: socket.id })
	})

	socket.on('addplayer', async (token: string) => {
		const res = await callDecodeJWT(token)
		const name = res.username	
		addPlayer(socket.id, name)
	})

	socket.on('direction', (dir: 'LEFT' | 'RIGHT') => {
		updateDirArrow(socket.id, dir)
	})

	socket.on('mouseMove', (vect: Vector) => {
		updateDirMouse(socket.id, vect)
	})

	socket.on('disconnect', () => {
		removePlayer(socket.id)
	})

	socket.on('boost', () => {
		setBoost(socket.id)
	})

	socket.on('chatMessage', (text: string, player: string) => {
		const timestamp = new Date()
		sendMessage(player, text, io, timestamp.toISOString())
	})

	socket.on('changecolor', (color: string) => {
		const player = state.players[socket.id]
		if (player) player.color = color
		socket.emit('asktoken')
		socket.on('gettoken', (token: string) => {
			if (token) changeSkin(token, color)
		})
	})

	socket.on(
		'register',
		async (username: string, password: string, email: string) => {
			const cookie = await register(username, email, password)
			if (cookie !== null) {
				let jwt = extractJwt(cookie)
				socket.emit('register?', {
					succes: true,
					token: jwt,
					username: username,
				})
			} else {
				socket.emit('register?', { success: false })
			}
		},
	)

	socket.on(
		'login',
		async (username: string, email: string, password: string) => {
			const res = await login(email, password)
			if (res !== null) {
				const jwt = extractJwt(res)
				socket.emit('connected?', {
					succes: true,
					token: jwt,
					username: username,
				})
			} else socket.emit('connected?', { success: false })
		},
	)
})

startGameLoop((state) => {
	io.emit('gameState', state)
})

//message envoyer quand le server est pret
httpServer.listen(3000, () => {
	console.log(
		`Serveur sur https://transcendence.42.fr or http://game:3000 (in the container network)`,
	)
})
