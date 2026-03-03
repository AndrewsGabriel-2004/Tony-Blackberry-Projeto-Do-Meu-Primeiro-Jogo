import express from "express";
import http from "http";
import createGame from "./game_layer.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const sockets = new Server(server);

app.use(express.static("src"));

const game = createGame();
game.start();

game.subscribe((command) => {
  console.log(`> Emitting command: ${command.type}`);

  sockets.emit(command.type, command);
});

sockets.on("connection", (socket) => {
  const playerID = socket.id;
  console.log(`Player connected on Server with ID: ${socket.id}`);

  game.addPlayers({ playerID: playerID });
  console.log(game.state);

  socket.emit("setup", game.state);

  socket.on("disconnect", () => {
    game.removePlayers({ playerID: playerID });
    console.log(`Player disconnected on Server with ID: ${playerID}`);
  });

  socket.on("move-player", (command) => {
    command.playerID = playerID; //aqui é para garantir que o playerID do comando seja o mesmo do player que enviou o comando, para evitar que um jogador possa enviar comandos para outro jogador
    command.type = "move-player"; //aqui é para garantir que o tipo do comando seja "move-player", para evitar que um jogador possa enviar comandos com tipos diferentes, que poderiam ser usados para explorar vulnerabilidades no jogo

    game.movePlayer(command);
  });
});

server.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
