var DEBUG = true
var BUTTONS = []

// TEMP PLACEHOLER STRUCT
function card(num, str) {
    // card number
    // 11 = Jack
    // 12 = Queen
    // 13 = King
    // 14 = Ace
    this.number = num,
    // card suit, must be one of "c", "d", "h", "s"
    this.suit = str
    this.toString = () => `${this.suit}-${this.number}`
}

function drawCardHand(drawFunc, card, args, handLoc){
    if (args.length !== 4){
        throw `Error: drawCard not given 4 arguments`
    }
    if (card == null){
        if (DEBUG){
            console.log("drawCardBoard given null card, aborting")
        }
        return
    }
    var img = new Image()
    img.onload = function () {
        output = drawFunc('drawImage', [img].concat(args))
        console.log(`CARD: ${output.slice(1, 6)}`)
        button = new canvasButton(
            `${handLoc}_${card.toString()}`, 
            output[1], 
            output[2], 
            output[3], 
            output[4],
            output[5])
        BUTTONS.push(button)
     }
    img.src = `./css/images/cards/${card.toString()}.svg`
}

function drawCardBoard(drawFunc, card, args){
    if (args.length !== 4){
        throw `Error: drawCard not given 4 arguments`
    }
    if (card == null){
        if (DEBUG){
            console.log("drawCardBoard given null card, aborting")
        }
        return
    }
    var img = new Image()
    img.onload = function () {
        output = drawFunc('drawImage', [img].concat(args))
     }
    img.src = `./css/images/cards/${card.toString()}.svg`
}

function clickReporter(e){
    if (DEBUG){
        console.log(`CLICK: ${[e.offsetX, e.offsetY]}`)
        console.log(`BUTTONS: ${BUTTONS.map(x => x.toString())}`)
    }
    clicked_buttons = BUTTONS.filter(button => 
        (button.x1 < e.offsetX) &
        (button.x2 > e.offsetX) &
        (button.y1 < e.offsetY) &
        (button.y2 > e.offsetY))

    if (clicked_buttons.length > 0){
        alert(`CLICKED: ${clicked_buttons.map(x => x.toString())}`)
    }
}

/**
 * Renders the gameState on the canvas
 * 
 * @param {Canvas} canvas html canvas object
 * @param {*} gameState current game state
 * @param {*} players mapping of positions to players
 * @param {*} localContext local context of this client
 */
function renderGameState(canvas, gameState, players, localContext) {
    canvas.addEventListener('click', clickReporter, false)
    var context = canvas.getContext('2d');

    // Coordinate variables
    max_x = canvas.width
    max_y = canvas.height
    board_start_x = Math.floor(max_x/3)
    hand_start_y = Math.floor(3*max_y/4)

    // Draw functions for each section
    const draw_panel = draw_function(context, 0, 0, board_start_x, hand_start_y)
    const draw_board =  draw_function(context, board_start_x, 0, max_x, hand_start_y)
    const draw_hand = draw_function(context, 0, hand_start_y, max_x, max_y, base_x = 13)

    // set foncts
    body_font = `${Math.floor(hand_start_y / 20)}px Courier`
    title_font = `${Math.floor(hand_start_y / 10)}px Courier`


    // Drawing
    context.clearRect(0, 0, max_x, max_y);

    // Background colors
    context.fillStyle = 'rgba(0, 0, 100, 0.1)'
    draw_panel('fillRect', [0, 0, 100, 100])
    context.fillStyle = 'rgba(0, 100, 0, 0.1)'
    draw_board('fillRect', [0, 0, 100, 100])
    context.fillStyle = 'rgba(100, 0, 0, 0.1)'
    draw_hand('fillRect', [0, 0, 100, 100])

    // Board
    board = [
        new card(13, 'd'),
        new card(2, 'j'),
        new card(13, 'h'),
        new card(13, 'c')]
    localPos = 1
    //Draw board cards, from 'my' card, clockwise
    drawCardBoard(draw_board, board[localPos], [40, 52, 20, 45])
    drawCardBoard(draw_board, board[(localPos+1) % 4], [10, 28, 20, 45])
    drawCardBoard(draw_board, board[(localPos+2) % 4], [40, 4, 20, 45])
    drawCardBoard(draw_board, board[(localPos+3) % 4], [70, 28, 20, 45])
    // Draw player names, from 'me', clockwise
    players = [
        'threat1',
        'me',
        'threat2',
        'buddy'
    ]
    context.font = body_font
    context.fillStyle = 'black'
    context.textAlign = "right"
    context.textBaseline = "bottom"
    draw_board('fillText', [players[localPos], 38, 98])
    context.fillStyle = 'red'
    context.textAlign = "left"
    draw_board('fillText', [players[(localPos + 1) % 4], 2, 26])
    context.fillStyle = 'black'
    context.textBaseline = "top"
    draw_board('fillText', [players[(localPos + 2) % 4], 62, 2])
    context.fillStyle = 'red'
    context.textAlign = "right"
    draw_board('fillText', [players[(localPos + 3) % 4], 98, 74])

    // Hand
    hand = [
        new card(14, 's'),
        new card(13, 's'),
        new card(12, 's'),
        new card(11, 's'),
        new card(10, 's'),
        new card(9, 's'),
        new card(8, 's'),
        new card(7, 's'),
        new card(6, 's'),
        new card(5, 's'),
        new card(4, 's'),
        new card(3, 'j')
    ]
    for (i = 0; i < hand.length; i++) {
        drawCardHand(draw_hand, hand[i], [i, 0, 1, 100], i)
    }

    // Panel
    context.fillStyle = 'black'
    context.textAlign = "center"
    context.textBaseline = "middle"
    draw_panel('fillText', [`gameState: ${gameState}`, 50, 5])
    draw_panel('fillText', ['METADATA', 50, 10])
    draw_panel('fillText', ['LAST_TRICK', 50, 50])
    draw_panel('fillText', ['SCORE', 50, 80])
}