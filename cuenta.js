var url = "https://juegatonslapi.azurewebsites.net/api/Users";
const avatares = [
    'SRC_Contacto/avatar1.png',
    'SRC_Contacto/avatar2.jpg',
    'SRC_Contacto/avatar3.png',
    'SRC_Contacto/avatar4.jpg',
    'SRC_Contacto/avatar5.png',
    'SRC_Contacto/avatar6.png',
    'SRC_Contacto/avatar7.png',
    'SRC_Contacto/avatar8.png',
    'SRC_Contacto/avatar9.jpg',
    'SRC_Contacto/avatar10.png'
];

function cambiarAvatar() {
    const selector = document.getElementById('avatarSelector');
    const avatar = document.getElementById('avatar');
    avatar.src = avatares[selector.value];
    UpdateProfile();
    localStorage.setItem("profile", avatar.src);
    console.log(localStorage.getItem("profile"));
    
    
}

function InjectUser(){
    let name = document.getElementById("name");
    let email = document.getElementById("email");
    const avatar = document.getElementById('avatar');

    name.textContent = localStorage.getItem("name") + " " + localStorage.getItem("surname");
    email.textContent = localStorage.getItem("email");
    CityConverter();
    avatar.setAttribute("src", localStorage.getItem("profile"));
}

//funcion que sirve para relacionar el id de la ciudad con el nombre de esta.
async function CityConverter(){
    var response = await GetInfo("Cities","");
    response.forEach(city => {
        if(city.id_city == parseInt(localStorage.getItem("id_city"))){
            let locality = document.getElementById("city");
            console.log(locality.textContent);
            locality.textContent = city.name + ", España";
        }
    });
    
}

async function GetInfo(path, datos /* string */) {
    // Pide a la Api la información referente a un usuario con nombreJugador = Usuario
    const response = await fetch(
      "https://juegatonslapi.azurewebsites.net/" + "api/" + path + "/" + datos
    );
  
    const data = await response.json();
  
    return data;
}

async function UpdateProfile(){
    let data;
    let users = await GetInfo("Users", "");
    users.forEach(user => {
        if(user.id_user == localStorage.getItem("id_user")){
            data = new UserId(parseInt(localStorage.getItem("id_user")), localStorage.getItem("name"), localStorage.getItem("surname"), localStorage.getItem("username"), localStorage.getItem("email"), localStorage.getItem("password"), parseInt(localStorage.getItem("id_city")), localStorage.getItem("profile"));
        }
    });
    console.log(data);
    let put = {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
    };
    console.log(put);
  
    await fetch(url, put).then((response) => {response.json()
    console.log(response)});
     
}

async function PutScore(){
  let total = 0;
    let users = await GetInfo("Rankings", "");
    users.forEach(user=>{
      if(user.id_user == parseInt(localStorage.getItem("id_user"))){
        switch(user.id_game){
          case 0:
            let space = document.getElementById("space");
            space.textContent = user.score;
            total += user.score;
            break;
          case 1:
            let drive = document.getElementById("drive");
            drive.textContent = user.score;
            total += user.score;
            break;
          case 2:
            let race = document.getElementById("race");
            race.textContent = user.score;
            total += user.score;
            break;
          case 3:
            let zombie = document.getElementById("zombie");
            zombie.textContent = user.score;
            total += user.score;
            break;
        }
      }
    })
    let points = document.getElementById("totalPoints");
    points.textContent = total;
}

InjectUser();
PutScore();


