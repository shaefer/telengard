function updateGameAndDisplay(newPosition) {
    drawDungeonAroundSquare(newPosition);
    drawRoomObjects(newPosition);
    displayPlayer(newPosition);
    displayLog();
    drawOptions(newPosition);
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
            return true;
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
            return true;
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
            return true;
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
            return true;
        } else {
            console.log("Can't walk through walls.");
            return false;
        }
    }
    return true;
}

function handlePossibleEvent(luck = 0) {
    const rnd = Math.floor(Math.random() * 100 + 1);
    console.log(rnd);
    if (rnd > (90 + luck)) {
        gameState.currentEvent = 'in combat';
        gameState.options = ["[<span class='logOption'>F</span>]ight, [<span class='logOption'>R</span>]un, [<span class='logOption'>N</span>]egotiate"];
        const enemyChoice = Math.floor(Math.random() * 4);
        const enemyBase = Monsters[enemyChoice];
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
}

function gameOver() {
    gameState = Object.assign({}, initialGameState);
    gameState.log = [];
    updateGameAndDisplay(gameState.position);
}

function handleDeath() {
    GameLog("You died!", "DEATH");
    displayLog();
    setTimeout(gameOver, 2000);
}

function handleDyingStruggle(action) {
    if (action == 'd' && gameState.currentEvent == 'dying') {
        GameLog('You see a light, but you refuse to give up!', 'DYING');
        handleDying();
    } else if (action == 'a' && gameState.currentEvent == 'dying') {
        GameLog("You've struggled enough in this world and head toward the glowing light.", "DYING");
        handleDeath();
    }
}

function handleDying() {
    const recover = Math.floor(Math.random() * 100 + 1);
    console.log(recover + " was the recovery roll");
    if (recover >= 50) {
        const hpGain = Math.floor(Math.random() * 5 + 5);
        GameLog("You have miraculously recovered. You regain <span class='logPlayerGood'>" + hpGain + "</span> hp.", "DYING");
        displayLog();
        endEvent();
        updateGameAndDisplay(gameState.position);
    } else {
        handleDeath();
    }
}

function handleEnemyFightBack() {
    /* enemy options = fight and deal damage
        special attack
        run away
    */
    if (gameState.enemy.hp <= 2) {
        //chance to run.
        console.log("Has a chance to run.");
    }

   const dmg = monsterAttack(gameState.enemy);
   const newHp = gameState.hp - dmg;
   console.log('hp fell to: ' + newHp);
   gameState.hp = Math.max(newHp, 0);
   if (newHp <= 0) {
        console.log('character dying')
            //turn off any options and change current event to dying.
        gameState.options = ["[<span class='logEmphasis logOption'>A</span>]ccept your fate, [<span class='logEmphasis logOption'>D</span>]on't go into the light."];
        gameState.currentEvent = "dying";
        GameLog("You were struck a fatal blow! <span class='logEmphasis logPlayerDamage'>YOU ARE DYING!</span>", "DYING");
        displayLog();
        updateGameAndDisplay(gameState.position);
        //setTimeout(handleDying, 2000);
   } else {
        GameLog("The battle continues. What do you want to do?", "COMBAT");
        displayLog();
        gameState.currentEvent = 'in combat'
   }
}

function handleCombatEventActions(action) {
    if (action == 'f' && gameState.currentEvent == 'in combat') {
        gameState.currentEvent = 'combat attack'
        console.log('in combat and receiving the action "f"');
        const dmg = Math.floor(Math.random() * gameState.str + 1);
        
        const newHp = gameState.enemy.hp - dmg;
        if (newHp <= 0) {
            GameLog("Your blow deals <span class='logEnemyDamage'>" + dmg + "</span> damage, carving through your foe.", "COMBAT");
            displayLog(); //TODO: Log by event so that they are grouped and then fade if that event ended a certain period of time ago.
            gameState.options = null;
            gameState.currentEvent = 'combat resolution';

            setTimeout(handleCombatWin, 2000);
        } else {
            //TODO: This won't go away until you press more buttons. We need to create a better console for combat messages.
            GameLog("You swing viciously at the " + gameState.enemy.name + ", dealing <span class='logEnemyDamage'>" + dmg + "</span> hp of damage.", "COMBAT");
            displayLog();
            gameState.enemy.hp = newHp;
            setTimeout(handleEnemyFightBack, 2000);
        }
    }
}

function endEvent() {
    gameState.currentEvent = null;
    gameState.options = null;
}


function handleLevelUp(expGain) {
    const currentExp = gameState.exp;
    gameState.exp += expGain;
    const expNeeded = experienceForNextLevel(gameState.level);
    if (currentExp < expNeeded && gameState.exp > expNeeded) {
        console.log('Player Level Up!');
        GameLog("<span class='logEmphasis'>You gained a level!</span> You are level <span class='logPlayerGood'>2</span>", "COMBAT RESOLUTION");
        displayLog();
        gameState.level += 1;
        const hpGain = Math.round(Math.random() * 10 + 11);
        gameState.maxHp += hpGain;
        gameState.hp = gameState.maxHp;
    } else {
        console.log("Did not level up, current exp: " + gameState.exp);
    }
    
}

function handleCombatWin() {
    const exp = monsterExp(gameState.enemy);
    GameLog("You have defeated the " + gameState.enemy.name + ". You gain <span class='logExperience'>" + exp + "</span> experience.", "COMBAT VICTORY");
    displayLog();

    setTimeout(function () {
        handleLevelUp(exp);
        endEvent();
        updateGameAndDisplay(gameState.position);
    }, 500);
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
                    console.log("nothing else to do...player is dying");
                    handleDyingStruggle(action);
                } else if (gameState.currentEvent == 'combat resolution') {
                    console.log('resolving combat');
                } else if (gameState.currentEvent == 'combat attack') {
                    console.log('resolving attack');
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

