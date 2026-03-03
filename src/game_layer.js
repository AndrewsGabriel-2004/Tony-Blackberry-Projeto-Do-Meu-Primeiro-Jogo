export default function createGame() {
  //JOGO LAYER

  const state = {
    players: {},
    energy: {},
    gridSize: 20,
  };

  const observers = [];

  function start() {
    const frequency = 2000;

    setInterval(addEnergy, frequency);
  }

  function subscribe(observerFunction) {
    observers.push(observerFunction);
  }

  function notifyAll(command) {
    for (const observerFunction of observers) {
      observerFunction(command);
    }
  }

  function setState(newState) {
    Object.assign(state, newState);
  }

  function addPlayers(command) {
    const playerID = command.playerID;
    const playerX =
      "playerX" in command
        ? command.playerX
        : Math.floor(Math.random() * state.gridSize);
    const playerY =
      "playerY" in command
        ? command.playerY
        : Math.floor(Math.random() * state.gridSize);

    state.players[playerID] = {
      x: playerX,
      y: playerY,
      score: 0,
    };

    notifyAll({
      type: "add-players",
      playerID: playerID,
      playerX: playerX,
      playerY: playerY,
    });
  }

  function removePlayers(command) {
    const playerID = command.playerID;

    delete state.players[playerID];

    notifyAll({
      type: "remove-players",
      playerID: playerID,
    });
  }

  function addEnergy(command) {
    const energyID = command
      ? command.energyID
      : Math.floor(Math.random() * 10000000);
    const energyX = command
      ? command.energyX
      : Math.floor(Math.random() * state.gridSize);
    const energyY = command
      ? command.energyY
      : Math.floor(Math.random() * state.gridSize);

    state.energy[energyID] = {
      x: energyX,
      y: energyY,
    };

    notifyAll({
      type: "add-energy",
      energyID: energyID,
      energyX: energyX,
      energyY: energyY,
    });
  }

  function removeEnergy(command) {
    const energyID = command.energyID;

    delete state.energy[energyID];

    notifyAll({
      type: "remove-energy",
      energyID: energyID,
    });
  }

  function movePlayer(command) {
    notifyAll(command);

    const grid = state.gridSize;

    const acepptedMoves = {
      ArrowUp(player) {
        player.y = (player.y - 1 + grid) % grid; // sai pelo topo → aparece embaixo
      },
      ArrowDown(player) {
        player.y = (player.y + 1) % grid; // sai embaixo → aparece no topo
      },
      ArrowLeft(player) {
        player.x = (player.x - 1 + grid) % grid; // sai pela esquerda → aparece na direita
      },
      ArrowRight(player) {
        player.x = (player.x + 1) % grid; // sai pela direita → aparece na esquerda
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
        player.score += 1;
        removeEnergy({ energyID });
        notifyAll({
          type: "score-update",
          playerID: playerID,
          score: player.score,
        });
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
    setState,
    subscribe,
    start,
  };
}
