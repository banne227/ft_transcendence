//la ou est-ce-que j'ecoute
const socket = io("http://127.0.0.1:3000/");

function makeDraggable(fenetre, barre) {
	let isDragging = false;
	let offsetX = 0;
	let offsetY = 0;

	barre.addEventListener("mousedown", function (e) {
		isDragging = true;
		offsetX = e.clientX - fenetre.offsetLeft;
		offsetY = e.clientY - fenetre.offsetTop;
	});

	document.addEventListener("mousemove", function (e) {
		if (isDragging) {
			fenetre.style.left = e.clientX - offsetX + "px";
			fenetre.style.top = e.clientY - offsetY + "px";
		}
	});

	document.addEventListener("mouseup", function () {
		isDragging = false;
	});
}

const son = new Audio("../son/windows-xp-startup.mp3");
const song = new Audio("../son/sound.mp3");

document
	.querySelector(".play_button a")
	.addEventListener("click", function (e) {
		e.preventDefault();
		socket.emit("join", "aori");
		son.play();
		setTimeout(function () {
			window.location.href = "https://transcendence.42.fr/game";
		}, 3000);
	});

makeDraggable(
	document.querySelector("#window-log"),
	document.querySelector("#window-log .titlebar"),
);
makeDraggable(
	document.querySelector("#window-title"),
	document.querySelector("#window-title .titlebar"),
);
makeDraggable(
	document.querySelector("#window-chat"),
	document.querySelector("#window-chat .titlebar"),
);
makeDraggable(
	document.querySelector("#window-login"),
	document.querySelector("#window-login .titlebar"),
);
makeDraggable(
	document.querySelector("#window-register"),
	document.querySelector("#window-register .titlebar"),
);

let count = 42;

const btn = document.getElementById("compteur");

btn.addEventListener("click", () => {
	count--;
	btn.innerText = count;
	if (count == 40) {
		document.querySelectorAll(".window").forEach(function (window) {
			window.classList.add("maClasse");
		});
	}
	if (count == 30) {
		document.getElementById("screamer").style.display = "block";
		song.play();
		setTimeout(function () {
			document.getElementById("screamer").style.display = "none";
		}, 1500);
	}
});

document
	.querySelector("#chat-input-row button")
	.addEventListener("click", function () {
		const input = document.querySelector("#chat-input-row input");
		const texte = input.value;

		const message = document.createElement("div");
		message.classList.add("chat-line");
		message.textContent = texte;

		document.querySelector("#chat-messages").appendChild(message);
		input.value = "";
	});

document.querySelector("#window-log").addEventListener("click", function () {
	document.getElementById("window-login").style.display = "block";
});

document
	.querySelector("#chat-input-row input")
	.addEventListener("keydown", function (e) {
		if (e.key === "Enter") {
			document.querySelector("#chat-input-row button").click();
		}
	});

document.querySelector(".btn-login").addEventListener("click", function (e) {
	e.stopPropagation();
	document.getElementById("window-login").style.display = "block";
});
document.getElementById("btn-inscrire").addEventListener("click", function (e) {
	e.preventDefault();
	document.getElementById("window-register").style.display = "block";
});

document.querySelectorAll(".btn-close").forEach(function (btn) {
	btn.addEventListener("click", function () {
		btn.closest(".window").style.display = "none";
	});
});
