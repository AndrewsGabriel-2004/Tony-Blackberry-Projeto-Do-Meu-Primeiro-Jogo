export default function renderScreen(
  game,
  requestAnimationFrame,
  screen,
  imgApple,
) {
  const context = screen.getContext("2d");
  context.fillStyle = "white";
  context.clearRect(0, 0, 10, 10); //da o clean do tamanho do canvas, para evitar que os elementos anteriores fiquem na tela

  for (const playerID in game.state.players) {
    const player = game.state.players[playerID];
    context.fillStyle = "green";
    context.fillRect(player.x, player.y, 1, 1);
  }
  for (const energyID in game.state.energy) {
    const energy = game.state.energy[energyID];
    context.drawImage(imgApple, energy.x, energy.y, 1, 1);
  }
  requestAnimationFrame(() =>
    renderScreen(game, requestAnimationFrame, screen, imgApple),
  );
}
