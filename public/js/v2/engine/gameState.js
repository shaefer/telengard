let processing = false;
let lastActionCompleted;
let tickSeconds = 10;
let gameConfig = {
    mute: false,
    onlyDragons: false,
    percentChanceOfSpecialAttack: 99, //this globally sets all special attacks to a percent chance...most useful for testing.
    showFeatures: false,
    startWithSkills: true, //currently hardcoded to add stealth and biggamehunter
    chanceToFindQuarry: 25,
    bossesDefeated: [],    //example to test bosses defeated and tribute ['Troll King', 'Dracolich', 'Mecha-Dragon King'],
    tributeCooldown: 60000 * 5,
    testMonsters: false, //currently set this in monsters.js
}

const initialGameState = {
    position: {x:4,y:4,z:0},
    currentEvent: null,
    class: 'barbarian',
    gender: 'm',
    level: 1,
    maxHp: 20,
    hp: 20,
    baseStr: 18,
    strBonus: 0,
    str: 18, //current dmg calculation is 1-str dmg.
    luck: 1, //luck stat help with recovery or secrets
    dex: 10, //dex help with running
    cha: 10, //cha helps with negotiation. 
    ac: 10,
    exp: 0,
    fireResist: 1,
    gold: 0,
    beSafe: true,
    stealth: false, //only matters if the character has the stealth skill
    bigGameHunter: false, //only matters with the BigGameHunter skill
    bigGameHunterQuarry: '',
    log: [],
    skills: [],
    characterOptionsOpen: false,
    enemiesDefeated: [],
    uniqueEnemiesDefeated: new Set(),
    dungeonStats:[buildDungeonLevelStats(0), buildDungeonLevelStats(1), buildDungeonLevelStats(2), buildDungeonLevelStats(3), buildDungeonLevelStats(4)],
    dungeonKnowledge:[],
    bossesDefeated: [],
    lastThroneEvent: new Date() - (60000 * 5), //5 min ago
    roomsVisited: {} //each index will be a list of that dungeon level's rooms
}

//IDEA: Hunter power to search for specific monster and increase chance of encounter....would work well with traps. 

let gameState = Object.assign({}, initialGameState);
if (gameConfig.startWithSkills) {
    console.log('starting with skills')
    gameState.skills = [{name: 'Big Game Hunter'}, {name: 'Stealth'}];
    console.log(gameState);
}
if (gameConfig.bossesDefeated && gameConfig.bossesDefeated.length > 0) {
    gameState.bossesDefeated = gameConfig.bossesDefeated.slice();
    gameState.lastThroneEvent = new Date() - 0;
}
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
    let huntersGuildCount = 0;

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
            if (thisRoom.huntersGuild) huntersGuildCount++;
        }
    }
    return {dungeonRooms, innCount, fountainCount, throneCount, stairsDownCount, stairsUpCount, huntersGuildCount};
}