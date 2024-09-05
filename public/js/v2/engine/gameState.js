let processing = false;
let lastActionCompleted;
let tickSeconds = 10;
let gameConfig = {
    mute: false,
    onlyDragons: false,
    percentChanceOfDragonFire: 40,
    showFeatures: false
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
    fireResist: 1,
    log: [],
    dungeonStats:[buildDungeonLevelStats(0)],
    dungeonKnowledge:[],
    bossesDefeated: [],
    lastThroneEvent: new Date() - (60000 * 5) //5 min ago
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

function buildDungeonLevelStats(z) {
    const dungeonRooms = [];
    let innCount = 0;
    let fountainCount = 0;
    let throneCount = 0;
    let stairsDownCount = 0;
    let stairsUpCount = 0;

    const dungeonLevel = new DungeonLevel(z);
    for(let i = 0;i<=dungeonLevel.floorWidth-1;i++) {
        for(let j = 0;j<=dungeonLevel.floorHeight-1;j++) {
            const thisRoom = new DungeonRoom(i, j, z);
            dungeonRooms.push(thisRoom);
            if (thisRoom.inn) innCount++;
            if (thisRoom.fountain) fountainCount++;
            if (thisRoom.throne) throneCount++;
            if (thisRoom.stairsDown) stairsDownCount++;
            if (thisRoom.stairsUp) stairsUpCount++;
        }
    }
    return {dungeonRooms, innCount, fountainCount, throneCount, stairsDownCount, stairsUpCount};
}

function bossDefeated(enemy) {
    return gameState.bossesDefeated.includes(enemy.boss);
}