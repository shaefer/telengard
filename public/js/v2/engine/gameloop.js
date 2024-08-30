function updateGameAndDisplay(newPosition) {
    drawDungeonAroundSquare(newPosition);
    drawRoomObjects(newPosition);
    displayPlayer(newPosition);
    //displayLog();
    gameState.position = newPosition;
}

function handleStandardActions(action) {
    console.log('processing action: ' + action);
    if (action == 'Entering the Dungeon') {
        
    }
    if (action == 'ArrowRight' && !gameState.currentEvent) {
        const newPosition = {x:gameState.position.x + 1, y:gameState.position.y, z:gameState.position.z};
        const currentRoom = new DungeonRoom(gameState.position.x, gameState.position.y, gameState.position.z);
        if (!currentRoom.eastWall.wallExists) {
            updateGameAndDisplay(newPosition);
        } else {
            console.log("Can't walk through walls.");
        }
       
    }
    if (action == 'ArrowLeft' && !gameState.currentEvent) {
        const newPosition = {x:gameState.position.x-1, y:gameState.position.y, z:gameState.position.z};
        const currentRoom = new DungeonRoom(gameState.position.x, gameState.position.y, gameState.position.z);
        if (!currentRoom.westWall.wallExists) {
            updateGameAndDisplay(newPosition);
        } else {
            console.log("Can't walk through walls.");
        }
    }
    if (action == 'ArrowUp'&& !gameState.currentEvent) {
        const newPosition = {x:gameState.position.x, y:gameState.position.y-1, z:gameState.position.z};
        const currentRoom = new DungeonRoom(gameState.position.x, gameState.position.y, gameState.position.z);
        if (!currentRoom.northWall.wallExists) {
            updateGameAndDisplay(newPosition);
        } else {
            console.log("Can't walk through walls.");
        }
    }
    if (action == 'ArrowDown'&& !gameState.currentEvent) {
        const newPosition = {x:gameState.position.x, y:gameState.position.y+1, z:gameState.position.z};
        const currentRoom = new DungeonRoom(gameState.position.x, gameState.position.y, gameState.position.z);
        if (!currentRoom.southWall.wallExists) {
            updateGameAndDisplay(newPosition);
        } else {
            console.log("Can't walk through walls.");
        }
    }
}

function handlePossibleCombat(luck = 0) {
    const rnd = Math.floor(Math.random() * 100 + 1);
    console.log(rnd);
    if (rnd > (90 + luck)) {
        gameState.currentEvent = 'in combat';
        gameState.options = ["[F]ight, [R]un, [N]egotiate"];
        const enemyChoice = Math.floor(Math.random() * 4);
        const enemy = Monsters[enemyChoice];
        gameState.enemy = Object.assign({}, enemy);
        drawEnemy(gameState.position, enemy);
        drawOptions(gameState.position, gameState.options);
    }
}

function handleCombatEventActions(action) {
    if (action == 'f' && gameState.currentEvent == 'in combat') {
        console.log('in combat and receiving the action "f"');
        const dmg = Math.floor(Math.random() * gameState.str + 1);
        
        const newHp = gameState.enemy.hp - dmg;
        if (newHp <= 0) {
            gameState.log.push("You swing viciously at the " + gameState.enemy.name + ", dealing " + dmg + " hp of damage.");
            gameState.log.push("Your blow carves through your foe. It is defeated!");
            displayLog(); //TODO: Log by event so that they are grouped and then fade if that event ended a certain period of time ago.
            setTimeout(handleCombatWin, 500);
        } else {
            //TODO: This won't go away until you press more buttons. We need to create a better console for combat messages.
            gameState.log.push("You swing viciously at the " + gameState.enemy.name + ", dealing " + dmg + " hp of damage.");
            displayLog();
            gameState.enemy.hp = newHp;
        }
    }
}



function handleCombatWin() {
    gameState.currentEvent = null;
    gameState.options = null;
    updateGameAndDisplay(gameState.position);
}

function handleRandomEvent() {
    if (gameState.currentEvent) return;
    const now = new Date();
    const secondsSinceLastAction = (now - lastActionCompleted)/1000; 
    console.log('nothing was done so time continues on regardless. It has been ' + secondsSinceLastAction + ' seconds since the last action.');
    if (secondsSinceLastAction > (tickSeconds - 0.5)) {
        console.log("Random event might happen due to inactivity");
        handlePossibleCombat(-30);
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
                handleStandardActions(action);
                handlePossibleCombat();
            } else {
                //event actions.
                if (gameState.currentEvent == 'in combat') {
                    handleCombatEventActions(action);
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

