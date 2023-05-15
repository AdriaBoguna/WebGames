const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Variables del juego
let goLeft = false;
let goRight = false;
let goUp = false;
let goDown = false;
let facing = "up";
let playerHealth = 100;
let speed = 5;
let zombieSpeed = 1;
const zombies = [];
let points = 0;
const bullets = [];
const bulletSpeed = 10;
let isGameRunning = false;

// Carga las imágenes del jugador
const playerImageUp = new Image();
const playerImageRight = new Image();
const playerImageDown = new Image();
const playerImageLeft = new Image();
const playerImageDead = new Image();
const zombieImageDown = new Image();
const zombieImageUp = new Image();
const zombieImageRight = new Image();
const zombieImageLeft = new Image();

let currentPlayerImage = playerImageUp;

let imagesToLoad = 9; // número de imágenes a cargar

function imageLoaded() {
  imagesToLoad--;
}
function areImagesLoaded() {
  return imagesToLoad === 0;
}

playerImageUp.onload = imageLoaded;
playerImageUp.src = "SRC_Zombies/up1.png";

playerImageRight.onload = imageLoaded;
playerImageRight.src = "SRC_Zombies/right1.png";

playerImageDown.onload = imageLoaded;
playerImageDown.src = "SRC_Zombies/down1.png";

playerImageLeft.onload = imageLoaded;
playerImageLeft.src = "SRC_Zombies/left1.png";

playerImageDead.onload = imageLoaded;
playerImageDead.src = "SRC_Zombies/dead1.png";

zombieImageUp.onload = imageLoaded;
zombieImageUp.src = "SRC_Zombies/zup1.png";

zombieImageRight.onload = imageLoaded;
zombieImageRight.src = "SRC_Zombies/zright1.png";

zombieImageDown.onload = imageLoaded;
zombieImageDown.src = "SRC_Zombies/zdown1.png";

zombieImageLeft.onload = imageLoaded;
zombieImageLeft.src = "SRC_Zombies/zleft1.png";

function initGame() {
  // Inicia el bucle del juego
  gameLoop();

  // Inicia la generación de zombies
  startZombieSpawner();

  // Inicia el aumento de velocidad de los zombies
  startZombieSpeedIncreaser();
}

function startGame() {
  if (!isGameRunning) {
    if (areImagesLoaded()) {
      
      isGameRunning = true;
      initGame();
      document.getElementById("startButton").style.display = "none";
    } else {
      loadImages(); // Llama a una función para cargar las imágenes si no están cargadas
    }
  }
}
document.getElementById("startButton").addEventListener("click", startGame);

// Actualiza el HUD
function updateHUD() {
  if (isGameRunning) {
    document.getElementById("score").textContent = `Kills: ${points}`;
    document.getElementById("health").textContent = `Health: ${playerHealth}`;
  }
}

// Función para disparar una bala
function shootBullet() {
  const bullet = {
    x: playerX + 16,
    y: playerY + 16,
    direction: currentPlayerImage,
  };
  bullets.push(bullet);
}

// Control de eventos de teclado
document.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    shootBullet();
  }
});

// Función para dibujar las balas
function drawBullets() {
  ctx.fillStyle = "yellow";
  for (const bullet of bullets) {
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Función para actualizar las balas
function updateBullets() {
  for (let i = 0; i < bullets.length; i++) {
    const bullet = bullets[i];

    if (bullet.direction === playerImageUp) {
      bullet.y -= bulletSpeed;
    } else if (bullet.direction === playerImageRight) {
      bullet.x += bulletSpeed;
    } else if (bullet.direction === playerImageDown) {
      bullet.y += bulletSpeed;
    } else if (bullet.direction === playerImageLeft) {
      bullet.x -= bulletSpeed;
    }

    // Remueve las balas que estén fuera de la pantalla
    if (
      bullet.x < 0 ||
      bullet.x > canvas.width ||
      bullet.y < 0 ||
      bullet.y > canvas.height
    ) {
      bullets.splice(i, 1);
      i--;
    }
  }
}

// Control de eventos de teclado
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    goLeft = true;
    currentPlayerImage = playerImageLeft;
  } else if (e.key === "ArrowRight") {
    goRight = true;
    currentPlayerImage = playerImageRight;
  } else if (e.key === "ArrowUp") {
    goUp = true;
    currentPlayerImage = playerImageUp;
  } else if (e.key === "ArrowDown") {
    goDown = true;
    currentPlayerImage = playerImageDown;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") {
    goLeft = false;
  } else if (e.key === "ArrowRight") {
    goRight = false;
  } else if (e.key === "ArrowUp") {
    goUp = false;
  } else if (e.key === "ArrowDown") {
    goDown = false;
  }
});

// Función para dibujar el jugador
function drawPlayer(x, y) {
  ctx.drawImage(currentPlayerImage, x, y, 44, 44);
}

// Función para actualizar la posición del jugador
function updatePlayerPosition() {
  if (goLeft) {
    playerX -= speed;
  }
  if (goRight) {
    playerX += speed;
  }
  if (goUp) {
    playerY -= speed;
  }
  if (goDown) {
    playerY += speed;
  }
}

function drawZombie(zombie) {
  ctx.drawImage(zombie.image, zombie.x, zombie.y, 44, 44);
}

function updateZombies() {
  for (const zombie of zombies) {
    const dx = playerX - zombie.x;
    const dy = playerY - zombie.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    zombie.x += (dx / distance) * zombieSpeed;
    zombie.y += (dy / distance) * zombieSpeed;

    // Comprueba si el zombie ha tocado al jugador
    const playerRadius = 16;
    const zombieRadius = 16;
    if (distance < playerRadius + zombieRadius) {
      playerHealth -= 1;

      if (playerHealth <= 0) {
        console.log("Game Over");
        endGame(); // Aquí puedes agregar el código para terminar el juego
      }
    }
  }
}

function checkZombieHit() {
  for (let i = 0; i < zombies.length; i++) {
    for (let j = 0; j < bullets.length; j++) {
      const dx = zombies[i].x - bullets[j].x;
      const dy = zombies[i].y - bullets[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 16 + 4) {
        zombies.splice(i, 1);
        i--;
        bullets.splice(j, 1);
        j--;

        points += 100;
      }
    }
  }
}

function spawnZombie() {
  const side = Math.floor(Math.random() * 4);
  let x, y;
  let zombieImage;

  switch (side) {
    case 0: // arriba
      x = Math.random() * canvas.width;
      y = 0;
      zombieImage = zombieImageDown;
      break;
    case 1: // derecha
      x = canvas.width;
      y = Math.random() * canvas.height;
      zombieImage = zombieImageLeft;
      break;
    case 2: // abajo
      x = Math.random() * canvas.width;
      y = canvas.height;
      zombieImage = zombieImageUp;
      break;
    case 3: // izquierda
      x = 0;
      y = Math.random() * canvas.height;
      zombieImage = zombieImageRight;
      break;
  }

  const zombie = {
    x: x,
    y: y,
    image: zombieImage,
  };

  zombies.push(zombie);
}

function drawZombies() {
  for (const zombie of zombies) {
    drawZombie(zombie);
  }
}

function gameLoop() {
  if (isGameRunning) {
    // Limpia el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Actualiza la posición del jugador
    updatePlayerPosition();

    // Dibuja el jugador
    drawPlayer(playerX, playerY);

    // Dibuja los zombies
    drawZombies();

    // Actualiza y dibuja las balas
    updateBullets();
    drawBullets();

    // Actualiza los zombies
    updateZombies();

    // Verifica si un zombie ha sido alcanzado por una bala
    checkZombieHit();

    // Actualiza el HUD
    updateHUD();
  }

  // Llama a gameLoop de nuevo para el siguiente cuadro
  requestAnimationFrame(gameLoop);
}

// Función principal del juego
let playerX = canvas.width / 2 - 16;
let playerY = canvas.height / 2 - 16;

// Control de la velocidad de generación de zombies
const zombieSpawnRate = 5000; // Cada 5000ms (5 segundos)

// Función para iniciar el temporizador de generación de zombies
function startZombieSpawner() {
  setInterval(spawnZombie, zombieSpawnRate);
}

// Inicia la generación de zombies
startZombieSpawner();

// Ajusta la velocidad de los zombies a medida que avanza el juego
const zombieSpeedIncreaseRate = 8000; // Cada 10000ms (10 segundos)

//Incrementa la velocidad de los zombies
function increaseZombieSpeed() {
  zombieSpeed += 0.01;
}

// Función para iniciar el temporizador de aumento de velocidad de los zombies
function startZombieSpeedIncreaser() {
  setInterval(increaseZombieSpeed, zombieSpeedIncreaseRate);
}

// Inicia el aumento de velocidad de los zombies
startZombieSpeedIncreaser();

// Función para terminar el juego
function endGame() {
  // Detiene la generación de zombies
  clearInterval(spawnZombie);

  // Detiene el aumento de velocidad de los zombies
  clearInterval(increaseZombieSpeed);

  // Cambia el estado del juego a no en curso
  isGameRunning = false;

  // Cambia la imagen del jugador a la imagen del jugador muerto
  currentPlayerImage = playerImageDead;

  // Actualiza la imagen del jugador en el canvas
  drawPlayer(playerX, playerY);

  // Muestra un mensaje de fin del juego
  ctx.fillStyle = "Red";
  ctx.font = "48px Arial";
  ctx.fontWeight = "bold";
  ctx.fillText("GAME OVER", canvas.width / 2 - 150, canvas.height / 2 - 80);

  // Cambia el nombre del botón startButton a "Reiniciar" y lo muestra
  const restartButton = document.getElementById("startButton");
  restartButton.textContent = "Reiniciar";
  restartButton.style.display = "block";
  restartButton.addEventListener("click", startGame);
}

// Modifica la función updateZombies para verificar si el jugador ha muerto
function updateZombies() {
  for (const zombie of zombies) {
    const dx = playerX - zombie.x;
    const dy = playerY - zombie.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    zombie.x += (dx / distance) * zombieSpeed;
    zombie.y += (dy / distance) * zombieSpeed;

    // Comprueba si el zombie ha tocado al jugador
    const playerRadius = 16;
    const zombieRadius = 16;
    if (distance < playerRadius + zombieRadius) {
      playerHealth -= 1;

      if (playerHealth <= 0) {
        GetPoints(points);
        endGame();
      }
    }
  }
}

// Agrega un evento de clic para reiniciar el juego
canvas.addEventListener("click", () => {
  if (!isGameRunning) {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Verifica si se ha hecho clic en el botón de reinicio
    if (
      clickX >= canvas.width / 2 - 50 &&
      clickX <= canvas.width / 2 + 50 &&
      clickY >= canvas.height / 2 + 40 &&
      clickY <= canvas.height / 2 + 80
    ) {
      // Reinicia todas las variables
      playerHealth = 100;
      currentPlayerImage = playerImageUp;
      zombies.length = 0;
      bullets.length = 0;
      points = 0;

      // Cambia el estado del juego a en curso
      isGameRunning = true;

      // Inicia la generación de zombies
      spawnZombie = setInterval(spawnZombies, spawnZombieInterval);

      // Inicia el aumento de velocidad de los zombies
      increaseZombieSpeed = setInterval(
        increaseZombiesSpeed,
        increaseZombieSpeedInterval
      );

      // Actualiza el HUD
      updateHUD();
    }
  }
});

function GetPoints(points){
  localStorage.setItem("driverPoints", points);
  let data ={
    id_user: parseInt(localStorage.getItem("id_user")),
    id_game: 3,
    score: points
  };
  console.log(data);
  CheckPoints(data);  
}

async function CheckPoints(data) {
  let url = "https://juegatonslapi.azurewebsites.net/api/Rankings";
  let exists = false;
  let dbranking = await GetInfo("Rankings", "");

  dbranking.forEach((ranking) => {
    if (parseInt(localStorage.getItem("id_user")) === ranking.id_user && 3 === ranking.id_game) {
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
  const leaderboardData = await PutRanking(3);
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

