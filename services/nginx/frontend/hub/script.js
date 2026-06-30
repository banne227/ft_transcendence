const socket = io('https://transcendence.42.fr/', {
	path: '/ws/serv/socket.io/',
})

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

document.querySelector("#window-log").addEventListener("click", function () {
	document.getElementById("window-login").style.display = "block";
});

function afficherFenetreCompte(id) {
	document.getElementById("window-log").style.display = "none";
	document.getElementById("window-login").style.display = "none";
	document.getElementById("window-register").style.display = "none";


	document.getElementById(id).style.display = "block";
}

document.querySelector(".btn-login").addEventListener("click", function (e) {
	e.stopPropagation();
	afficherFenetreCompte("window-login")
});

document.getElementById("btn-inscrire").addEventListener("click", function (e) {
	e.preventDefault();
	afficherFenetreCompte("window-register")
});

document.querySelectorAll(".btn-close").forEach(function (btn) {
	btn.addEventListener("click", function () {
		btn.closest(".window").style.display = "none";
	});
});

document.getElementById("btn-privacy").addEventListener("click", function () {
	fetch("confi/confidentialite.md")
		.then(response => response.text())
		.then(markdown => {
			document.getElementById("privacy-content").innerHTML = markdownToHtml(markdown);
			document.getElementById("window-privacy").style.display = "block";
		})
		.catch(error => {
			document.getElementById("privacy-content").innerText = "Impossible de charger le document.";
			document.getElementById("window-privacy").style.display = "block";
		});
});

makeDraggable(
	document.querySelector("#window-privacy"),
	document.querySelector("#window-privacy .titlebar"),
);

// Convertisseur Markdown -> HTML très simple (titres, gras, listes, paragraphes)
function markdownToHtml(md) {
	return md
		.replace(/^### (.*$)/gim, "<h3>$1</h3>")
		.replace(/^## (.*$)/gim, "<h2>$1</h2>")
		.replace(/^# (.*$)/gim, "<h1>$1</h1>")
		.replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
		.replace(/^- (.*$)/gim, "<li>$1</li>")
		.replace(/(<li>.*<\/li>)/gims, "<ul>$1</ul>")
		.split(/\n\n+/)
		.map(p => (p.startsWith("<h") || p.startsWith("<ul")) ? p : `<p>${p}</p>`)
		.join("");
}

socket.on("register?", (data) => {
	console.log(`register emit here data.succes= ${data.succes}`);
    if (data.succes)
	{
		afficherFenetreCompte("window-login");
		localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
	}
    else
        alert("register fail");
});	

socket.on("connected?", (data) => {
    if (data.succes === true)
	{
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
		// console.log(`${data.username} log with jwt: ${data.token}`)
		window.location.href = "https://transcendence.42.fr/game";
	}
    else
        alert("login failed");
});


document.getElementById("form-register").addEventListener("submit", function (e) {
    e.preventDefault();

	console.log("submit register");

    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    const passwordConfirm = document.getElementById("register-password-confirm").value;
    const email = document.getElementById("register-email").value;

    if (password !== passwordConfirm) {
        alert("Les mots de passe ne correspondent pas.");
        return;
    }
	console.log(`socket connec: ${socket.connected}`);
    socket.emit("register", username, password, email);
});

document.getElementById("form-login").addEventListener("submit", function (e) {
    e.preventDefault();

	console.log("submit login");

    const email = document.getElementById("login-email").value;
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

	console.log(`socket connec: ${socket.connected}`);
    socket.emit("login", username, email, password);
});