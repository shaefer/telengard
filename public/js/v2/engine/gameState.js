let processing = false;
let lastActionCompleted;
let tickSeconds = 10;
let gameConfig = {
    mute: true
}
let gameState = {
    position: {x:3,y:3,z:0}
    //rooms visited
};
const dungeonViewSize = 7; /** Odd numbers only */