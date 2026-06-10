process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { state } from "../src/game";

const { io } = require("socket.io-client");
// const url = "http://127.0.0.1:3000";
const url = "https://127.0.0.1/ws/serv/";

//la ou est-ce-que j'ecoute
const socket = io(url);

console.log(`Start trying to connect to ${url}`);

socket.on("connect", () => {
	console.log("Connecté au serveur :", socket.id);

	socket.emit("join", "Banne");

	//setInterval(() => {
	    //socket.emit("direction", "UP");
	//}, 1000);
});

socket.on("connect_error", (err: any) => {
	// the reason of the error, for example "xhr poll error"
	console.log(`Failed to connect to ${url}`);
	console.log(err.message);

	// some additional description, for example the status code of the initial HTTP response
	console.log(err.description);

	// some additional context, for example the XMLHttpRequest object
	console.log(err.context);
});

socket.on("joined", (data: any) => {
	console.log("Réponse joined :", data);
});

socket.on("gameState", (state: any) => {
	console.log(state.players[socket.id].body, "\n");
});

socket.on("disconnect", () => {
	console.log("Déconnecté");
});
