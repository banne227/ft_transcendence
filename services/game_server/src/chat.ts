import { state } from './game'
import { Server } from 'socket.io'

export interface Message {
    id: string
    name: string
	text: string | null
    hour: string
}

export function sendMessage(id: string, text: string, io: Server, date: string): void{
    const player = state.players[id]
    const message = {
        id: player?.id,
        name: player?.name,
        text: null,
        hour: date 
    }

    // Envoi à tous les joueurs
    io.emit("chatMessage", message);
}

export function receiveChat(message: Message): void{
    const time = new Date(message.hour).toLocaleString("fr-FR", {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit"
    });

    
}