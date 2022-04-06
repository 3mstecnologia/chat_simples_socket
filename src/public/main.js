const socket = io();
let username = "";
let userList = [];

let paginaLogin = document.querySelector("#paginaLogin");
let paginaChat = document.querySelector("#paginaChat");

let loginNameInput = document.querySelector("#loginNameInput");
let chatTextInput = document.querySelector("#chatTextInput");

function renderUserList() {
  let ul = document.querySelector(".userList");
  ul.innerHTML = "";
  userList.forEach((i) => {
    ul.innerHTML += "<li>" + i + "</li>";
  });
}

//garantindo que a pagina de login vai aparecer primeiro
paginaLogin.style.display = "flex";
paginaChat.style.display = "none";

loginNameInput.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    //event.preventDefault();
    let name = loginNameInput.value.trim();
    if (name != "") {
      username = name;
      document.title = "Chat - " + username;
      socket.emit("join-request", username);
    }
    //socket.emit("login", loginNameInput.value);
  }
});

socket.on("user-ok", (list) => {
  //apos logado, a pagina de login vai sumir e a pagina de chat vai aparecer
  paginaLogin.style.display = "none";
  paginaChat.style.display = "flex";
  chatTextInput.focus(); //selecionando campo de enviar mensagem

  userList = list; // atualizando a lista de usuarios conectados
  renderUserList();
});
socket.on("list-update", (data) => {
  userList = data.list;
  renderUserList();
});
