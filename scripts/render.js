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

    // Coordinate variables
    max_x = canvas.width
    max_y = canvas.height
    board_start_x = max_x/4
    hand_start_y = 3*max_y/4

    // Draw functions for each section
    const draw_panel = draw_function(context, 0, 0, board_start_x, max_y)
    const draw_board =  draw_function(context, board_start_x, 0, max_x, hand_start_y)
    const draw_hand = draw_function(context, board_start_x, hand_start_y, max_x, max_y)
    
    // Drawing
    context.clearRect(0, 0, max_x, max_y);

    context.fillStyle = 'rgba(0, 0, 100, 0.1)'
    draw_panel('fillRect', [0, 0, 100, 100])
    context.fillStyle = 'rgba(0, 100, 0, 0.1)'
    draw_board('fillRect', [0, 0, 100, 100])
    context.fillStyle = 'rgba(100, 0, 0, 0.1)'
    draw_hand('fillRect', [0, 0, 100, 100])

    context.font = '20px Courier'
    context.fillStyle = 'black'
    draw_board('fillText', ['BOARD', 40, 10])
    draw_hand('fillText', ['HAND', 40, 40])
    draw_panel('fillText', ['METADATA', 25, 10])
    draw_panel('fillText', ['SCORE', 30, 40])
    draw_panel('fillText', ['LAST TRICK', 15, 60])

    context.font = '12px Courier'
    context.fillStyle = 'black'
    draw_panel('fillText', [`gameState: ${gameState}`, 5, 15], resize=false)
}