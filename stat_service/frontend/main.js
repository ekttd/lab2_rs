const statisticsApi = 'http://127.0.0.1:8002';

document.getElementById('statForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const stat = {
        player_id: document.getElementById('playerId').value,
        goals: parseInt(document.getElementById('goals').value),
        assists: parseInt(document.getElementById('assists').value),
        matches_played: parseInt(document.getElementById('matches').value)
    };

    const response = await fetch(`${statisticsApi}/statistics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stat)
    });

    if (!response.ok) {
        alert("Error adding statistics (player may not exist)");
        return;
    }

    const data = await response.json();
    alert(`Statistics added with ID: ${data.id}`);

    document.getElementById('statForm').reset();
    loadAllStatistics();
});


async function loadAllStatistics() {
    const response = await fetch(`${statisticsApi}/statistics`);
    const stats = await response.json();

    const list = document.getElementById('allStats');
    list.innerHTML = '';

    if (stats.length === 0) {
        list.innerHTML = '<li>No statistics yet</li>';
        return;
    }

    for (const stat of stats) {
        const li = document.createElement('li');
        li.textContent = `Player ID: ${stat.player_id} | Goals: ${stat.goals} | Assists: ${stat.assists} | Matches: ${stat.matches_played}`;
        list.appendChild(li);
    }
}


document.getElementById('searchStatBtn').addEventListener('click', async () => {
    const playerId = document.getElementById('searchPlayerId').value.trim();
    const result = document.getElementById('statResult');
    result.innerHTML = '';

    if (!playerId) {
        result.innerHTML = '<li>Enter Player ID</li>';
        return;
    }

    const response = await fetch(`${statisticsApi}/statistics/${playerId}`);

    if (!response.ok) {
        result.innerHTML = '<li>Statistics not found</li>';
        return;
    }

    const stat = await response.json();

    const li = document.createElement('li');
    li.textContent = `Goals: ${stat.goals} | Assists: ${stat.assists} | Matches: ${stat.matches_played}`;
    result.appendChild(li);
});


document.getElementById('fullInfoBtn').addEventListener('click', async () => {
    const playerId = document.getElementById('fullPlayerId').value.trim();
    const result = document.getElementById('fullResult');
    result.innerHTML = '';

    if (!playerId) {
        result.innerHTML = '<li>Enter Player ID</li>';
        return;
    }

    const response = await fetch(`${statisticsApi}/full-statistics/${playerId}`);

    if (!response.ok) {
        result.innerHTML = '<li>Player or statistics not found</li>';
        return;
    }

    const data = await response.json();

    const li = document.createElement('li');
    li.textContent =
        `Name: ${data.player.name} | Club: ${data.player.club} | ` +
        `Goals: ${data.statistics.goals} | Assists: ${data.statistics.assists} | Matches: ${data.statistics.matches_played}`;

    result.appendChild(li);
});

loadAllStatistics();
