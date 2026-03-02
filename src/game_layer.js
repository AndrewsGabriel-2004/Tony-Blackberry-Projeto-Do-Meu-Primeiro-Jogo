export default function createGame() {
  //JOGO LAYER

  const state = {
    players: {},
    energy: {},
  };

  function addPlayers(command) {
    const playerID = command.playerID;
    const playerX = command.playerX;
    const playerY = command.playerY;

    state.players[playerID] = {
      x: playerX,
      y: playerY,
    };
  }

  function removePlayers(command) {
    const playerID = command.playerID;

    delete state.players[playerID];
  }

  function addEnergy(command) {
    const energyID = command.energyID;
    const energyX = command.energyX;
    const energyY = command.energyY;

    state.energy[energyID] = {
      x: energyX,
      y: energyY,
    };
  }

  function removeEnergy(command) {
    const energyID = command.energyID;

    delete state.energy[energyID];
  }

  function movePlayer(command) {
    console.log(`Moving ${command.playerID} with ${command.keyPressed}`);

    const acepptedMoves = {
      ArrowUp(player) {
        console.log("Moving player Up");
        player.y = Math.max(player.y - 1, 0);
      },
      ArrowRight(player) {
        console.log("Moving player Right");
        player.x = Math.min(player.x + 1, 9);
      },
      ArrowDown(player) {
        console.log("Moving player Down");
        player.y = Math.min(player.y + 1, 9);
      },
      ArrowLeft(player) {
        console.log("Moving player Left");
        player.x = Math.max(player.x - 1, 0);
      },
    };

    const keyPressed = command.keyPressed;
    const playerID = command.playerID;
    const player = state.players[command.playerID];
    const moveFunction = acepptedMoves[keyPressed];

    if (player && moveFunction) {
      moveFunction(player);
      checkEnergyCollision(playerID);
    }
  }

  function checkEnergyCollision(playerID) {
    const player = state.players[playerID];
    console.log(`Checking energy collision for player ${playerID}`);

    for (const energyID in state.energy) {
      const energy = state.energy[energyID];

      if (player.x === energy.x && player.y === energy.y) {
        console.log(`Player ${playerID} collected energy ${energyID}`);
        removeEnergy({ energyID });
      }
    }
  }

  return {
    addPlayers,
    removePlayers,
    addEnergy,
    removeEnergy,
    movePlayer,
    state,
  };
}
