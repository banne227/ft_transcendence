import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { startGameLoop } from "./game";
import {
	addPlayer,
	removePlayer,
	setDirection,
	setBoost,
	unsetBoost,
} from "./player";

const app = express(); //gestion requete http
const httpServer = createServer(app); //socket.io pour la transmission client serv
const io = new Server(httpServer, { cors: { origin: "*" } });

// Better docker stop handling by treated SIGTERM signals
// ref : https://docs.docker.com/reference/cli/docker/container/stop/
process.on("SIGTERM", function (code_signal_error) {
	process.exit(0);
});

//permet de verifier que le server est en place http://localhost:3000/health
app.get("/health", (_req, res) => {
	res.json({ status: "ok" });
});

io.on("connection", (socket) => {
	console.log("Connecté :", socket.id);

	socket.on("join", (name: string) => {
		addPlayer(socket.id, name);
		socket.emit("joined", { id: socket.id });
	});

	socket.on("direction", (dir: "UP" | "DOWN" | "LEFT" | "RIGHT") => {
		setDirection(socket.id, dir);
	});

	socket.on("disconnect", () => {
		removePlayer(socket.id);
	});

	socket.on("boost", (id: string) => {
		setBoost(id);
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
		`Serveur sur https://127.0.0.1/ws/serv or http://game:3000 (in the container network)`,
	);
});
