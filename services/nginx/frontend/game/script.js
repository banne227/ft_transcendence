const socket = io('https://transcendence.42.fr/', {
	path: '/ws/serv/socket.io/',
})
const output = document.getElementById('output')

function showChar(e) {
	output.textContent = `Key KeyDown: "${e.key}" CTRL key KeyDown: ${e.ctrlKey}`
}
document.addEventListener('keydown', showChar)

addEventListener('keydown', function (e) {

	if (e.key === 'ArrowLeft') socket.emit('direction', 'LEFT')
	if (e.key === 'ArrowRight') socket.emit('direction', 'RIGHT')
	if (e.key === 'Escape') {
		window.location.href = 'https://transcendence.42.fr/hub'
	}
	if (e.key === 'b' || e.key === 'click') {socket.emit('boost')}
})

socket.on("connect", () => {
    const username = localStorage.getItem("username") ?? "anonymous";
    socket.emit("join", username);
});

const playBtn = document.getElementById("play-btn");

playBtn.addEventListener("click", () => {
    const username = localStorage.getItem("username") ?? "anonymous";
	socket.emit('addplayer', username)
	document.getElementById('start-msg').style.display = 'none'
});

socket.on("asktoken", () => {
	const token = getItem("jwt") 
	socket.emit("gettoken", token)
})

socket.on("chatMessage", (msg) => {
	const time = new Date(msg.hour).toLocaleString("fr-FR", {
		hour: "2-digit",
		minute: "2-digit"
	});

	const box = document.getElementById("chat-msgs");
	const line = document.createElement("div");
	line.className = "chat-line";

	const isMe = msg.id === socket.id;
	line.innerHTML = `<span class="chat-nick" style="${isMe ? "color:#ffffff" : ""}">${msg.name}</span> <span style="color:#555;font-size:10px">${time}</span><br>${msg.text}`;

	box.appendChild(line);
	box.scrollTop = box.scrollHeight;
});

document.getElementById("chat-input").addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  const input = document.getElementById("chat-input");
  const msg = input.value.trim();
  if (!msg) return;
  socket.emit("chatMessage", msg);
  input.value = "";
});

socket.on('gameState', (state) => {
	const me = state.players[socket.id]
	if (!me) return

	if (!me.alive)
		document.getElementById('start-msg').style.display = 'block'
	document.getElementById('hud-len').textContent = me.body.length
	document.getElementById('hud-score').textContent = me.score
	document.getElementById('hud-boost').textContent = me.boost
	document.getElementById('hud-pos').textContent =
		`X:${Math.round(me.body[0].x - 2000)} Y:${Math.round(me.body[0].y - 2000)}`
	// console.log(me.body, "\n");

	// Minimap : monde 0-4000 → SVG 0-118 x 0-90
	const minimapDot = document.getElementById('minimap-me')
	if (minimapDot && me.body.length) {
		const mx = (me.body[0].x / 4000) * 118
		const my = (me.body[0].y / 4000) * 90
		minimapDot.setAttribute('cx', mx)
		minimapDot.setAttribute('cy', my)
	}
	const players = state.leaderbord

	const leaderboard = document.getElementById("leaderboard");

	leaderboard.innerHTML = "";

	players.forEach((player, index) => {
		const li = document.createElement("li");
		li.className = "lb-item";

		li.innerHTML = `
			<span class="lb-rank">#${index + 1}</span>
			<span>${player.name}</span>
			<span class="lb-score">${player.score}</span>
		`;

		leaderboard.appendChild(li);
	});
})



// ── Ton code de rendu après ici ──────────────────────────────────

const canvas = document.getElementById('game-canvas')
const ctx = canvas.getContext('2d')

canvas.addEventListener('mousemove', (e) => {
	const me = gameState?.players[socket.id]
	if (!me || !me.body.length) return

	const camX = me.body[0].x
	const camY = me.body[0].y

	const rect = canvas.getBoundingClientRect()

	const mouseScreenX = e.clientX - rect.left
	const mouseScreenY = e.clientY - rect.top

	const scaleX = canvas.width / 2000
	const scaleY = canvas.height / 2000

	const mouseWorldX =
		(mouseScreenX - canvas.width / 2) / scaleX + camX

	const mouseWorldY =
		(mouseScreenY - canvas.height / 2) / scaleY + camY

	socket.emit('mouseMove', {
		x: mouseWorldX,
		y: mouseWorldY,
	})
})

let gameState = null

socket.on('gameState', (state) => {
	gameState = state
})

function resize() {
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
}
window.addEventListener('resize', resize)
resize()

function render() {
	requestAnimationFrame(render)
	ctx.fillStyle = '#2020d2'
	ctx.fillRect(0, 0, canvas.width, canvas.height)
	if (!gameState) return

	const scaleX = canvas.width / 2000
	const scaleY = canvas.height / 2000

	// position de la tête de MON joueur, utilisée pour centrer la caméra
	const me = gameState.players[socket.id]
	const camX = me && me.body.length ? me.body[0].x : 1000
	const camY = me && me.body.length ? me.body[0].y : 1000

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
		const x = (food.x - camX) * scaleX + canvas.width / 2
		const y = (food.y - camY) * scaleY + canvas.height / 2
		const r = 4 + food.feed
		ctx.beginPath()
		ctx.arc(x, y, r, 0, Math.PI * 2)
		ctx.fillStyle = '#aaffaa'
		ctx.fill()
	}
	render_p(camX, camY, scaleX, scaleY)
}

window.addEventListener('resize', resize)
resize()

const brushImg = new Image()
brushImg.src = '../images/brush.png'

document.querySelectorAll('.colors').forEach(color => {
    color.addEventListener('click', () => {
		console.log(color.style.background);
        socket.emit("changecolor",color.style.background);
    });
});

function render_p(camX, camY, scaleX, scaleY) {
	var i = 0

	for (const player of Object.values(gameState.players)) {
		if (!player.alive) continue
		i = 0
		for (const segment of player.body) {
			const x = (segment.x - camX) * scaleX + canvas.width / 2
			const y = (segment.y - camY) * scaleY + canvas.height / 2

			if (i == 0) {
				ctx.drawImage(brushImg, x - 10, y - 10, 20, 20)
				// ctx.beginPath();
				// ctx.arc(x, y, 5, 0, Math.PI * 2);
				// ctx.fillStyle =`hsl(244, 95%, 22%)`;
				// ctx.fill();
			} else {
				ctx.fillStyle =  player.color
				ctx.fillRect(x - 5, y - 5, player.width, player.width)
			}
			i++
		}
	}
}

if (gameState) {
	console.log(gameState.players.x, gameState.players.y, '\n')
	render_p()
}

render()
