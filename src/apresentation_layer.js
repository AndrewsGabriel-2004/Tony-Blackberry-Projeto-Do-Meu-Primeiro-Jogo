function getSpriteForScore(score, sprites) {
  if (!sprites) return null;
  if (score >= 60) return sprites.lv4; // Master Chief
  if (score >= 30) return sprites.lv3; // Mario
  if (score >= 10) return sprites.lv2; // Sonic
  return null; // quadrado padrão abaixo de 20 pts
}

export default function renderScreen(
  game,
  requestAnimationFrame,
  screen,
  imgApple,
  currentPlayerID,
  sprites,
) {
  const context = screen.getContext("2d");
  const gridSize = game.state.gridSize || 10;
  context.clearRect(0, 0, gridSize, gridSize);

  for (const playerID in game.state.players) {
    const player = game.state.players[playerID];
    const isMe = playerID === currentPlayerID;
    const score = player.score ?? 0;
    const sprite = getSpriteForScore(score, sprites);

    if (sprite && sprite.complete && sprite.naturalWidth > 0) {
      // Sprite centralizado na célula, ligeiramente maior (1.5x1.5)
      const size = 1.5;
      const offset = (size - 1) / 2;
      context.drawImage(
        sprite,
        player.x - offset,
        player.y - offset,
        size,
        size,
      );
    } else {
      // Fallback: quadrado colorido
      context.fillStyle = isMe ? "#e94560" : "#4caf50";
      context.fillRect(player.x, player.y, 1, 1);
    }

    // Pontuação acima do player
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    const quadSize = screen.width / gridSize;
    context.fillStyle = isMe ? "#e94560" : "white";
    context.font = "bold 10px Arial";
    context.fillText(score, player.x * quadSize + 2, player.y * quadSize - 3);
    context.restore();
  }

  for (const energyID in game.state.energy) {
    const energy = game.state.energy[energyID];
    context.drawImage(imgApple, energy.x, energy.y, 1, 1);
  }

  requestAnimationFrame(() =>
    renderScreen(
      game,
      requestAnimationFrame,
      screen,
      imgApple,
      currentPlayerID,
      sprites,
    ),
  );
}
