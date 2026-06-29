process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { state, startGameLoop, Vector} from './game'
import { addPlayer, removePlayer, setBoost } from './player'
import { sendMessage } from './chat'
import { updateDirMouse, updateDirArrow } from './movement'
import { changeSkin, register, login} from './api'
import { extractJwt } from './utils'

const { join } = require("node:path");
const app = express(); //gestion requete http
const httpServer = createServer(app); //socket.io pour la transmission client serv
const io = new Server(httpServer, {
	cors: { origin: "*" },
	path: "/socket.io/",
});

app.use("/leaderboard", express.static(join(__dirname, "leaderboard")));

// Better docker stop handling by treated SIGTERM signals
// ref : https://docs.docker.com/reference/cli/docker/container/stop/
process.on("SIGTERM", function (code_signal_error) {
	process.exit(0);
});

//permet de verifier que le server est en place http://localhost:3000/health
app.get("/health", (_req, res) => {
	res.json({ status: "ok" });
});

app.get("/lead", (req, res) => {
	console.log(join(__dirname, "leaderboard", "lead.html"));
	res.sendFile(join(__dirname, "leaderboard", "lead.html"));
});

app.get("/leadrrr", (req, res) => {
	console.log(join(__dirname, "leaderboard", "lead.html"));
	res.sendFile(join(__dirname, "leaderboard", "lead.js"));
});

io.on("connection", (socket) => {
	console.log("Connecté :", socket.id);

	socket.on('join', (name: string) => {
		addPlayer(socket.id, name)
		socket.emit('joined', { id: socket.id })
	})

	socket.on('addplayer', (name: string) => {
		addPlayer(socket.id, name)
	})

	socket.on('direction', (dir: 'LEFT' | 'RIGHT') => {
		console.log(`turn ${dir} so ${dir}`)
		updateDirArrow(socket.id, dir)
	})

	socket.on('mouseMove', (vect: Vector) => {
		updateDirMouse(socket.id, vect)
	})

	socket.on('disconnect', () => {
		console.log(`${socket.id} left serv`) // log l'id AVANT de supprimer
		removePlayer(socket.id)
	})

	socket.on('boost', () => {
		console.log(`${socket.id} speed up`)
		setBoost(socket.id)
	})

	socket.on("chatMessage", (text : string) => {
		const timestamp = new Date()
		sendMessage(socket.id, text, io, timestamp.toISOString())
	});

	socket.on("direction", (dir: "LEFT" | "RIGHT") => {
		console.log(`turn ${dir} so ${dir}`);
		updateDirArrow(socket.id, dir);
	});

	socket.on("mouseMove", (vect: Vector) => {
		updateDirMouse(socket.id, vect);
	});

	socket.on("disconnect", () => {
		console.log(`${socket.id} left serv`); // log l'id AVANT de supprimer
		removePlayer(socket.id);
	});

	socket.on("boost", () => {
		console.log(`${socket.id} speed up`);
		setBoost(socket.id);
	});

	socket.on("chatMessage", (text: string) => {
		const timestamp = new Date();
		sendMessage(socket.id, text, io, timestamp.toISOString());
	});

	socket.on("changecolor", (color: string) => {
		const player = state.players[socket.id];
		if (player) player.color = color;
		socket.emit("asktoken");
		socket.on("gettoken", (token: string) => {
			if (token) changeSkin(token, color);
		});
	});

	socket.on("register", async (username: string,password: string,email: string) =>{
		console.log(`register emit received`);
		const cookie = await register(username, email, password)
		console.log('HERE', cookie)
		if (cookie !== null){
			console.log('enter in here')
			let jwt = extractJwt(cookie)
			console.log("cookie: ", jwt)
			console.log(`register? emit send succes`);
			socket.emit("register?", {succes: true, token:jwt, username:username})
		}
		else 
		{
			socket.emit("register?", { success: false });
		}
	});

	socket.on("login", async (username:string ,password:string ) =>{
		const res = await login(username, password)
		if (res !== null){
			const jwt = res.cookie
			socket.emit("connected?", {succes: true, token:jwt, username:username})
		}
		else socket.emit("connected?", { success: false });
	})
})

startGameLoop((state) => {
	io.emit("gameState", state);
});

//message envoyer quand le server est pret
httpServer.listen(3000, () => {
	console.log(
		`Serveur sur https://transcendence.42.fr or http://game:3000 (in the container network)`,
	);
});
