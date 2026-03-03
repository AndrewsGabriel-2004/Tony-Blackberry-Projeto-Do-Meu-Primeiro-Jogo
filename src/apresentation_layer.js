export default function renderScreen(
  game,
  requestAnimationFrame,
  screen,
  imgApple,
  currentPlayerID,
) {
  const context = screen.getContext("2d");
  context.fillStyle = "white";
  const gridSize = game.state.gridSize || 10;
  context.clearRect(0, 0, gridSize, gridSize); //da o clean do tamanho do canvas, para evitar que os elementos anteriores fiquem na tela

  for (const playerID in game.state.players) {
    const player = game.state.players[playerID];
    context.fillStyle = "green";
    context.fillRect(player.x, player.y, 1, 1);

    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0); // sai da escala do canvas para escrever texto
    const quadSize = screen.width / (game.state.gridSize || 10);
    context.fillStyle = "black";
    context.font = "10px Arial";
    context.fillText(
      player.score ?? 0,
      player.x * quadSize + 2,
      player.y * quadSize - 2,
    );
    context.restore();
  }
  for (const energyID in game.state.energy) {
    const energy = game.state.energy[energyID];
    context.drawImage(imgApple, energy.x, energy.y, 1, 1);
  }

  const currentPlayer = game.state.players[currentPlayerID];

  if (currentPlayer) {
    context.fillStyle = "red";
    context.fillRect(currentPlayer.x, currentPlayer.y, 1, 1);
  }

  requestAnimationFrame(() =>
    renderScreen(
      game,
      requestAnimationFrame,
      screen,
      imgApple,
      currentPlayerID,
    ),
  );
}
