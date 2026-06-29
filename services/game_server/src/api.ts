import { state } from "./game";

//j'envoie une requete POST pour connecter un player a la db
export async function login(email: string, password: string) {
	const response = await fetch("http://api:4444/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email: email,
			password: password,
		}),
	});

    const data = await response.json(); // récupère la réponse du serveur
    if (!response.ok) {
        console.error("Login échoué:", data.message);
        return null;
    }
    console.log(`login succes for ${email}`)
    return data; // retourne les infos du joueur
}

//j'envoie une requete POST pour ajouter un player a la db
export async function register(name: string, email: string, password: string) {
	const response = await fetch("http://api:4444/register", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			username: name,
			email: email,
			password: password,
		}),
	});

	const data = await response.json(); // récupère la réponse du serveur
	if (!response.ok) {
		console.error("register échoué:", data.message);
		return null;
	}
	return response.headers.getSetCookie(); // retourne les infos du joueur
}

//j'envoie une requete POST pour ajouter le score de mon player a la db
export function addScore(id: string, to_add: number) {
	const response = fetch("http://internal:1111/addscore", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			username: state.players[id]?.name,
			score: to_add,
			win: 0,
		}),
	});
}

//j'envoie une requete PUT pour changer le skin dun joueur
export async function changeSkin(token: string, color: string) {
	const response = await fetch("http://api:4444/changeskin", {
		method: "PUT",
		headers: {
			Authorization: token,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			color: color,
		}),
	});

	const data = await response.json(); // récupère la réponse du serveur
	if (!response.ok) {
		console.error("changeSkin échoué:", data.message);
		return null;
	}
	return data; // retourne les infos du joueur
}

export async function getcolor(username: string): Promise<string> {
	const response = await fetch(`http://api:4444/user/${username}/getcolor`);
	const data = await response.json();
	console.log(data)
	return data.color;
}
