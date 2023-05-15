const registroDiv = document.querySelector("#registro");
const loginDiv = document.querySelector("#login");
const loginForm = document.querySelector("#login form");
const registrarseBtn = document.querySelector("#registrarse-btn");
const yaTengoCuentaBtn = document.querySelector("#ya-tengo-cuenta-btn");
const iniciarSesionBtn = document.querySelector("#iniciar-sesion-btn");

registrarseBtn.addEventListener("click", function (event) {
  event.preventDefault();
  registroDiv.style.display = "none";
  loginDiv.style.display = "block";
});

yaTengoCuentaBtn.addEventListener("click", function (event) {
  event.preventDefault();
  registroDiv.style.display = "none";
  loginDiv.style.display = "block";
});

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  });
