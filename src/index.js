const express = require("express");
const path = require("path");
const http = require("http");

const app = express();
const server = http.createServer(app);

server.listen(5001, () => {
  console.log("Servidor rodando na porta 5001");
});

app.use(express.static(path.join(__dirname, "public")));
