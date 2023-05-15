// Datos de ejemplo, reemplázalos con los datos reales de tus juegos
const leaderboardData = [
    { playerName: 'Adrià.B', ciudad: 'Barcelona', spaceInvaders: 1000, drive: 1500, raceHourse: 1200, zombies: 900, totalScore: 4600 },
    { playerName: 'Elfo', ciudad: 'Madrid', spaceInvaders: 800, drive: 1300, raceHourse: 1100, zombies: 950, totalScore: 4150 },
    { playerName: 'Adrian.R', ciudad: 'Valencia', spaceInvaders: 1200, drive: 1100, raceHourse: 1000, zombies: 850, totalScore: 4150 },
    { playerName: 'Angeles', ciudad: 'Sidney', spaceInvaders: 700, drive: 1000, raceHourse: 900, zombies: 800, totalScore: 3400 },
    { playerName: 'Alicia', ciudad: 'Arizona', spaceInvaders: 600, drive: 900, raceHourse: 800, zombies: 750, totalScore: 3050 },
    { playerName: 'Fabian', ciudad: 'Barcelona', spaceInvaders: 1000, drive: 1500, raceHourse: 1200, zombies: 900, totalScore: 4600 },
    { playerName: 'Carlos', ciudad: 'Guatemala', spaceInvaders: 800, drive: 1300, raceHourse: 1100, zombies: 950, totalScore: 4150 },
    { playerName: 'Sandra', ciudad: 'Cancún', spaceInvaders: 1200, drive: 1100, raceHourse: 1000, zombies: 850, totalScore: 4150 },
    { playerName: 'Agustin', ciudad: 'Hong-Kong', spaceInvaders: 700, drive: 1000, raceHourse: 900, zombies: 800, totalScore: 3400 },
    { playerName: 'Olav', ciudad: 'Filipinas', spaceInvaders: 600, drive: 900, raceHourse: 800, zombies: 750, totalScore: 3050 },
  ];
  
  // Función para agregar las filas a la tabla de clasificación existente
  function populateLeaderboardTable(data) {
    const tbody = document.getElementById("leaderboard-body");
    data.forEach((rowData, index) => {
      const row = document.createElement("tr");
  
      const positionTd = document.createElement("td");
      positionTd.textContent = index + 1;
      row.appendChild(positionTd);
  
      [
        { key: "playerName", sortKey: "name" },
        { key: "ciudad", sortKey: "city" },
        { key: "spaceInvaders", sortKey: "space-invaders" },
        { key: "drive", sortKey: "driver" },
        { key: "raceHourse", sortKey: "racing-horse" },
        { key: "zombies", sortKey: "zombies" },
        { key: "totalScore", sortKey: "total-score" },
      ].forEach(({ key, sortKey }) => {
        const td = document.createElement("td");
        td.setAttribute("data-column", sortKey); // Usa sortKey en lugar de key
        td.textContent = rowData[key];
        row.appendChild(td);
      });
      tbody.appendChild(row);
    });
  }
  
  // Llamando a la función para agregar las filas a la tabla de clasificación
  populateLeaderboardTable(leaderboardData);
  
  document.querySelectorAll('[data-sort]').forEach(header => {
    header.addEventListener('click', () => {
        const column = header.dataset.sort;
        const direction = header.dataset.direction || 'asc';
        sortTable(column, direction);
        header.dataset.direction = direction === 'asc' ? 'desc' : 'asc';
    });
});

function sortTable(column, direction) {
    const table = document.querySelector('#leaderboard');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
        const aValue = a.querySelector(`td[data-column="${column}"]`).innerText;
        const bValue = b.querySelector(`td[data-column="${column}"]`).innerText;


        if (column === 'name' || column === 'city' || column === 'space-invaders' || column === 'driver' || column === 'racing-horse' || column === 'zombies' || column === 'total-score') {
            const numA = parseFloat(aValue);
            const numB = parseFloat(bValue);
            return direction === 'asc' ? numA - numB : numB - numA;
        }
    });

    rows.forEach(row => tbody.appendChild(row));
}

