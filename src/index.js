const express = require("express");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");
const app = express();
const server = http.createServer(app);

const io = socketIO(server);

server.listen(5001, () => {
  console.log("Servidor rodando na porta 5001");
});

app.use(express.static(path.join(__dirname, "public")));

let usuariosConectados = [];

// Quando um cliente se conectar ao servidor
io.on("connection", (socket) => {
  console.log("Cliente conectado");

  socket.on("join-request", (username) => {
    socket.username = username;
    usuariosConectados.push(username);
    console.log(usuariosConectados);

    //atualizando a lista de usuarios
    socket.emit("user-ok", usuariosConectados);

    //avisando a todos que um novo usuario entrou
    socket.broadcast.emit("list-update", {
      joined: username,
      list: usuariosConectados,
    });
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
    //remover usuario desconectado
    usuariosConectados = usuariosConectados.filter(
      (usuario) => usuario !== socket.username
    );
    //usuariosConectados = usuariosConectados.filter((u) => u != socket.username);
    console.log("saiu " + socket.usuario);
    console.log(usuariosConectados);
    socket.broadcast.emit("list-update", {
      left: socket.username,
      list: usuariosConectados,
    });
  });

  socket.on("send-msg", (msg) => {
    let obj = {
      user: socket.username,
      msg: msg,
    };
    console.log(obj);
    //enviando para o cliente a mensagem
    //socket.emit("mostrar-msg", obj);
    socket.broadcast.emit("mostrar-msg", obj);
  });
});
