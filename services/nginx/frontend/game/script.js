const socket = io("http://127.0.0.1:3000/");
// const socket = io();
const output = document.getElementById("output");

function showChar(e) {
	output.textContent = `Key KeyDown: "${e.key}" CTRL key KeyDown: ${e.ctrlKey}`;
}
document.addEventListener("keydown", showChar);

addEventListener("keydown", function (e) {
	if (e.key === "ArrowUp") socket.emit("direction", "UP");
	if (e.key === "ArrowDown") socket.emit("direction", "DOWN");
	if (e.key === "ArrowLeft") socket.emit("direction", "LEFT");
	if (e.key === "ArrowRight") socket.emit("direction", "RIGHT");
	if (e.key === "Enter") {
		socket.emit("join", socket.id);
		socket.on("joined");
	}
	if (e.key === "b") socket.emit("boost");
});

// socket.on("joined", (data) => {
//   console.log("Réponse joined :", data);
// });

socket.on("gameState", (state) => {
	const me = state.players[socket.id];
	if (!me) return;
	// console.log(me.body, "\n");
});

// socket.on("disconnect", () => {
//   console.log("Déconnecté");
// });

// ── Ton code de rendu après ici ──────────────────────────────────

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseScreenX = e.clientX - rect.left;
    const mouseScreenY = e.clientY - rect.top;

    // conversion écran -> monde (inverse du scale utilisé pour le rendu)
    const scaleX = canvas.width / 2000;
    const scaleY = canvas.height / 2000;

    const mouseWorldX = mouseScreenX / scaleX;
    const mouseWorldY = mouseScreenY / scaleY;

    socket.emit("mouseMove", { x: mouseWorldX, y: mouseWorldY });
});

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

const brushImg = new Image();
brushImg.src = '../images/brush.png';

function render_p() {
	const scaleX = canvas.width / 2000;
	const scaleY = canvas.height / 2000;
	var i = 0;

	for (const player of Object.values(gameState.players)) {
		if (!player.alive) continue;
		i = 0;
		for (const segment of player.body) {
			const x = segment.x * scaleX;
			const y = segment.y * scaleY;

			if (i == 0)
			{
				ctx.drawImage(brushImg, x - 10, y - 10, 20, 20);
				// ctx.beginPath();
				// ctx.arc(x, y, 5, 0, Math.PI * 2);
				// ctx.fillStyle =`hsl(244, 95%, 22%)`;
				// ctx.fill();
			}
			else
			{
				ctx.fillStyle = `hsl(286,100%,73%)`;
				ctx.fillRect(x - 5, y - 5, 10, 10);
				//ctx.beginPath();
				//ctx.arc(x, y, 5, 0, Math.PI * 2);
				//ctx.fillStyle = `hsl(286,100%,73%)`;
				//ctx.fill();
			}
			i++;
		}
	}
}

if (gameState) {
	console.log(gameState.players.x, gameState.players.y, "\n");
	render_p();
}

render();
