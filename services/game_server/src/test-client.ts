const { io } = require("socket.io-client");

//la ou est-ce-que j'ecoute
const socket = io("https://127.0.0.1/ws/serv");

console.log("HERE");

socket.on("connect", () => {
	console.log("Connecté au serveur :", socket.id);

	socket.emit("join", "Banne");

	//setInterval(() => {
	//    socket.emit("direction", "UP");
	//}, 1000);
});

socket.on("joined", (data) => {
	console.log("Réponse joined :", data);
});

socket.on("gameState", (state) => {
	console.log(state.players[socket.id].body, "\n");
});

socket.on("disconnect", () => {
	console.log("Déconnecté");
});
