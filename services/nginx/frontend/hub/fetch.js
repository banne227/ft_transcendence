const btnTest = document.getElementById("test");

btnTest.addEventListener("click", () => {

    fetch('https://transcendence.42.fr/api/register', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
                username: 'aori',
                email: 'aori@gmail.com',
                password: 'password'
            })
    })
        reponse_clone = reponse.clone()
        .then((reponse) => {
            if (!reponse.ok) {
                throw new Error(`Erreur HTTP : ${reponse.status}`);
            }
        return reponse.json();
        })
        .then((donnees) => {
            console.log(donnees);
        })
        .catch((erreur) => {
            if (reponse_clone.status == 401)
                console.error('User alredy exist \n');
            else
                console.error("Erreur lors de la requête caca :", erreur);
        });
});
