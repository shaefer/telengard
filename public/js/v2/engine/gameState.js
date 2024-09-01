let processing = false;
let lastActionCompleted;
let tickSeconds = 10;
let gameConfig = {
    mute: true
}

const initialGameState = {
    position: {x:3,y:3,z:0},
    currentEvent: null,
    class: 'barbarian',
    gender: 'm',
    level: 1,
    maxHp: 20,
    hp: 20,
    str: 18, //current dmg calculation is 1-str dmg.
    ac: 10,
    exp: 0,
    log: []
    //rooms visited
}

let gameState = Object.assign({}, initialGameState);
const dungeonViewSize = 5; /** Odd numbers only */

const GameLog = (message, type) => {
    const log = {
        message,
        type,
        time: new Date()
    }
    gameState.log.push(log);
}