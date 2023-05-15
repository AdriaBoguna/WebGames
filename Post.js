var url = "https://juegatonslapi.azurewebsites.net/api/Users";
//Obtenemos informacion del form
function GetData() {
  //DOM Selectors
  let form = document.querySelector("form");
  let data = form.querySelectorAll("input");
  let ciudad = document.getElementById("ciudad").value;
  let defaultProfile = "SRC_Contacto/avatar1.png";
  
  var user = new User(data[0].value, data[1].value, data[2].value, data[3].value, data[4].value, parseInt(ciudad), defaultProfile);


//Creacion del objeto user
  // let user = {
  //   name: data[0].value,
  //   surname: data[1].value,
  //   username: data[2].value,
  //   email: data[3].value,
  //   password: data[4].value,
  //   id_city: ciudad,
  //   profile: "avatar1.png",
  // };



  //Si la informacion es correcta retornamos el objeto user
  if (CheckData(user)) {
    console.log(user + "\n Creeating Account");
    return user;
  } else alert("Account not created");
}

//Comprobamos que no haya repetido email
async function CheckData(user) {
  let dbuser = await GetInfo("Users", "");

  //Foreach comprobando la existencia del email
  dbuser.forEach((emails) => {
    if (user.email === emails.email) {
      //El email ya está en uso por otra cuenta
      alert("Este correo electrónico ya está en uso.");

      console.log("Used");
      return true;
    }
  });

  console.log("Correct Email");
  //El email no está en uso
  return false;
}

//Obtenemos la info del server y la retornamos
async function GetInfo(path, datos /* string */) {
  // Pide a la Api la información referente a un usuario con nombreJugador = Usuario
  const response = await fetch(
    "https://juegatonslapi.azurewebsites.net/" + "api/" + path + "/" + datos
  );

  const data = await response.json();

  return data;
}

//Funcion que registra la cuenta
function RegisterAccount() {
  //Obtenemos el objeto user de GetData, en caso de ser email repetido, tendrá valor null
  let userInfo = GetData();
  console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
  //console.log(userInfo.email);

  if (userInfo == null) {
    alert("No se puede registrar la cuenta.");
  }

  //POST de la cuenta para poder registrarla en nuestra BBDD
  else {
    let post = {
      method: "POST",
      body: JSON.stringify(userInfo),
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch(url, post).then((response) => response.json());
  }
}

//-----------------------------------------------------------------------------------------------------
//------------------------------------------SIGN IN----------------------------------------------------

async function SignIn() {
  let login = false;
  let form = document.querySelectorAll("form")[1];
  let data = form.querySelectorAll("input");

  let userInfo = await GetInfo("Users", "");
  console.log("Aaaa");
  userInfo.forEach((emails) => {
    console.log(data[0].value);
    console.log(emails.email);
    if (data[0].value === emails.email) {
      if (data[1].value === emails.password) {
        var user = {
          username: data[0],
          profile: emails.profile,
          password: emails.password,
        };
        UserCookies(emails);
        login = true;
        return user;
      } else {
        alert("Contraseña incorrecta");
        return null;
      }
    }
  });
  if(!login){
    alert("El correo no está registrado");
  return false;
  }
  
}


async function LogIn() {
  localStorage.clear();
  var logIn = await SignIn();

  if (logIn == undefined) {
    document
      .getElementById("iniciar-sesion-btn")
      .setAttribute("onclick", "window.location.href='index.html'");
  } else return false;
}

async function UserCookies(user){
  localStorage.setItem("id_user", user.id_user);
  localStorage.setItem("name", user.name);
  localStorage.setItem("surname", user.surname);
  localStorage.setItem("username", user.username);
  localStorage.setItem("email", user.email);
  localStorage.setItem("password", user.password);
  localStorage.setItem("id_city", user.id_city);
  localStorage.setItem("profile", user.profile);
}
