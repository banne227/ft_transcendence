import { state } from './game'

//j'envoie une requete POST pour connecter un player a la db
export async function login(email: string, password: string) {
	const response = await fetch('http://auth:9999/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			email: email,
			password: password,
		}),
	})

	const data = await response.json() // récupère la réponse du serveur
	if (!response.ok) {
		console.error('Login échoué:', data.message)
		return null
	}
	console.log(`login succes for ${email}`)
	return response.headers.getSetCookie() // retourne les infos du joueur
}

//j'envoie une requete POST pour ajouter un player a la db
export async function register(name: string, email: string, password: string) {
	const response = await fetch('http://auth:9999/register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			username: name,
			email: email,
			password: password,
		}),
	})

	const data = await response.json() // récupère la réponse du serveur
	if (!response.ok) {
		console.log('register échoué:', data)
		return null
	}
	console.log('register ok:', data.message)
	return response.headers.getSetCookie() // retourne les infos du joueur
}

//j'envoie une requete POST pour ajouter le score de mon player a la db
export function addScore(id: string, to_add: number) {
	const response = fetch('http://internal:1111/addscore', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			username: state.players[id]?.name,
			score: to_add,
			win: 0,
		}),
	})
}

//j'envoie une requete PUT pour changer le skin dun joueur
export async function changeSkin(token: string, color: string) {
	// console.log("mthode change color for", color)
	const response = await fetch('http://internal:1111/user/changecolor', {
		method: 'PUT',
		headers: {
			Authorization: token,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			color: color,
		}),
	})
	console.log(response.status)

	const data = await response.json() // récupère la réponse du serveur
	if (!response.ok) {
		console.error('changeSkin échoué:', data.message)
		return null
	}
	console.log(data)
	return data // retourne les infos du joueur
}

export async function getcolor(username: string): Promise<string> {
	const response = await fetch(`http://api:4444/user/${username}/getcolor`)
	const data = await response.json()
	console.log('methode getcolor ', username, data)
	return data.color
}

export async function callDecodeJWT(tokenValue: string) {
	const url = `http://internal:1111/jwt/decode?jwt=${tokenValue}`

	const response = await fetch(url, {
		method: 'GET',
		headers: {
			Authorization: `${tokenValue}`, // Error here
		},
	})
	const json = await response.json()
	if (response.status == 200) {
		const data = JSON.parse(json)
		return data
	} else {
		throw `${response.status}`
	}
}
