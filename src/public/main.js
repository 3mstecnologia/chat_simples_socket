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

function addMessage(type, user, mensagem) {
  let ul = document.querySelector(".chatList");
  console.log(type, user, mensagem);
  switch (type) {
    case "status":
      ul.innerHTML += '<li class="m-status">  ' + mensagem + " </li>";
      break;
    case "msg":
      if (username == user) {
        ul.innerHTML +=
          '<li class="m-text"><span class="eumesmo">' +
          user +
          "</span>" +
          "->" +
          mensagem +
          " </li>";
      } else {
        ul.innerHTML +=
          '<li class="m-text"><span>' +
          user +
          "</span>" +
          "->" +
          mensagem +
          " </li>";
      }

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
    addMessage("status", null, data.joined + " -> entrou no chat");
  }
  if (data.left) {
    console.log(data.left);
    addMessage("status", null, data.left + " <- saiu no chat");
  }
  userList = data.list;
  renderUserList();
});

//verificando se foi digitado algo no campo de texto
chatTextInput.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    let txt = chatTextInput.value.trim();
    //limpando campo apos enviar mensagem
    chatTextInput.value = "";
    //verificando se foi digitado algo
    if (txt != "") {
      //enviando para o servidor a mensagem
      addMessage("msg", username, txt);
      socket.emit("send-msg", txt);
    }
  }
});
//mostrar-msg
socket.on("mostrar-msg", (data) => {
  addMessage("msg", data.user, data.msg);
});
//mostrar mensagem quando for desconectado
socket.on("disconnect", () => {
  addMessage("status", null, "Voce foi Desconectado!");
});
//mostrar mensagem de erro ao tentar se reconectar
socket.on("reconnect_error", () => {
  addMessage("status", null, "Erro ao tentar se Reconectar!");
});
//mostrar mensagem que conseguiu se reconectar e voltou ao chat
socket.on("reconnect", () => {
  addMessage("status", null, "Voce foi Reconectado!");
  //verificar se existe username e enviar requisição de join-request
  if (username != "") {
    socket.emit("join-request", username);
  }
});
