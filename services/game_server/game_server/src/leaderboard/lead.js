var Player = {
    username: "player121",
    bestScore: 145,
    scores: [
        { value: 42, playedAt: "2025-06-01T14:30:00Z" },
        { value: 87, playedAt: "2025-06-03T19:00:00Z" },
        { value: 103, playedAt: "2025-06-05T12:00:00Z" },
        { value: 67, playedAt: "2025-06-06T21:00:00Z" },
        { value: 145, playedAt: "2025-06-09T10:00:00Z" },
    ]
}

const scores = Player.scores.map(element => element.value)
const time = Player.scores.map(element => new Date(element.playedAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }))

new Chart(monGraph, {
    type: 'line',        // type de graphe
    data: {
        labels: time,      // axe X
        datasets: [{
            data: scores    // axe Y
        }]
    }
})

    