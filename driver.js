let raceSound = new Audio('SRC_Driver/sonidoCar.mp3');
class Coche {
    constructor(src, x, y) {
        this.image = new Image();
        this.image.src = src;
        this.x = x;
        this.y = y;
        this.width = 70;
        this.height = 40;
    }
    
    mover(x, y) {
        this.x = x - this.width / 2;
        this.y = y - this.height / 2;
    }

    dibujar(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    colisionaCon(camion) {
        return (
            this.x < camion.x + camion.width &&
            this.x + this.width > camion.x &&
            this.y < camion.y + camion.height &&
            this.y + this.height > camion.y
        );
    }
    
}

class Camion {
    constructor(src, x, y, velocidad) {
        this.image = new Image();
        this.image.src = src;
        this.x = x;
        this.y = y;
        this.width = 70;
        this.height = 40;
        this.velocidad = velocidad;
    }

    mover() {
        this.x -= this.velocidad;
    }

    dibujar(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

class Carretera {
    constructor(src, x, y, velocidad) {
        this.image = new Image();
        this.image.src = src;
        this.x = x;
        this.y = y;
        this.velocidad = velocidad;
    }

    mover() {
        this.x -= this.velocidad;
        if (this.x <= -canvas.width) {
            this.x = canvas.width;
        }
    }

    dibujar(ctx) {
        ctx.drawImage(this.image, this.x, this.y, canvas.width, canvas.height);
    }
}
let carretera1;
let carretera2;


const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const juegoDiv = document.getElementById('juego');
canvas.width = juegoDiv.clientWidth;
canvas.height = juegoDiv.clientHeight;
const coche = new Coche('SRC_Driver/coche.png',canvas.width/3 - 60, canvas.height / 2 - 45);

const startButton = document.getElementById('startButton');
startButton.addEventListener('click', iniciarJuego);

let gameOver = false;

function iniciarJuego() {
    startButton.style.display = 'none';
    carretera1 = new Carretera('SRC_Driver/carretera.png', 0, 0, 3);
    carretera2 = new Carretera('SRC_Driver/carretera.png', canvas.width, 0, 3);
    canvas.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        coche.mover((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
    });


    raceSound.play();
    generarCamion();
    setTimeout(generarCamion, 2000);
    actualizar();
}


const camiones = [];
function generarCamion() {
    const numeroAleatorio = Math.floor(Math.random() * 10) + 1;
    const src = `SRC_Driver/cotxe${numeroAleatorio}.png`;
    const x = canvas.width;
    const y = Math.random() * (canvas.height - 100);
    const velocidad = Math.random() * 6 + 5;
    const camion = new Camion(src, x, y, velocidad);
    camiones.push(camion);

    
    const intervaloAleatorio = Math.random() * (3000 - 1500) + 1000;
    setTimeout(generarCamion, intervaloAleatorio);
}
let puntos = 0;
const puntosDiv = document.getElementById('puntos');

function incrementarPuntos() {
    puntos+=10;
    puntosDiv.textContent = `Puntos: ${puntos}`;
}

function actualizar() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    carretera1.mover();
    carretera1.dibujar(ctx);
    carretera2.mover();
    carretera2.dibujar(ctx);

    coche.dibujar(ctx);

    for (const camion of camiones) {
        camion.mover();
        camion.dibujar(ctx);

        if (camion.x + camion.width < 0) {
            incrementarPuntos();
            camiones.splice(camiones.indexOf(camion), 1);
        }

        if (coche.colisionaCon(camion)) {
            gameOver = true;
            GetPoints(puntos);
            raceSound.pause();
            mostrarGameOver();
        }
    }

    requestAnimationFrame(actualizar);
}

function mostrarGameOver() {
    ctx.font = '48px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText('Game Over', canvas.width / 2 - 130, canvas.height / 2 -100);
    
    startButton.textContent = 'Volver a jugar';
    startButton.style.display = 'block';
    startButton.style.borderRadius = '30px';
    startButton.onclick = () => {
        location.reload();
    };
}

function GetPoints(puntos){
    localStorage.setItem("driverPoints", puntos);
    let data ={
      id_user: parseInt(localStorage.getItem("id_user")),
      id_game: 1,
      score: puntos
    };
    console.log(data);
    CheckPoints(data);  
  }
  
  async function CheckPoints(data) {
    let url = "https://juegatonslapi.azurewebsites.net/api/Rankings";
    let exists = false;
    let dbranking = await GetInfo("Rankings", "");
  
    dbranking.forEach((ranking) => {
      if (parseInt(localStorage.getItem("id_user")) === ranking.id_user && 1 === ranking.id_game) {
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
    const leaderboardData = await PutRanking(1);
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