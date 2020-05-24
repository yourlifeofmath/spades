document.getElementById('createGameButton').addEventListener('click', (event) => {
    playerId = window.prompt("playerId: ");
    gameId = window.prompt("gameId: ");
    callCreateGame(playerId, gameId);
})

document.getElementById('joinGameButton').addEventListener('click', (event) => {
    playerId = window.prompt("playerId: ");
    gameId = window.prompt("gameId: ");
    position = window.prompt("position: ");
    callJoinGame(playerId, gameId, position);
})

document.getElementById('updateGameButton').addEventListener('click', (event) => {
    gameId = window.prompt("gameId: ");
    gameState = window.prompt("gameState: ");
    callUpdateGame(gameId, gameState);
})
