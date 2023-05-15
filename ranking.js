const leaderboardData = [
    { name: 'Adrià.B', points: 1000 },
    { name: 'Elfo', points: 900 },
    { name: 'Roger', points: 800 },
    { name: 'Adrian.R', points: 700 },
    { name: 'Alicia', points: 600 },
];

function generateLeaderboard() {
    const leaderboardBody = document.getElementById('leaderboard-body');

    leaderboardData.forEach((player, index) => {
        const row = document.createElement('tr');

        const positionCell = document.createElement('td');
        positionCell.textContent = index + 1;
        row.appendChild(positionCell).style.textAlign ='center';

        const nameCell = document.createElement('td');
        nameCell.textContent = player.name;
        row.appendChild(nameCell);

        const pointsCell = document.createElement('td');
        pointsCell.textContent = player.points;
        row.appendChild(pointsCell);

        leaderboardBody.appendChild(row);
    });
}

generateLeaderboard();

window.onload = function () {
    agregarCoronaAlPrimerLugar();
};

function agregarCoronaAlPrimerLugar() {
    var primerLugar = document.querySelector("#leaderboard-body tr:first-child td:nth-child(2)");
    if (primerLugar) {
        var corona = document.createElement("img");
        corona.src = "SRC_Space/corona.png";
        corona.alt = "corona";
        corona.classList.add("corona");
        primerLugar.appendChild(corona);
    }
}