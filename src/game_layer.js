export default function createGame() {
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

    state.players[playerID] = { x: playerX, y: playerY, score: 0 };

    notifyAll({ type: "add-players", playerID, playerX, playerY });
  }

  function removePlayers(command) {
    const playerID = command.playerID;
    delete state.players[playerID];
    notifyAll({ type: "remove-players", playerID });
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

    state.energy[energyID] = { x: energyX, y: energyY };
    notifyAll({ type: "add-energy", energyID, energyX, energyY });
  }

  function clearEnergy() {
    for (const energyID in state.energy) {
      delete state.energy[energyID];
    }
    notifyAll({ type: "clear-energy" });
  }

  function removeEnergy(command) {
    const energyID = command.energyID;
    delete state.energy[energyID];
    notifyAll({ type: "remove-energy", energyID });
  }

  function movePlayer(command) {
    notifyAll(command);

    const grid = state.gridSize;

    const acceptedMoves = {
      ArrowUp(player) {
        player.y = (player.y - 1 + grid) % grid;
      },
      ArrowDown(player) {
        player.y = (player.y + 1) % grid;
      },
      ArrowLeft(player) {
        player.x = (player.x - 1 + grid) % grid;
      },
      ArrowRight(player) {
        player.x = (player.x + 1) % grid;
      },
    };

    const { keyPressed, playerID } = command;
    const player = state.players[playerID];
    const moveFunction = acceptedMoves[keyPressed];

    if (player && moveFunction) {
      moveFunction(player);
      checkEnergyCollision(playerID);
      checkPlayerCollision(playerID, keyPressed);
    }
  }

  function checkEnergyCollision(playerID) {
    const player = state.players[playerID];

    for (const energyID in state.energy) {
      const energy = state.energy[energyID];

      if (player.x === energy.x && player.y === energy.y) {
        player.score += 1;
        removeEnergy({ energyID });
        notifyAll({ type: "score-update", playerID, score: player.score });
      }
    }
  }

  function checkPlayerCollision(attackerID, keyPressed) {
    const attacker = state.players[attackerID];
    const grid = state.gridSize;

    const pushMap = {
      ArrowUp: (p) => {
        p.y = (p.y - 2 + grid) % grid;
      },
      ArrowDown: (p) => {
        p.y = (p.y + 2) % grid;
      },
      ArrowLeft: (p) => {
        p.x = (p.x - 2 + grid) % grid;
      },
      ArrowRight: (p) => {
        p.x = (p.x + 2) % grid;
      },
    };

    for (const victimID in state.players) {
      if (victimID === attackerID) continue;

      const victim = state.players[victimID];

      if (attacker.x === victim.x && attacker.y === victim.y) {
        // quem tem mais pontos é o "grandão"
        const biggerID = attacker.score >= victim.score ? attackerID : victimID;
        const smallerID =
          attacker.score >= victim.score ? victimID : attackerID;
        const bigger = state.players[biggerID];
        const smaller = state.players[smallerID];

        if (bigger.score > smaller.score) {
          const stolen = Math.floor(smaller.score * 0.2);

          bigger.score += stolen;
          smaller.score = Math.max(0, smaller.score - stolen);

          // empurra o menor 2 casas na mesma direção do movimento
          const push = pushMap[keyPressed];
          if (push) push(smaller);

          notifyAll({
            type: "score-update",
            playerID: biggerID,
            score: bigger.score,
          });
          notifyAll({
            type: "score-update",
            playerID: smallerID,
            score: smaller.score,
          });
          notifyAll({
            type: "player-collision",
            attackerID: biggerID,
            victimID: smallerID,
            stolen,
            victimX: smaller.x,
            victimY: smaller.y,
          });
        }
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
    clearEnergy,
  };
}
