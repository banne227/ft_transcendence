import {state} from '../src/game'

const { io } = require("socket.io-client");
const url = "https://127.0.0.1/ws/serv";

//la ou est-ce-que j'ecoute
const socket = io(url, {path: "/", transports: ["websocket"],});

console.log(`Start trying to connect to ${url}`);

socket.on("connect", () => {
	console.log("Connecté au serveur :", socket.id);

	socket.emit("join", "Banne");

	//setInterval(() => {
	    //socket.emit("direction", "UP");
	//}, 1000);
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
