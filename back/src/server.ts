import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { addPlayer, removePlayer, setDirection, startGameLoop } from './game'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, { cors: { origin: '*' } })

app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
})

io.on('connection', (socket) => {
    console.log('Connecté :', socket.id)

    socket.on('join', (name: string) => {
        addPlayer(socket.id, name)
        socket.emit('joined', { id: socket.id })
        console.log(name, 'a rejoint')
    })

    socket.on('direction', (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
        setDirection(socket.id, dir)
    })

    socket.on('disconnect', () => {
        removePlayer(socket.id)
        console.log('Déconnecté :', socket.id)
    })
})

startGameLoop((state) => {
    io.emit('gameState', state)
})

httpServer.listen(3000, () => {
    console.log('Serveur sur http://localhost:3000')
})