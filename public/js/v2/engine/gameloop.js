function updateGameAndDisplay(newPosition) {
    drawDungeonAroundSquare(newPosition);
    drawRoomObjects(newPosition);
    displayPlayer(newPosition);
    displayLog();
    drawOptions(newPosition);
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
        return false;
    } else {
        return true;
    }
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

function handleDescent() {
    const newPosition = {x:gameState.position.x, y:gameState.position.y, z:gameState.position.z + 1};
    endEvent();
    updateGameAndDisplay(newPosition);
}

function handleAscent() {
    const newPosition = {x:gameState.position.x, y:gameState.position.y, z:gameState.position.z - 1};
    endEvent();
    updateGameAndDisplay(newPosition);
}

function handleStairsDown(action) {
    if (action == 'g' && gameState.currentEvent == 'stairs down') {
        GameLog('You head down to the next level of the dungeon', 'STAIRS DOWN');
        displayLog();
        handleDescent();
    } else if (action == 'i' && gameState.currentEvent == 'stairs down') {
        GameLog("You ignore the stairs and continue adventuring.", "STAIRS DOWN");
        endEvent();
        updateGameAndDisplay(gameState.position);
    }
}

function handleStairsUp(action) {
    if (action == 'g' && gameState.currentEvent == 'stairs up') {
        GameLog('You head up to a higher level of the dungeon', 'STAIRS UP');
        displayLog();
        handleAscent();
    } else if (action == 'i' && gameState.currentEvent == 'stairs up') {
        GameLog("You ignore the stairs and continue adventuring.", "STAIRS UP");
        endEvent();
        updateGameAndDisplay(gameState.position);
    }
}

function handleDying() {
    const recover = Math.floor(Math.random() * 100 + 1);
    console.log(recover + " was the recovery roll");
    if (recover >= 50) {
        const hpGain = Math.floor(Math.random() * 5 + 5);
        gameState.hp += hpGain;
        displayPlayerStats();
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
   console.log('monsterAttack returned dmg: ' + dmg);
   const newHp = gameState.hp - dmg;
   console.log('hp fell to: ' + newHp);
   gameState.hp = Math.max(newHp, 0);
   displayPlayerStats();
   if (newHp <= 0) {
        console.log('character dying')
            //turn off any options and change current event to dying.
        gameState.options = ["[<span class='logEmphasis logOption'>A</span>]ccept your fate, [<span class='logEmphasis logOption'>D</span>]on't go into the light."];
        gameState.currentEvent = "dying";
        GameLog("You were struck a fatal blow! <span class='logEmphasis logPlayerDamage'>YOU ARE DYING!</span>", "DYING");
        displayLog();
        updateGameAndDisplay(gameState.position);
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
        const isCrit = (Math.floor(Math.random() * 20 + 1)) == 20;
        const critBonus = (isCrit) ? Math.floor(Math.random() * gameState.str + 1) : 0;
        const newHp = gameState.enemy.hp - dmg + critBonus;
        if (newHp <= 0) {
            if (isCrit) {
                GameLog("Your <span class='logEmphasis'>critical hit</span> deals <span class='logEnemyDamage'>" + dmg + "</span> damage, obliterating your enemy.", "COMBAT");
            } else {
                GameLog("Your blow deals <span class='logEnemyDamage'>" + dmg + "</span> damage, carving through your foe.", "COMBAT");
            }
            displayLog(); //TODO: Log by event so that they are grouped and then fade if that event ended a certain period of time ago.
            gameState.options = null;
            gameState.currentEvent = 'combat resolution';

            setTimeout(handleCombatWin, 1000);
        } else {
            //TODO: This won't go away until you press more buttons. We need to create a better console for combat messages.
            if (isCrit) {
                GameLog("You land a <span class='logEmphasis'>critical</span> blow on the " + gameState.enemy.name + ", dealing <span class='logEnemyDamage'>" + dmg + "</span> hp of damage.", "COMBAT");
            } else {
                GameLog("You swing viciously at the " + gameState.enemy.name + ", dealing <span class='logEnemyDamage'>" + dmg + "</span> hp of damage.", "COMBAT");
            }
            displayLog();
            gameState.enemy.hp = newHp;
            setTimeout(handleEnemyFightBack, 1000);
        }
    }
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
                } else if (gameState.currentEvent == 'stairs down') {
                    handleStairsDown(action);
                } else if (gameState.currentEvent == 'stairs up') {
                    handleStairsUp(action);
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

