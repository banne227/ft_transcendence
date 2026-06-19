import { state} from './game'


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