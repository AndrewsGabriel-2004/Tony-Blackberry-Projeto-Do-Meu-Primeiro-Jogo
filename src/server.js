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

// --- Countdown ---
let countdownInterval = null;
let timeRemaining = 0;
let gameRunning = false;

function startCountdown(seconds) {
  if (countdownInterval) clearInterval(countdownInterval);

  timeRemaining = seconds;
  gameRunning = true;

  sockets.emit("countdown-update", { timeRemaining });

  countdownInterval = setInterval(() => {
    timeRemaining -= 1;
    sockets.emit("countdown-update", { timeRemaining });

    if (timeRemaining <= 0) {
      clearInterval(countdownInterval);
      countdownInterval = null;
      gameRunning = false;

      const ranking = Object.entries(game.state.players)
        .map(([id, p]) => ({ playerID: id, score: p.score }))
        .sort((a, b) => b.score - a.score);

      sockets.emit("game-over", { ranking });
    }
  }, 1000);
}

game.subscribe((command) => {
  console.log(`> Emitting command: ${command.type}`);
  sockets.emit(command.type, command);
});

sockets.on("connection", (socket) => {
  const playerID = socket.id;
  console.log(`Player connected: ${playerID}`);

  game.addPlayers({ playerID });
  socket.emit("setup", game.state);

  if (gameRunning) {
    socket.emit("countdown-update", { timeRemaining });
  }

  socket.on("start-game", ({ duration }) => {
    console.log(`Starting game: ${duration}s`);
    for (const id in game.state.players) {
      game.state.players[id].score = 0;
    }
    sockets.emit("reset-scores");
    startCountdown(duration);
  });

  socket.on("disconnect", () => {
    game.removePlayers({ playerID });
    console.log(`Player disconnected: ${playerID}`);
  });

  socket.on("move-player", (command) => {
    command.playerID = playerID;
    command.type = "move-player";
    game.movePlayer(command);
  });
});

server.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
