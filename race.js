let raceSound = new Audio("SRC_Reace/sonidoC.mp3");
class Caballo {
  constructor(id, element) {
    this.id = id;
    this.element = element;
    this.raceInProgress = false;
    this.position = 0;
    this.speed = Math.random() * 6 + 1;
  }

  updatePosition() {
    this.position += this.speed;
    this.element.style.left = `${this.position}px`;
  }

  updateSpeed() {
    this.speed = Math.random() * 6 + 1;
  }

  reset() {
    this.position = 0;
    this.element.style.left = "0";
  }
}

class Caballos {
  constructor() {
    this.game = false;
    this.apuestaSeleccionada = "";
    this.checkWinner = null;
    this.overlayVisible = false;
    this.point = 0;
    this.caballos = Array.from(document.querySelectorAll(".Caballo")).map(
      (caballoElement) => new Caballo(caballoElement.id, caballoElement)
    );

    document
      .getElementById("apostarBtn")
      .addEventListener("click", () => this.apostar());
    document
      .getElementById("startBtn")
      .addEventListener("click", () => this.startRace());
  }

  apostar() {
    let select = document.getElementById("apuesta");
    this.apuestaSeleccionada = select.options[select.selectedIndex].value;
    document.getElementById("overlay").style.display = "none";
    this.overlayVisible = false;
    this.game = true;
  }

  mostrarApuestas() {
    document.getElementById("overlay").style.display = "flex";
  }

  resetRace() {
    this.caballos.forEach((caballo) => caballo.reset());
  }

  resetGame() {
    if (this.checkWinner) {
      clearInterval(this.checkWinner);
      this.checkWinner = null;
    }
    this.resetRace();
    if (!this.raceInProgress) {
      this.mostrarApuestas();
    }
    document.getElementById("startBtn").textContent = "Replay";
  }

  startRace() {
    let startBtn = document.getElementById("startBtn");

    if (startBtn.textContent === "Replay" && !this.raceInProgress) {
      this.resetGame();
    }
    if (this.game && !this.raceInProgress) {
      this.raceInProgress = true;
      document.getElementById("juego").classList.add("racing");
      startBtn.classList.add("hide");
      document.getElementById("overlay").style.display = "none";

      raceSound.play();

      let horses = document.querySelectorAll(".Caballo");
      let winner = document.getElementById("winner");
      winner.textContent = "";

      const updateSpeeds = () => {
        this.caballos.forEach((caballo) => caballo.updateSpeed());
      };

      const race = setInterval(() => {
        this.caballos.forEach((caballo) => caballo.updatePosition());
        updateSpeeds();
      }, 70);

      const checkWinnerInterval = setInterval(() => {
        // Código para verificar el ganador
        let maxPosition = -1;
        let winningHorse = null;

        horses.forEach((horse) => {
          let currentPosition = horse.getBoundingClientRect().right;
          if (currentPosition > maxPosition) {
            maxPosition = currentPosition;
            winningHorse = horse;
          }
        });

        const raceTrack = document.getElementById("raceTrack");
        const raceTrackRight = raceTrack.getBoundingClientRect().right;

        if (winningHorse.getBoundingClientRect().right >= raceTrackRight) {
          clearInterval(race);
          clearInterval(checkWinnerInterval);
          this.checkWinner = null;
          horses.forEach((horse) => (horse.style.transition = "none"));
          winner.textContent = `Ganador: ${winningHorse.id}`;

          if (winningHorse.id === this.apuestaSeleccionada) {
            alert("¡Felicidades! Tu apuesta es correcta. Ganaste.");
            this.point += 1000; //
          } else {
            GetPoints(this.point);
            alert("Lo siento, perdiste. El ganador es " + winningHorse.id);
            this.point = 0; //
          }
          document.getElementById("puntos").textContent = `Puntos: ${this.point}`;
          raceSound.pause();
          document.getElementById("juego").classList.remove("racing");
          
          // Reiniciar el juego
          setTimeout(() => {
            this.raceInProgress = false;
            if (!this.raceInProgress) {
              this.resetGame();
            }
            startBtn.classList.remove("hide");
          }, 200);
        }
      }, 100);
    }
  }
}

const caballos = new Caballos();

function GetPoints(point){
  localStorage.setItem("racistPoints", point);
  let data ={
    id_user: parseInt(localStorage.getItem("id_user")),
    id_game: 2,
    score: point
  };
  console.log(data);
  CheckPoints(data);  
}

async function CheckPoints(data) {
  let url = "https://juegatonslapi.azurewebsites.net/api/Rankings";
  let exists = false;
  let dbranking = await GetInfo("Rankings", "");

  dbranking.forEach((ranking) => {
    if (parseInt(localStorage.getItem("id_user")) === ranking.id_user && 2 === ranking.id_game) {
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

//RANKING

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
  const leaderboardData = await PutRanking(2);
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
