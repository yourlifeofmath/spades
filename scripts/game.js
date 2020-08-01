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

    // current bags of each team
    // teamBags[0] = Team 0's bags (positions 0,2)
    // teamBags[1] = Team 1's bags (positions 1,3)
    teamBags: [{Number}]

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
            // this will be null at the beginning of BET_PHASE_1
            maxBet: {
                // position of player who made this bet
                position: {Number},

                // number of tricks bet
                trickCount: {Number},

                // proposed trump suit, must be one of "c", "d", "h", "s", "z"
                // "z" represents "no trump"
                trumpSuit: {String}
            },
            /////////////////////////^^^

            /////////////////////////vvv
            // If BET_PHASE_2

            // chosen trump suit, must be one of "c", "d", "h", "s", "z"
            trumpSuit: {String},

            // map of player position to their bet trick counts
            // the trick count at each position can be null; it CANNOT be undefined
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

            // whether or not trump has been broken
            trumpBroken: {Boolean},

            // starting suit of current trick, must be one of "c", "d", "h", "s"
            // this value is null at the beginning of each trick
            trickStartSuit: {String}

            // position that started the current trick
            trickStartPosition: {Number}

            // cards in current trick
            // the card at each position can be null; it CANNOT be undefined
            currentTrick: {
                "0": {Card},
                "1": {Card},
                "2": {Card},
                "3": {Card}
            },

            // map of player position to their bet trick counts (carried over from BET_PHASE_2)
            bets: {
                "0": {Number},
                "1": {Number},
                "2": {Number},
                "3": {Number}
            },

            // number of tricks taken by each position
            // all position values are initialized as 0; they are NEVER null or undefined
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

    // trump suit, must be one of "c", "d", "h", "s", "z" (ignored if goPass == true)
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

const BET_PHASE_0 = "BET_PHASE_0";
const BET_PHASE_1 = "BET_PHASE_1";
const BET_PHASE_2 = "BET_PHASE_2";
const PLAY_PHASE = "PLAY_PHASE";
const TRICKS_PER_GAME = 13;

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
    if (gameState.roundState.actionPosition !== move.actionPosition) return false;
    if (gameState.phaseName !== move.phaseName) return false;

    switch (move.phaseName) {
        case BET_PHASE_0:
            if (typeof move.goBlindNil !== "boolean") return false;
            break;
        case BET_PHASE_1:
            if (typeof move.goPass !== "boolean") return false;

            if (!move.goPass) {
                if (!Number.isInteger(move.trickCount)) return false;
                if (!isValidSuit(move.trumpSuit)) return false;

                // Can't bet more than 13
                if (move.trickCount > TRICKS_PER_GAME) return false;
                // Can't bet negative
                if (move.trickCount < 0) return false;

                var maxBet = gameState.roundState.phaseState.maxBet;
                // Can't bet less than current max bet
                if (move.trickCount < maxBet.trickCount) return false;
                // Can't bet same trick count as current max bet with a weaker suit
                if (move.trickCount == maxBet.trickCount && move.trumpSuit <= maxBet.trumpSuit) return false;
            }
            break;
        case BET_PHASE_2:
            if (!Number.isInteger(typeof move.trickCount)) return false;
            
            var partnerPos = partnerPosition(move.actionPosition);
            var partnerBetTrickCount = gameState.roundState.phaseState.bets[partnerPos];

            // Total tricks bet per team can't exceed 13
            if (move.trickCount + partnerBetTrickCount > TRICKS_PER_GAME) return false;
            // Bet cannot be negative
            if (move.trickCount < 0) return false;
            break;
        case PLAY_PHASE:
            if (!isValidCard(move.card)) return false;

            var hand = gameState.roundState.cards[move.actionPosition];

            // Player must be holding the card to play it
            if (hand.every((card) => !cardsEqual(card, move.card))) return false;

            // First player of trick cannot play trump if trump has not been broken
            if (move.actionPosition === gameState.roundState.phaseState.trickStartPosition &&
                move.card.suit === gameState.roundState.phaseState.trumpSuit &&
                !gameState.roundState.phaseState.trumpBroken)
            {
                return false;
            }
            
            var trickStartSuit = gameState.roundState.phaseState.trickStartSuit;

            // Player can only play off starting suit if they are out of that suit
            if (move.actionPosition !== gameState.roundState.phaseState.trickStartPosition &&
                move.card.suit !== trickStartSuit &&
                hand.some((card) => card.suit === trickStartSuit))
            { 
                return false;
            }
            break;
        default:
            return false;
    }

    return true;
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
    var phaseState = gameState.roundState.phaseState;

    switch (phaseState.phaseName) {
        case BET_PHASE_0:
            phaseState.blindNils.push(move.actionPosition);
            gameState.roundState.actionPosition = nextPosition(move.actionPosition);
            
            // If we have looped back to the dealer position, proceed to next phase
            if (gameState.roundState.actionPosition === gameState.dealer) {
                if (phaseState.blindNils.length == 4) {
                    // If for some reason everyone has blind nil'd, proceed to PLAY_PHASE
                    gameState.roundState.phaseState = {
                        phaseName: PLAY_PHASE,
                        blindNils: phaseState.blindNils,
                        trumpSuit: "z",
                        trumpBroken: false,
                        trickStartSuit: null,
                        trickStartPosition: gameState.roundState.actionPosition,
                        currentTrick: initPositionMap(null),
                        bets: initPositionMap(0),
                        tricksTaken: initPositionMap(0)
                    }
                } else {
                    // Otherwise proceed to BET_PHASE_1
                    gameState.roundState.phaseState = {
                        phaseName: BET_PHASE_1,
                        blindNils: phaseState.blindNils,
                        passed: [],
                        maxBet: null
                    }

                    // action position should be on first position who did not blind nil
                    while (phaseState.blindNils.includes(gameState.roundState.actionPosition)) {
                        gameState.roundState.actionPosition = nextPosition(gameState.roundState.actionPosition);
                    }
                }
            }
            break;
        case BET_PHASE_1:
            if (move.goPass) {
                phaseState.passed.push(move.actionPosition);

                if (phaseState.passed.length === 3 && phaseState.maxBet )
            } else {

            }
            break;
        case BET_PHASE_2:
            break;
        case PLAY_PHASE:
            break;
    }

    return gameState;
}

/**
 * Checks if a string is a valid suit value, i.e. if it is one of "c", "d", "h", "s"
 * 
 * @param {String} suit 
 * 
 * @returns {Boolean} true if suit is one of "c", "d", "h", "s", false otherwise
 */
function isValidSuit(suit) {
    return suit === "c" || suit === "d" || suit === "h" || suit === "s"
}

/**
 * Checks if a string is a valid trump suit, i.e. if it is one of "c", "d", "h", "s", "z"
 * 
 * "z" represents "no trump"
 * 
 * @param {String} suit
 * 
 * @returns {Boolean} true if suit is "c", "d", "h", "s", "z", false otherwise
 */
function isValidTrumpSuit(suit) {
    return isValidSuit(suit) || suit === "z"
}

/**
 * Checks if a card is a valid card
 * 
 * @param {Card} card 
 * 
 * @returns {Boolean} true if card is a valid card, false otherwise
 */
function isValidCard(card) {
    return isValidSuit(card.suit)        &&
           Number.isInteger(card.number) &&
           card.number > 0               &&
           card.number <= 13;
}

/**
 * Checks if two cards are the same
 * 
 * @param {Card} card1 
 * @param {Card} card2
 * 
 * @returns {Boolean} true if cards are the same, false otherwise 
 */
function cardsEqual(card1, card2) {
    return card1.number === card2.number && card1.suit === card2.suit;
}

/**
 * Creates an initial position map
 * 
 * @param {*} initValue (optional) value that all positions in the map will take
 * 
 * @returns {Object} a map with positions 1,2,3,4 initialized with initValue
 */
function initPositionMap(initValue) {
    if (initValue === undefined) initValue = null;
    return {
        "1": initValue,
        "2": initValue,
        "3": initValue,
        "4": initValue
    }
}

/**
 * Increment an integer i (mod 4)
 * 
 * @param {Number} i 
 * 
 * @returns {Number} (i + 1) % 4
 */
function nextPosition(i) {
    return (i + 1) % 4;
}

/**
 * Get the position of a position's partner
 * 
 * @param {Number} i 
 * 
 * @returns {Number} (i + 2) % 4
 */
function partnerPosition(i) {
    return (i + 2) % 4;
}
