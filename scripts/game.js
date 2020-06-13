/*
///////////////
// GameState //
///////////////

{
    // position of dealer, tracks who starts play each round
    dealer: {Number},

    // current points of each team
    // teamPoints[0] = Team 0's points (positions 0,2)
    // teamPoints[1] = Team 1's points (positions 1,3)
    teamPoints: [{Number}]

    // round-specific state
    roundState: {
        // position of player to make next move
        actionPosition: {Number},

        // List of cards held by each player
        cards: {
            "0": [{Card}],
            "1": [{Card}],
            "2": [{Card}],
            "3": [{Card}]
        },

        // phase-specific state information
        phaseState: {
            // name of phase, must be one of the following:
            //     "BET_PHASE_0"
            //     "BET_PHASE_1"
            //     "BET_PHASE_2"
            //     "PLAY_PHASE"
            phaseName: {String},
            
            // List of positions of players who decide to blind nil
            blindNils: [{Number}],

            /////////////////////////vvv
            // If BET_PHASE_1

            // List of positions of players who have passed from betting
            passed: [{Number}],

            // Current maximum bet
            maxBet: {
                // position of player who made this bet
                position: {Number},

                // number of tricks bet
                trickCount: {Number},

                // proposed trump suit, must be one of "c", "d", "h", "s"
                trumpSuit: {String}
            },
            /////////////////////////^^^

            /////////////////////////vvv
            // If BET_PHASE_2

            // chosen trump suit, must be one of "c", "d", "h", "s"
            trumpSuit: {String},

            // map of player position to their bet trick counts
            bets: {
                "0": {Number},
                "1": {Number},
                "2": {Number},
                "3": {Number}
            },
            /////////////////////////^^^

            /////////////////////////vvv
            // If PLAY_PHASE

            // chosen trump suit (carried over from BET_PHASE_2)
            trumpSuit: {String},

            // total number of tricks each team needs to make
            // tricksToMake[0] = number of tricks Team 0 needs to make
            // tricksToMake[1] = number of tricks Team 1 needs to make
            tricksToMake: [{Number}],

            // cards in current trick
            currentTrick: {
                "0": {Card},
                "1": {Card},
                "2": {Card},
                "3": {Card}
            },

            // starting suit of current trick, must be one of "c", "d", "h", "s"
            startingSuit: {String}

            // number of tricks taken by each position
            tricksTaken: {
                "0": {Number},
                "1": {Number},
                "2": {Number},
                "3": {Number}
            }
            /////////////////////////^^^
        }
    }
}
*/

/*
//////////
// Move //
//////////

{
    // position of player making this move
    actionPosition: {Number},

    // name of phase, must be one of the following:
    //     "BET_PHASE_0"
    //     "BET_PHASE_1"
    //     "BET_PHASE_2"
    //     "PLAY_PHASE"
    phaseName: {String},

    /////////////////////////vvv
    // If BET_PHASE_0

    // True if the move-maker wants to go blind nil, false otherwise
    goBlindNil: {Boolean},
    /////////////////////////^^^

    /////////////////////////vvv
    // If BET_PHASE_1

    // True if the move-maker wants to pass, false otherwise
    goPass: {Boolean},

    // number of tricks to bet (ignored if goPass == true)
    trickCount: {Number},

    // trump suit, must be one of "c", "d", "h", "s" (ignored if goPass == true)
    trumpSuit: {String},
    /////////////////////////^^^

    /////////////////////////vvv
    // If BET_PHASE_2

    // number of tricks to bet
    trickCount: {Number},
    /////////////////////////^^^

    /////////////////////////vvv
    // If PLAY_PHASE

    // card to play
    card: {Card}
    /////////////////////////^^^
}
*/

/*
//////////
// Card //
//////////

{
    // card number
    // 11 = Jack
    // 12 = Queen
    // 13 = King
    // 14 = Ace
    number: {Number},

    // card suit, must be one of "c", "d", "h", "s"
    suit: {String}
}
*/

function makeMoveIfValid(gameState, move) {
    if (isValidMove(gameState, move)) {
        return makeMove;
    }
}

/**
 * Checks if the move is legal for the gameState
 * 
 * @param {GameState} gameState current game state
 * @param {Move} move move to make
 * 
 * @returns true if move is legal, false otherwise
 */
function isValidMove(gameState, move) {
    /* TODO: implement */
}

/**
 * Generates a new game state by applying a move to a game state
 * 
 * This function assumes that the move is legal
 * 
 * @param {GameState} gameState current game state
 * @param {Move} move move to make
 * 
 * @returns new game state
 */
function makeMove(gameState, move) {
    /* TODO: implement */
    /* return newGameState */
}
