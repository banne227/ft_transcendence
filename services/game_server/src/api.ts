import { state} from './game'

//j'envoie une requete POST pour connecter un player a la db
export async function login(email : string, password : string) {
    const response = await fetch("http://api:4444/login",
        {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
        }
    );

    const data = await response.json(); // récupère la réponse du serveur
    if (!response.ok) {
        console.error("Login échoué:", data.message);
        return null;
    }
    localStorage.setItem("username", data.username); // stocke le nom
    return data; // retourne les infos du joueur
}

//j'envoie une requete POST pour ajouter un player a la db
export async function register(id: string, email : string, password : string) {
    const response = await fetch("http://api:4444/register",
        {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: state.players[id]?.name,
            email: email,
            password: password,
        }),
        }
    );

    const data = await response.json(); // récupère la réponse du serveur

    if (!response.ok) {
        console.error("register échoué:", data.message);
        return null;
    }
    return data; // retourne les infos du joueur
}

//j'envoie une requete POST pour ajouter le score de mon player a la db
export function addScore(id: string, to_add : number) {
    const response = fetch("http://api:4444/addscore",
        {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: state.players[id]?.name,
            score: to_add,
            win: 0,
        }),
        }
    );
}

//j'envoie une requete PUT pour changer le skin dun joueur
export async function changeSkin(token : string, color : string) {
    const response = await fetch("http://api:4444/changeskin",
        {
        method: "PUT",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            skin: color,
        }),
        }
    );

    const data = await response.json(); // récupère la réponse du serveur
    if (!response.ok) {
        console.error("changeSkin échoué:", data.message);
        return null;
    }
    return data; // retourne les infos du joueur
}