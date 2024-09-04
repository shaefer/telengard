function updateGameAndDisplay(newPosition) {
    drawDungeonAroundSquare(newPosition);
    drawRoomObjects(newPosition);
    displayPlayer(newPosition);
    displayLog();
    drawOptions(newPosition);
    if (gameState.enemy) {
        drawEnemy(newPosition, gameState.enemy);
    }
    gameState.position = newPosition;
}

function handleFeatures(newPosition) {
    const newRoom = new DungeonRoom(newPosition.x, newPosition.y, newPosition.z);
    if (newRoom.hasFeature) {
        console.log("Stepped right and newRoom hasFeature")
        if (newRoom.stairsDown) {
            gameState.currentEvent = 'stairs down';
            gameState.options = "[<span class='logOption'>G</span>]o down. [<span class='logOption'>I</span>]gnore."
            drawOptions(newPosition);
            displayPlayerStats();
        }
        if (newRoom.stairsUp) {
            gameState.currentEvent = 'stairs up';
            gameState.options = "[<span class='logOption'>G</span>]o up. [<span class='logOption'>I</span>]gnore."
            drawOptions(newPosition);
            displayPlayerStats();
        }
        if (newRoom.fountain) {
            gameState.currentEvent = 'fountain';
            gameState.options = "[<span class='logOption'>D</span>]rink from the fountain. [<span class='logOption'>I</span>]gnore."
            drawOptions(newPosition);
            displayPlayerStats();
        }
        if (newRoom.inn) {
            gameState.currentEvent = 'inn';
            gameState.options = "[<span class='logOption'>V</span>]isit the inn. [<span class='logOption'>I</span>]gnore."
            drawOptions(newPosition);
            displayPlayerStats();
        }
        return false;
    } else {
        return true;
    }
}

const handleStandardActions = _.debounce(function handleStandardActions(action) {
    console.log('processing action: ' + action);
    if (action == 'Entering the Dungeon') {
        
    }
    if (action == 'ArrowRight' && !gameState.currentEvent) {
        const newPosition = {x:gameState.position.x + 1, y:gameState.position.y, z:gameState.position.z};
        const currentRoom = new DungeonRoom(gameState.position.x, gameState.position.y, gameState.position.z);
        if (!currentRoom.eastWall.wallExists) {
            updateGameAndDisplay(newPosition);
            return handleFeatures(newPosition);
        } else {
            console.log("Can't walk through walls.");
            return false;
        }
       
    }
    if (action == 'ArrowLeft' && !gameState.currentEvent) {
        const newPosition = {x:gameState.position.x-1, y:gameState.position.y, z:gameState.position.z};
        const currentRoom = new DungeonRoom(gameState.position.x, gameState.position.y, gameState.position.z);
        if (!currentRoom.westWall.wallExists) {
            updateGameAndDisplay(newPosition);
            return handleFeatures(newPosition);
        } else {
            console.log("Can't walk through walls.");
            return false;
        }
    }
    if (action == 'ArrowUp'&& !gameState.currentEvent) {
        const newPosition = {x:gameState.position.x, y:gameState.position.y-1, z:gameState.position.z};
        const currentRoom = new DungeonRoom(gameState.position.x, gameState.position.y, gameState.position.z);
        if (!currentRoom.northWall.wallExists) {
            updateGameAndDisplay(newPosition);
            return handleFeatures(newPosition);
        } else {
            console.log("Can't walk through walls.");
            return false;
        }
    }
    if (action == 'ArrowDown'&& !gameState.currentEvent) {
        const newPosition = {x:gameState.position.x, y:gameState.position.y+1, z:gameState.position.z};
        const currentRoom = new DungeonRoom(gameState.position.x, gameState.position.y, gameState.position.z);
        if (!currentRoom.southWall.wallExists) {
            updateGameAndDisplay(newPosition);
            return handleFeatures(newPosition);
        } else {
            console.log("Can't walk through walls.");
            return false;
        }
    }
    return true;
}, 100);

const handlePossibleEvent = _.debounce(function handlePossibleEvent(luck = 0) {
    const rnd = Math.floor(Math.random() * 100 + 1);
    console.log(rnd);
    if (rnd > (90 + luck)) {
        gameState.currentEvent = 'in combat';
        gameState.options = ["[<span class='logOption'>F</span>]ight, [<span class='logOption'>R</span>]un, [<span class='logOption'>N</span>]egotiate"];
        const enemyChoice = Math.floor(Math.random() * Monsters.length);
        console.log(Monsters.length + " monsters: chose monster: " + enemyChoice);
        const enemyBase = (gameConfig.onlyDragons) ? Monsters[3] : Monsters[enemyChoice];
        const enemy = Object.assign({}, enemyBase);
        enemy.level = gameState.position.z + Math.floor(Math.random() * 4 + 1); //level + 1-4 (dungeons start at level 0)
        let enemyTotalHp = enemy.baseHp;
        //for each level past the first roll hp based on base.
        for (let i = 1;i<enemy.level;i++) {
            const levelHp = Math.floor(Math.random() * enemy.baseHp + 1)
            enemyTotalHp += levelHp;
        }
        enemy.hp = enemyTotalHp;
        gameState.enemy = enemy;
        GameLog("You have encountered a <span class='logEnemy'>level " + enemy.level + " " + enemy.name + "</span>", "COMBAT");
        displayLog();
        drawEnemy(gameState.position, enemy);
        drawOptions(gameState.position);
    }
}, 75);

function gameOver() {
    gameState = Object.assign({}, initialGameState);
    gameState.log = [];
    updateGameAndDisplay(gameState.position);
}

function playerDying() {
    console.log('character dying')
    //turn off any options and change current event to dying.
    gameState.options = ["[<span class='logEmphasis logOption'>A</span>]ccept your fate, [<span class='logEmphasis logOption'>D</span>]on't go into the light."];
    gameState.currentEvent = "dying";
    GameLog("<span class='logEmphasis logPlayerDamage'>YOU ARE DYING!</span>", "DYING");
    displayLog();
    updateGameAndDisplay(gameState.position);
}



function isDirection(action) {
    return action == 'ArrowUp' || action == 'ArrowDown' || action == 'ArrowRight' || action == 'ArrowLeft';
}


function endEvent() {
    gameState.currentEvent = null;
    gameState.options = null;
}


function handleLevelUp(expGain) {
    const currentExp = gameState.exp - 0;
    const newTotalExp = gameState.exp + expGain;
    gameState.exp += expGain;
    const expNeeded = experienceForNextLevel(gameState.level);
    console.log(currentExp, newTotalExp, expNeeded, gameState.exp);
    if (currentExp < expNeeded && newTotalExp > expNeeded) {
        console.log('Player Level Up!');
        GameLog("<span class='logEmphasis'>You gained a level!</span> You are level <span class='logPlayerLevelUp'>2</span>", "COMBAT RESOLUTION");
        displayLog();
        gameState.level += 1;
        const hpGain = Math.round(Math.random() * 10 + 11);
        GameLog("You gained <span class='logPlayerLevelUp'>" + hpGain + "</span> hit points!", "COMBAT RESOLUTION");
        gameState.maxHp += hpGain;
        gameState.hp = gameState.maxHp;
    } else {
        console.log("Did not level up, current exp: " + gameState.exp);
    }
    
}

function handleRandomEvent() {
    if (gameState.currentEvent) return;
    const now = new Date();
    const secondsSinceLastAction = (now - lastActionCompleted)/1000; 
    console.log('nothing was done so time continues on regardless. It has been ' + secondsSinceLastAction + ' seconds since the last action.');
    if (secondsSinceLastAction > (tickSeconds - 0.5)) {
        console.log("Random event might happen due to inactivity");
        handlePossibleEvent(-30);
    }
}

//TODO: Handle swiping: https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
//TODO: if processing or its too soon to process a nothing happening. If the last action was less than 10 seconds ago then we don't have a "no-action" event occur. 
const gameloop = _.debounce(function nextTickOrAction(action) {
    if (!processing) {
        processing = action;
        if (!action) {
            handleRandomEvent();
        } else {
            if (!gameState.currentEvent) {
                const possibleEvent = handleStandardActions(action);
                if (possibleEvent) handlePossibleEvent();
            } else {
                //event actions.
                console.log("handling event actions: " + gameState.currentEvent);
                if (gameState.currentEvent == 'in combat') {
                    handleCombatEventActions(action);
                } else if (gameState.currentEvent == 'dying') {
                    handleDyingStruggle(action);
                } else if (gameState.currentEvent == 'combat resolution') {
                    console.log('resolving combat');
                } else if (gameState.currentEvent == 'combat attack') {
                    console.log('resolving attack');
                } else if (gameState.currentEvent == 'stairs down') {
                    handleStairsDown(action);
                } else if (gameState.currentEvent == 'stairs up') {
                    handleStairsUp(action);
                } else if (gameState.currentEvent == 'fountain') {
                    handleFountain(action);
                }  else if (gameState.currentEvent == 'inn') {
                    handleInn(action);
                }

                //TODO: Location Actions for Throne, Fountain and Inn
            }
        }

        //processing everything can take as long as we like before setting up the next tick 
        processing = false;
        lastActionCompleted = new Date();
        //https://www.w3schools.com/howto/howto_js_countdown.asp
    } else {
        console.log('tick skipped as we are still processing an action.');
    }
}, 75);

function startGame() {
    //TODO: Determine the proper starting square based on options/config.
    const startPosition = {x:3,y:3,z:0};
    const gender = Math.random() < 0.5;
    gameState.gender = (gender) ? 'm' : 'f';
    updateGameAndDisplay(startPosition);

    discoverNearestInn(startPosition);

    //start game loop
    setInterval(function() {gameloop(false)}, tickSeconds * 1000);
    gameloop("Entering the Dungeon");
    listenForInput(); //from playerActionListener.js
}

let debouncedTableAdjust = _.debounce(function adjustTableGrid() {
    const position = gameState.position;
    updateGameAndDisplay(position);
}, 300);


//adjustTableGrid();

//onload
window.addEventListener("resize", debouncedTableAdjust);

