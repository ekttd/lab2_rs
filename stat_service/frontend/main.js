const statisticsApi = 'http://127.0.0.1:8002';
const playerApi = 'http://127.0.0.1:8001';
const playerPage = 'http://127.0.0.1:5501/index.html'

document.getElementById('statForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const goals = parseInt(document.getElementById('goals').value);
    const assists = parseInt(document.getElementById('assists').value);
    const matches = parseInt(document.getElementById('matches').value);

    if (!name) {
        alert("Enter player name");
        return;
    }

    const stat = {
        name: name,
        goals: goals,
        assists: assists,
        matches_played: matches
    };

    try {
        const response = await fetch(`${statisticsApi}/statistics/by-name`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(stat)
        });

        if (!response.ok) {
            const error = await response.json();
            alert(error.detail || "Error creating statistics");
            return;
        }

        const data = await response.json();
        alert(`Statistics created for player ID: ${data.player_id}`);

        document.getElementById('statForm').reset();
        loadAllStatistics();

    } catch (error) {
        alert("Server error");
        console.error(error);
    }
});


document.getElementById('fullInfoBtn').addEventListener('click', async () => {
    const name = document.getElementById('SearchFullName').value.trim();
    const result = document.getElementById('fullResult');
    result.innerHTML = '';

    if (!name) {
        result.innerHTML = '<li>Enter player name</li>';
        return;
    }

    try {
        const response = await fetch(`${statisticsApi}/statistics/by-name/${name}`);

        if (!response.ok) {
            result.innerHTML = '<li>Player or statistics not found</li>';
            return;
        }

        const data = await response.json();

        const li = document.createElement('li');
        li.textContent =
            `Name: ${data.player.name} | Club: ${data.player.club} | Position: ${data.player.position} | ` +
            `Goals: ${data.statistics.goals} | Assists: ${data.statistics.assists} | Matches: ${data.statistics.matches_played}`;

        result.appendChild(li);

    } catch (error) {
        result.innerHTML = '<li>Server error</li>';
        console.error(error);
    }
});


async function loadAllStatistics() {

    const list = document.getElementById('allStats');
    list.innerHTML = '';

    try {
        const response = await fetch(`${statisticsApi}/statistics`);
        const stats = await response.json();

        const responsePlayers = await fetch(`${playerApi}/players`);
        const players = await responsePlayers.json();

        if (!stats.length) {
            list.innerHTML = '<li>No statistics yet</li>';
            return;
        }

        for (const stat of stats) {

            const player = players.find(p => p.id === stat.id);

            if (!player) continue;

            const li = document.createElement('li');
            li.textContent =
                `Name: ${player.name} | ` +
                `Club: ${player.club} | ` +
                `Goals: ${stat.goals} | ` +
                `Assists: ${stat.assists} | ` +
                `Matches: ${stat.matches_played}`;

            list.appendChild(li);
        }

        if (!list.hasChildNodes()) {
            list.innerHTML = '<li>No valid statistics found</li>';
        }

    } catch (error) {
        list.innerHTML = '<li>Error loading statistics</li>';
        console.error(error);
    }
}


document.getElementById('searchStatBtn').addEventListener('click', async () => {

    const name = document.getElementById('searchName').value.trim();
    const result = document.getElementById('statResult');
    result.innerHTML = '';

    if (!name) {
        result.innerHTML = '<li>Enter Player Name</li>';
        return;
    }

    try {
        const response = await fetch(`${statisticsApi}/statistics/by-name/${name}`);

        if (!response.ok) {
            result.innerHTML = '<li>Statistics not found</li>';
            return;
        }

        const data = await response.json();

        const li = document.createElement('li');
        li.textContent =
            `Name: ${data.player.name} | ` +
            `Club: ${data.player.club} | ` +
            `Goals: ${data.statistics.goals} | ` +
            `Assists: ${data.statistics.assists} | ` +
            `Matches: ${data.statistics.matches_played}`;

        result.appendChild(li);

    } catch (error) {
        result.innerHTML = '<li>Server error</li>';
        console.error(error);
    }
});


function goToStart() {
    window.location.href = playerPage;
}

loadAllStatistics();
