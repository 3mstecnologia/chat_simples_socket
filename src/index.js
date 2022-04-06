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
    socket.usuariosConectados = username;
    usuariosConectados.push(username);
    console.log(usuariosConectados);

    socket.emit("user-ok", usuariosConectados);
    socket.broadcast.emit("list-update", {
      joined: username,
      list: usuariosConectados,
    });
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
    usuariosConectados = usuariosConectados.filter((u) => u != socket.username);

    console.log(usuariosConectados);
    socket.broadcast.emit("list-update", {
      left: socket.username,
      list: usuariosConectados,
    });
  });

  socket.on("chat message", (msg) => {
    console.log("Mensagem recebida: " + msg);
    io.emit("chat message", msg);
  });
});
