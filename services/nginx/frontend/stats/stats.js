async function loadPlayer() {
    const username = document.getElementById("username").value; //recupere le username tape
    if (!username || username === "")
        return
    const res = await fetch(`https://transcendence.42.fr/api/history/${username}`); //await attent une reonse avant de passer a la suite

    if (res.status === 200)
    {
        const data = await res.json(); //recupere lle json avec fetch rempli auparavent coter api
        renderChart(data, username);
    }   
    else
    {
        // console.log(data.error)
        alert("User not found")
    }
}

let chart;

function renderChart(history, username) {
    const scores = history.map(entry => entry.score);

    const time = history.map(entry =>
        new Date(entry.date).toLocaleDateString(
            "fr-FR",
            {
                day: "2-digit",
                month: "short"
            }
        )
    );

    if (chart) chart.destroy(); // detruire l'ancien si deja existant

    const ctx = document.getElementById("monGraph");

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: time,
            datasets: [{
                label: "SCORE",
                data: scores,
                borderColor: "blue",
                tension: 0.3
            }]
        }
    });
}
