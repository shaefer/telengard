let processing = false;
let lastActionCompleted;
let tickSeconds = 10;
let gameConfig = {
    mute: true
}
let gameState = {
    position: {x:3,y:3,z:0},
    currentEvent: null,
    class: 'barbarian',
    gender: 'm'
    //rooms visited
};
const dungeonViewSize = 5; /** Odd numbers only */