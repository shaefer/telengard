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
    baseStr: 18,
    str: 18, //current dmg calculation is 1-str dmg.
    luck: 1, //luck stat help with recovery or secrets
    dex: 10, //dex help with running
    cha: 10, //cha helps with negotiation. 
    ac: 10,
    exp: 0,
    log: []
    //rooms visited
}

//IDEA: Hunter power to search for specific monster and increase chance of encounter....would work well with traps. 

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