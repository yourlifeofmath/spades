/**
 * Renders the gameState on the canvas
 * 
 * @param {Canvas} canvas html canvas object
 * @param {*} gameState current game state
 * @param {*} players mapping of positions to players
 * @param {*} localContext local context of this client
 */
function renderGameState(canvas, gameState, players, localContext) {
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = '10px Courier'
    context.fillStyle = 'black';
    context.fillText(gameState, 5, 15);
}