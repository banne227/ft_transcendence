async function loadPlayer() {
    try 
    {
        const username = document.getElementById("username").value; //recupere le username tape
        if (!username || username === "")
            return
        const res = await fetch(`https://transcendence.42.fr/api/history/${username}`); //await attent une reonse avant de passer a la suite
        const data = await res.json(); //recupere lle json avec fetch rempli auparavent coter api

        if (res.status === 200)
            renderChart(data);
    }
    catch (err) 
    {
        console.error(err);
    }   
}

let chart;

function renderChart(history) {
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
                label: history.username,
                data: scores,
                borderColor: "blue",
                tension: 0.3
            }]
        }
    });
}
