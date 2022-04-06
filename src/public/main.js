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
function addMessage(type, user, msg) {
  let ul = document.querySelector(".chatList");

  switch (type) {
    case "status":
      ul.innerHTML += '<li class="m-status">' + msg + "</li>";
      break;
    case "msg":
      ul.innerHTML +=
        '<li class="m.text><span>' + user + '</span>"' + msg + "</li>";
      break;
  }
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
  addMessage("status", null, "Conectado!");

  userList = list; // atualizando a lista de usuarios conectados
  renderUserList();
});
socket.on("list-update", (data) => {
  if (data.joined) {
    addMessage("status", null, data.joined + "entrou no chat");
  }
  if (data.left) {
    addMessage("status", null, data.joined + "saiu no chat");
  }
  userList = data.list;
  renderUserList();
});
