const socket = io("http://127.0.0.1:3000/");
// const socket = io();
const output = document.getElementById("output");

function showChar(e) {
	output.textContent = `Key KeyDown: "${e.key}" CTRL key KeyDown: ${e.ctrlKey}`;
}
document.addEventListener("keydown", showChar);

function joinGame() {
	const username = document.getElementById("username").value;
	socket.emit("join", username);

	socket.on("join_success", (data) => {
		console.log("Connecté en tant que", data.username);
	});

	socket.on("join_error", (message) => {
		console.log("Erreur:", message);
	});
}

addEventListener("keydown", function (e) {
	if (e.key === "ArrowUp") socket.emit("direction", "UP");
	if (e.key === "ArrowDown") socket.emit("direction", "DOWN");
	if (e.key === "ArrowLeft") socket.emit("direction", "LEFT");
	if (e.key === "ArrowRight") socket.emit("direction", "RIGHT");
	if (e.key === "Enter") {
		// joinGame()
		socket.emit("join", socket.id);
		socket.on("joined");
		document.getElementById("start-msg").style.display = "none";
	}
	if (e.key === "Escape") {
		// socket.disconnect();
		window.location.href = "https://transcendence.42.fr/hub";
	}
	if (e.key === "b") {
		socket.emit("boost");
		document.getElementById("hud-boost").textContent = "on";
	}
});

// socket.on("joined", (data) => {
//   console.log("Réponse joined :", data);
// });

socket.on("gameState", (state) => {
	const me = state.players[socket.id];
	if (!me) return;
<<<<<<< HEAD

	document.getElementById("hud-len").textContent = me.body.length;
	document.getElementById("hud-pos").textContent = `X:${Math.round(me.body[0].x - 2000)} Y:${Math.round(me.body[0].y - 2000)}`;
	// console.log(me.body, "\n");


	// Minimap : monde 0-4000 → SVG 0-118 x 0-90
	const minimapDot = document.getElementById("minimap-me");
	if (minimapDot && me.body.length) {
		const mx = (me.body[0].x / 4000) * 118;
		const my = (me.body[0].y / 4000) * 90;
		minimapDot.setAttribute("cx", mx);
		minimapDot.setAttribute("cy", my);
	}

=======
	console.log(me.body, "\n");
>>>>>>> parent of 27172a8 (Merge pull request #8 from banne227/banne)
});

// socket.on("disconnect", () => {
//   console.log("Déconnecté");
// });

// ── Ton code de rendu après ici ──────────────────────────────────

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

<<<<<<< HEAD
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

=======
>>>>>>> parent of 27172a8 (Merge pull request #8 from banne227/banne)
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
	ctx.fillStyle = "#2020d2";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	if (!gameState) return;

	const scaleX = canvas.width / 2000;
	const scaleY = canvas.height / 2000;
	document.getElementById("hud-boost").textContent = "off";

	// position de la tête de MON joueur, utilisée pour centrer la caméra
	const me = gameState.players[socket.id];
	const camX = me && me.body.length ? me.body[0].x : 1000;
	const camY = me && me.body.length ? me.body[0].y : 1000;

	//for (const food of gameState.foods) {
	//	const x = (food.x - camX) * scaleX + canvas.width / 2;
	//	const y = (food.y - camY) * scaleY + canvas.height / 2;
	//	const r = 4 + food.feed;
	//	const hue = 120 - (food.feed - 1) * 24;
	//	ctx.beginPath();
	//	ctx.arc(x, y, r, 0, Math.PI * 2);
	//	ctx.fillStyle = `hsl(${hue}, 80%, 50%)`;
	//	ctx.fill();
	//}
	for (const food of gameState.foods) {
		const x = (food.x - camX) * scaleX + canvas.width / 2;
		const y = (food.y - camY) * scaleY + canvas.height / 2;
		const r = 4 + food.feed;
		ctx.beginPath();
		ctx.arc(x, y, r, 0, Math.PI * 2);
		ctx.fillStyle = "#aaffaa";
		ctx.fill();
	}
	render_p(camX, camY, scaleX, scaleY);
}

window.addEventListener("resize", resize);
resize();

const brushImg = new Image();
brushImg.src = '../images/brush.png';

function render_p(camX, camY, scaleX, scaleY) {
	var i = 0;

	for (const player of Object.values(gameState.players)) {
		if (!player.alive) continue;
		i = 0;
		for (const segment of player.body) {
			const x = (segment.x - camX) * scaleX + canvas.width / 2;
			const y = (segment.y - camY) * scaleY + canvas.height / 2;

			if (i == 0) {
				ctx.drawImage(brushImg, x - 10, y - 10, 20, 20);
				// ctx.beginPath();
				// ctx.arc(x, y, 5, 0, Math.PI * 2);
				// ctx.fillStyle =`hsl(244, 95%, 22%)`;
				// ctx.fill();
			}
			else {
				ctx.fillStyle = `hsl(0, 0%, 100%)`;
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