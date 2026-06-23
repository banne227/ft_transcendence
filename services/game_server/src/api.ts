import { state} from './game'

//j'envoie une requete POST pour ajouter un player a la db
export function login(id: string, email : string, password : string) {
    const response = fetch("http://api:4444/login",
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