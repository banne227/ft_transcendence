const socket = io("http://127.0.0.1:3000/");
const output = document.getElementById("output");

// const socket = io("http://127.0.0.1:3000/");

// const output = document.getElementById("output");
// const feur = document.getElementById("feur");
// function showChar(e) {
//   output.textContent = `Key KeyDown: "${e.key}"
// CTRL key KeyDown: ${e.ctrlKey}
// `;
// }

// document.addEventListener("keydown", showChar);

// addEventListener('keydown', function(e) {
//   if (e.key === 'ArrowUp') {
//     socket.emit('direction', 'UP')
//   }
//   if (e.key === 'ArrowDown') {
//     socket.emit('direction', 'DOWN')
//     socket.emit("join", "aori");
//   }
//   if (e.key === 'ArrowLeft') {
//     socket.emit('direction', 'LEFT')
//   }
//   if (e.key === 'ArrowRight') {
//     socket.emit('direction', 'RIGHT')
//   }
// });

// // socket.on("joined", (data) => {
// // 	console.log("Réponse joined :", data);
// // });

// socket.on("disconnect", () => {
// 	console.log("Déconnecté");
// });

function showChar(e) {
	output.textContent = `Key KeyDown: "${e.key}" CTRL key KeyDown: ${e.ctrlKey}`;
}
document.addEventListener("keydown", showChar);

addEventListener("keydown", function (e) {
	let identif;
	if (e.key === "ArrowUp") socket.emit("direction", "UP");
	if (e.key === "ArrowDown") socket.emit("direction", "DOWN");
	if (e.key === "ArrowLeft") socket.emit("direction", "LEFT");
	if (e.key === "ArrowRight") socket.emit("direction", "RIGHT");
	if (e.key === "Enter") {
		socket.emit("join", "aori");
		socket.on("joined", (id) => (identif = id));
	}
	if (e.key === "b") socket.emit("boost", identif);
});

// socket.on("joined", (data) => {
//   console.log("Réponse joined :", data);
// });

socket.on("gameState", (state) => {
	const me = state.players[socket.id];
	if (!me) return;
	console.log(me.body, "\n");
});

// socket.on("disconnect", () => {
//   console.log("Déconnecté");
// });

// ── Ton code de rendu après ici ──────────────────────────────────

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

let gameState = null;

// socket.on("connect", () => {
//   console.log("Connecté :", socket.id);
// });

socket.on("gameState", (state) => {
	gameState = state;
});

function resize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

function render() {
	requestAnimationFrame(render);
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	if (!gameState) return;

	const scaleX = canvas.width / 2000;
	const scaleY = canvas.height / 2000;

	for (const food of gameState.foods) {
		const x = food.x * scaleX;
		const y = food.y * scaleY;
		const r = 4 + food.feed;
		const hue = 120 - (food.feed - 1) * 24;
		ctx.beginPath();
		ctx.arc(x, y, r, 0, Math.PI * 2);
		ctx.fillStyle = `hsl(${hue}, 80%, 50%)`;
		ctx.fill();
	}
	render_p();
}

window.addEventListener("resize", resize);
resize();

function render_p() {
	const scaleX = canvas.width / 2000;
	const scaleY = canvas.height / 2000;

	for (const player of Object.values(gameState.players)) {
		if (!player.alive) continue;

		for (const segment of player.body) {
			const x = segment.x * scaleX;
			const y = segment.y * scaleY;

			ctx.beginPath();
			ctx.arc(x, y, 5, 0, Math.PI * 2);
			ctx.fillStyle = `hsl(120, 80%, 50%)`;
			ctx.fill();
		}
	}
}

if (gameState) {
	console.log(gameState.players.x, gameState.players.y, "\n");
	render_p();
}

render();
