process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { startGameLoop, Vector } from "./game";
// import User from "./models/user";
import {updateDirMouse, updateDirArrow} from "./movement"
import {
	addPlayer,
	removePlayer,
	setBoost,
	unsetBoost,
} from "./player";

const { join } = require('node:path');
const app = express(); //gestion requete http
const httpServer = createServer(app); //socket.io pour la transmission client serv
const io = new Server(httpServer, {
	cors: { origin: "*" },
});

app.use('/leaderboard', express.static(join(__dirname, 'leaderboard')));

// Better docker stop handling by treated SIGTERM signals
// ref : https://docs.docker.com/reference/cli/docker/container/stop/
process.on("SIGTERM", function (code_signal_error) {
	process.exit(0);
});

//permet de verifier que le server est en place http://localhost:3000/health
app.get("/health", (_req, res) => {
	res.json({ status: "ok" });
});

app.get('/lead', (req, res) => {
	console.log(join(__dirname, 'leaderboard', 'lead.html'));
	res.sendFile(join(__dirname, 'leaderboard', 'lead.html'));
});

app.get('/leadrrr', (req, res) => {
	console.log(join(__dirname, 'leaderboard', 'lead.html'));
	res.sendFile(join(__dirname, 'leaderboard', 'lead.js'));
});

io.on("connection", (socket) => {
	console.log("Connecté :", socket.id);

	socket.on("join", async (name: string) => {
		// const user = await User.findOne({name})
		// if (!user) {
		// 	socket.emit("join_error", "Utilisateur introuvable");
		// 	addPlayer(socket.id, socket.id);
		// 	return;
		// }

		socket.data.username = name;
		addPlayer(socket.id, name);
		socket.emit("joined", { name });
	});

	socket.on("direction", (dir: "LEFT" | "RIGHT") => {
		console.log(`turn ${dir} so ${dir}`)
		updateDirArrow(socket.id, dir);
	});

	socket.on("mouseMove", (vect: Vector) => {
		updateDirMouse(socket.id, vect)
	});

	socket.on("disconnect", () => {
		console.log(`${socket.id} left serv`); // log l'id AVANT de supprimer
		removePlayer(socket.id);
	});

	socket.on("boost", () => {
		console.log(`${socket.id} speed up`);
		setBoost(socket.id);
	});

	socket.on("stop_boost", (id: string) => {
		unsetBoost(id);
	});
});

startGameLoop((state) => {
	io.emit("gameState", state);
});

//message envoyer quand le server est pret
httpServer.listen(3000, () => {
	console.log(
		`Serveur sur https://transcendence.42.fr or http://game:3000 (in the container network)`,
	);
});
