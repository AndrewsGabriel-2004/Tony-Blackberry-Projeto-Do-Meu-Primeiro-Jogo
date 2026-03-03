export default function createGame() {
  //JOGO LAYER

  const state = {
    players: {},
    energy: {},
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
      "playerX" in command ? command.playerX : Math.floor(Math.random() * 10);
    const playerY =
      "playerY" in command ? command.playerY : Math.floor(Math.random() * 10);

    state.players[playerID] = {
      x: playerX,
      y: playerY,
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
    const energyX = command ? command.energyX : Math.floor(Math.random() * 10);
    const energyY = command ? command.energyY : Math.floor(Math.random() * 10);

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
  }

  function movePlayer(command) {
    notifyAll(command);

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
    setState,
    subscribe,
    start,
  };
}
