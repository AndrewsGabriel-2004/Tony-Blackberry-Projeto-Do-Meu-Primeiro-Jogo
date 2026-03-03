export default function createKeyboardListener(document) {
  //meu subscriber, onde os observers se inscrevem para receber as notificações de eventos de teclado. Ele tem uma função subscribe para adicionar os observers e uma função notifyAll para notificar todos os observers quando um evento de teclado ocorre.
  const state = {
    observes: [],
    playerID: null,
  };

  function registerPlayerID(playerID) {
    state.playerID = playerID;
  }

  function subscribe(observerFunction) {
    state.observes.push(observerFunction);
  }

  function notifyAll(command) {
    console.log(`Notifying ${state.observes.length} observers`);

    for (const observerFunction of state.observes) {
      observerFunction(command);
    }
  }

  document.addEventListener("keydown", handleKeydown);

  function handleKeydown(event) {
    //input layer
    const keyPressed = event.key;

    const command = {
      type: "move-player",
      playerID: state.playerID,
      keyPressed,
    };

    notifyAll(command);
  }
  return {
    subscribe,
    registerPlayerID,
  };
}
