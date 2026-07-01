 import {Game} from './game'

export function displayState(state: Game): void {
	console.log('--- tick ---')
	for (const player of Object.values(state.players)) {
		const head = player.body && player.body[0]
		const headStr = head ? `(${head.x},${head.y})` : '(no-head)'
		console.log(
			`${player.id} ${player.name} alive=${player.alive} score=${player.score} head=${headStr} len=${player.body.length}`,
		)
	}
}

// export function extractJwt(cookies: string[]): string | undefined {
//   const cookie = cookies.find((c) => c.startsWith("jwt="));

//   if (!cookie) return undefined;

//   const [jwt] = cookie.replace("jwt=", "").split(";");

//   return jwt;
// }

export function extractJwt(input: any) {
	// console.log("input: ", input)
	let cookies: string[] = [];

	if (!input) return null;

	// cas 1 : array
	if (Array.isArray(input)) {
		cookies = input;
	}

	// cas 2 : string unique
	else if (typeof input === "string") {
		cookies = [input];
	}

	// cas 3 : objet axios/fetch style
	else if (typeof input === "object") {
		if (Array.isArray(input["set-cookie"])) {
			cookies = input["set-cookie"];
		} else if (typeof input["set-cookie"] === "string") {
			cookies = [input["set-cookie"]];
		}
	}

	const jwtCookie = cookies.find(c => c.includes("jwt="));
	if (!jwtCookie) return null;
	const jwt = jwtCookie.split("jwt=")[1]
	if (!jwt) return null;
	return jwt.split(";")[0];
}