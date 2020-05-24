// Create WebSocket connection
const socket = new WebSocket('wss://n9pocuwbue.execute-api.us-east-2.amazonaws.com/beta');

// Connection opened
socket.addEventListener('open', (event) => console.log('Websocket connection opened'));

// Listen for messages
socket.addEventListener('message', function (event) {
    console.log('Message from server: ', event.data);
    if (isValidJson(event.data)) {
        const eventData = JSON.parse(event.data);
        if (eventData.players != undefined && eventData.gameState != undefined) {
            const canvas = document.getElementById('gameCanvas');
            renderGameState(canvas, eventData.gameState, eventData.players, null);
        }
    }
});

function callCreateGame(playerId, gameId) {
    message = JSON.stringify({
        "route": "createGame",
        "playerId": playerId,
        "gameId": gameId
    })
    console.log('Calling createGame api: ' + message);
    socket.send(message);
}

function callJoinGame(playerId, gameId, position) {
    message = JSON.stringify({
        "route": "joinGame",
        "playerId": playerId,
        "gameId": gameId,
        "position": position
    })
    console.log('Calling joinGame api: ' + message);
    socket.send(message);
}

function callUpdateGame(gameId, gameState) {
    message = JSON.stringify({
        "route": "updateGame",
        "gameId": gameId,
        "gameState": gameState
    })
    console.log('Calling updateGame api: ' + message);
    socket.send(message);
}