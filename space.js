document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const resultadoMostrar = document.querySelector(".points");
  let squares = [];
  let currentPosition = 202;
  let width = 15;
  let direction = 1;
  let invadersId;
  let goingRight = true;
  let aliensRemoved = [];
  let results = 0;
  let velocidadAliens = 500;
  let laserSound = new Audio('SRC_Space/disparoL.mp3');
  // let spaceSound = new Audio('SRC_Space/spaceIn.mp3');
  let strangeSound = new Audio('SRC_Space/strangeSong.mp3');  

  function createGrid(reset = false) {
    if (reset) {
      squares = [];
      grid.innerHTML = "";
    }
    for (let i = 0; i < 225; i++) {
      const div = document.createElement("div");
      div.classList.add("cell");
      grid.appendChild(div);
      squares.push(div);
    }
  }

  createGrid();

  let alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 30,
    31, 32, 33, 34, 35, 36, 37, 38, 39,
  ];

  function crearAlienInvaders() {
    for (let i = 0; i < alienInvaders.length; i++) {
      squares[alienInvaders[i]].classList.add("invader");
    }
  }
  crearAlienInvaders();

  function eliminarAlienInvaders() {
    for (let i = 0; i < alienInvaders.length; i++) {
      squares[alienInvaders[i]].classList.remove("invader");
    }
  }

  squares[currentPosition].classList.add("shooter");

  function moverShooter(e) {
    squares[currentPosition].classList.remove("shooter");
    switch (e.key) {
      case "ArrowLeft":
        if (currentPosition % width !== 0) currentPosition -= 1;
        break;
      case "ArrowRight":
        if (currentPosition % width < width - 1) currentPosition += 1;
        break;
    }
    squares[currentPosition].classList.add("shooter");
  }

  document.addEventListener("keydown", moverShooter);

  function reiniciarJuego() {
    clearInterval(invadersId);
    // results = 0;
    aliensRemoved = [];
    currentPosition = 202;
    direction = 1;
    goingRight = true;
    velocidadAliens *= 0.5;
  
    eliminarAlienInvaders();
    createGrid(true); 
  
    alienInvaders = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 30,
      31, 32, 33, 34, 35, 36, 37, 38, 39,
    ];
  
    crearAlienInvaders();
  
    setTimeout(() => {
      invadersId = setInterval(moveInvaders, velocidadAliens);
    }, 10);
  }
  


  function moveInvaders() {
    let gameover = false;
    const leftEdge = alienInvaders[0] % width === 0;
    const rightEdge =
      alienInvaders[alienInvaders.length - 1] % width === width - 1;

    eliminarAlienInvaders();

    if (rightEdge && goingRight) {
      for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += width + 1;
        direction = -1;
      }
      goingRight = false;
    }

    if (leftEdge && !goingRight) {
      for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += width - 1;
      }
      goingRight = true;
      direction = 1;
    }

    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += direction;
    }

    crearAlienInvaders();

    if (squares[currentPosition].classList.contains("invader", "shooter")) {
      resultadoMostrar.innerHTML = "GAME OVER";
      gameover = true;
      clearInterval(invadersId);
    }

    for (let i = 0; i < alienInvaders.length; i++) {
      if (alienInvaders[i] > squares.length - (width - 1)) {
        resultadoMostrar.innerHTML = "GAME OVER";
        gameover = true;
        clearInterval(invadersId);
      }
    }

    if(gameover) GetPoints(results);
    
    if (alienInvaders.length === 0) {
      reiniciarJuego();
    }
  }

  function shoot(e) {
    let laserId;
    let currentLaserIndex = currentPosition;
    function moveLaser() {
      squares[currentLaserIndex].classList.remove("laser");
      currentLaserIndex -= width;
      squares[currentLaserIndex].classList.add("laser");

      if (squares[currentLaserIndex].classList.contains("invader")) {
        squares[currentLaserIndex].classList.remove("laser");
        squares[currentLaserIndex].classList.remove("invader");
        squares[currentLaserIndex].classList.add("boom");

        setTimeout(
          () => squares[currentLaserIndex].classList.remove("boom"),
          250
        );
        clearInterval(laserId);

        const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
        aliensRemoved.push(alienRemoved);
        alienInvaders.splice(alienRemoved, 1);
        results += 10;
        resultadoMostrar.innerHTML = results;
      }

      if (currentLaserIndex < width) {
        clearInterval(laserId);
        setTimeout(
          () => squares[currentLaserIndex].classList.remove("laser"),
          100
        );
      }
    }

    if (e.key === " ") {
      laserSound.play();
      laserId = setInterval(moveLaser, 100);
    }
  }

  function init() {
    strangeSound.play();
    // spaceSound.play();
    crearAlienInvaders();
    document.addEventListener("keydown", moverShooter);
    document.addEventListener("keydown", shoot);
    invadersId = setInterval(moveInvaders, velocidadAliens);
    document.querySelector(".start-button").style.display = "none";
  }
  document.querySelector(".start-button").addEventListener("click", init);
});

function GetPoints(results){
  localStorage.setItem("pointsSpaceInvaders", results);
  let data ={
    id_user: parseInt(localStorage.getItem("id_user")),
    id_game: 0,
    score: results
  };
  console.log(data);
  CheckPoints(data);  
}

async function CheckPoints(data) {
  let url = "https://juegatonslapi.azurewebsites.net/api/Rankings";
  let exists = false;
  let dbranking = await GetInfo("Rankings", "");

  //Foreach comprobando la existencia del email
  dbranking.forEach((ranking) => {
    if (parseInt(localStorage.getItem("id_user")) === ranking.id_user && 0 === ranking.id_game) {
      //El email ya está en uso por otra cuenta
      exists = true;
      if(ranking.score < data.score){
        let put = {
          method: "PUT",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        };
        fetch(url, put).then((response) => response.json());
        console.log("UPDATED");
      }else console.log("La Puntuación es menor");
      
    }
  });
  if(!exists){
    let post = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch(url, post).then((response) =>{
      console.log(response);
      response.json();
    }); 
    console.log("INSERTED");
  }
}

async function GetInfo(path, datos /* string */) {
  // Pide a la Api la información referente a un usuario con nombreJugador = Usuario
  const response = await fetch(
    "https://juegatonslapi.azurewebsites.net/" + "api/" + path + "/" + datos
  );

  const data = await response.json();

  return data;
}

async function PutRanking(id_game){
  let leaderboardData = []
  let data = await GetInfo("Rankings", id_game);
  data.forEach((register)=>{
    let element = [register.username, register.name, register.score];
    leaderboardData.push(element);
  })
  return leaderboardData;
}

async function generateLeaderboard() {
  const leaderboardData = await PutRanking(0);
  const leaderboardBody = document.getElementById('leaderboard-body');

  for(let i = 0; i< leaderboardData.length && i < 5; i++){

    const row = document.createElement('tr');

      const positionCell = document.createElement('td');
      positionCell.textContent = i + 1;
      row.appendChild(positionCell).style.textAlign ='center';

      const nameCell = document.createElement('td');
      nameCell.textContent = leaderboardData[i][0];
      row.appendChild(nameCell);

      const cityCell = document.createElement('td');
      cityCell.textContent = leaderboardData[i][1];
      row.appendChild(cityCell);

      const pointsCell = document.createElement('td');
      pointsCell.textContent = leaderboardData[i][2];
      row.appendChild(pointsCell);

      leaderboardBody.appendChild(row);
  }
}

generateLeaderboard();

