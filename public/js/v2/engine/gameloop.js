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
    displayPlayerStats(); //the floor display can't change until the new position is updated.
}

function handleFeatures(newPosition) {
    const newRoom = new DungeonRoom(newPosition.x, newPosition.y, newPosition.z);
    gameState.roomsVisited[newRoom.roomKey] = newRoom;
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
        if (newRoom.throne) {
            gameState.currentEvent = 'throne';
            gameState.options = "[<span class='logOption'>S</span>]it on the throne. [<span class='logOption'>I</span>]gnore."
            drawOptions(newPosition);
            displayPlayerStats();
        }
        if (newRoom.huntersGuild) {
            gameState.currentEvent = 'huntersGuild';
            gameState.options = "[<span class='logOption'>E</span>]nter the guild. [<span class='logOption'>I</span>]gnore."
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

function initiateCombat(monsters, logFunc, levelRangeMod = 0) {
    gameState.currentEvent = 'in combat';
        gameState.options = ["[<span class='logOption'>F</span>]ight, [<span class='logOption'>R</span>]un"];
        const enemyChoice = Math.floor(Math.random() * monsters.length);
        console.log(monsters.length + " monsters: chose monster: " + enemyChoice);
        console.log(monsters);
        let enemyBase = (gameConfig.onlyDragons) ? Monsters.find(x => x.name == 'Red Dragon') : monsters[enemyChoice];
        
        if (gameState.skills.find(x => x.name == 'Big Game Hunter') && gameState.bigGameHunter && gameState.bigGameHunterQuarry) {
            const quarryRoll = Math.floor(Math.random() * 100 + 1);
            if (quarryRoll <= gameConfig.chanceToFindQuarry) {
                const quarry = monsters.find(x => x.name == gameState.bigGameHunterQuarry); //This handles boss monsters well because you won't get boss monsters on your hunter's list and thus can't specifically hunt them...when rolling a boss combat this will never find a match.
                if (quarry) {
                    GameLog("<span class='logEmphasis'>You have found your quarry!</span>", "COMBAT");
                    displayLog();
                    enemyBase = quarry;
                }
            } 
        }

        const enemy = Object.assign({}, enemyBase);
        enemy.level = gameState.position.z + levelRangeMod + Math.floor(Math.random() * 4 + 1); //level + 1-4 (dungeons start at level 0)
        
        if (gameState.lastBossDefeated == enemyBase.boss && new Date() - gameState.lastThroneEvent < (gameConfig.tributeCooldown)) {
            gameState.options = ["[<span class='logOption'>D</span>]emand tribute, [<span class='logOption'>I</span>]gnore it."];
            gameState.currentEvent = 'cower';
            drawEnemy(gameState.position, enemy);
            drawOptions(gameState.position);
            GameLog("The level " + enemy.level + " " + enemy.name + " bows before you!", "COWER");
            displayLog();
            
        }

        let enemyTotalHp = enemy.baseHp;
        //for each level past the first roll hp based on base.
        for (let i = 1;i<enemy.level;i++) {
            const levelHp = Math.floor(Math.random() * enemy.baseHp + 1)
            enemyTotalHp += levelHp;
        }
        enemy.hp = enemyTotalHp;
        gameState.enemy = enemy;
        GameLog(logFunc(gameState.enemy), "COMBAT");
        displayLog();
        drawEnemy(gameState.position, enemy);
        drawOptions(gameState.position);
}

const handlePossibleEvent = _.debounce(function handlePossibleEvent(luck = 0) {
    const rnd = Math.floor(Math.random() * 100 + 1);
    console.log(rnd);
    let adjustedChance = 90 + luck;
    if (!gameState.beSafe) adjustedChance - 20;
    if (gameState.skills.find(x => x.name == 'Stealth') && gameState.stealth) adjustedChance = 95;
    if (rnd > adjustedChance) {
        const potentialMonsters = MonstersForLevel(gameState.position.z);
        initiateCombat(potentialMonsters, (enemy) => "You have encountered a <span class='logEnemy'>level " + enemy.level + " " + enemy.name + "</span>", 0);
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


/**
 * Set currentEvent and options to null
 */
function endEvent() {
    gameState.currentEvent = null;
    gameState.options = null;
}


function handleLevelUp(expGain) {
    const expNeeded = experienceForNextLevel(gameState.level);
    const currentExp = gameState.exp - 0;
    const newTotalExp = currentExp + expGain;
    
    console.log(currentExp, newTotalExp, expNeeded, gameState.exp);
    if (currentExp < expNeeded && newTotalExp >= expNeeded) {
        gameState.exp += expGain;
        gameState.level += 1;
        console.log('Player Level Up!');
        GameLog("<span class='logEmphasis'>You gained a level!</span> You are <span class='logPlayerLevelUp'>level "+gameState.level+"</span>", "COMBAT RESOLUTION");
        displayLog();
        
        const hpGain = Math.round(Math.random() * 10 + 11);
        GameLog("You gained <span class='logPlayerLevelUp'>" + hpGain + " hit points</span>!", "COMBAT RESOLUTION");
        displayLog();
        gameState.maxHp += hpGain;
        gameState.hp = gameState.maxHp;

        const strGain = (gameState.level % 2 == 0) ? 1 : 2;
        GameLog("You gained <span class='logPlayerLevelUp'>" + strGain + " Strength</span>!", "COMBAT RESOLUTION");
        displayLog();
        gameState.str += strGain;

        const fireResistGain = (gameState.level % 3 == 0) ? 1 : 0;
        if (fireResistGain > 0){
            GameLog("You gained <span class='logPlayerLevelUp'>" + fireResistGain + " Fire Resist</span>!", "COMBAT RESOLUTION");
            displayLog();
            gameState.fireResist += fireResistGain;
        }

    } else {
        gameState.exp += expGain;
        console.log("Did not level up, current exp: " + gameState.exp);
    }
    
}

const handleCharacterActions = _.debounce(function handleCharacterActions(action) {
    if (action == 'Escape') {
        gameState.characterOptionsOpen = !gameState.characterOptionsOpen;
        if (gameState.characterOptionsOpen) {
            console.log("Hit escape button and opening menu")
            displayCharacterMenu();
        } else {
            console.log("Hit escape button and closing menu")
            hideCharacterMenu();
        }

    } else if (action == 'b') {
        gameState.beSafe = !gameState.beSafe; //could probably store the active state of things on the skills object
        displayCharacterMenu(true)
    } else if (action == 's') {
        gameState.stealth = !gameState.stealth;
        displayCharacterMenu(true)
    }  else if (action == 'h') {
        gameState.bigGameHunter = !gameState.bigGameHunter;
        displayCharacterMenu(true)
    } else if (action = 'e') {
        //scan surrounding rooms for features. This is an active skill with a cooldown rather than a toggled option.
    }
}, 100);

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

function checkForOngoingEffects() {
    //handle poison here.
}

function checkForExpiringEffects() {
    //Expire Str Bonus (from Fountain)
    if (gameState.strBonusExpiry < new Date() - 0 && gameState.strBonus > 0) {
        gameState.strBonus = 0; //this is the additional trigger that will prevent this from firing more than once. 
        GameLog("Your extraordinary <span class='logEmphasis'>strength</span> wanes.", "FOUNTAIN");
        displayLog();
    }
}

//TODO: Handle swiping: https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
//TODO: if processing or its too soon to process a nothing happening. If the last action was less than 10 seconds ago then we don't have a "no-action" event occur. 
const gameloop = _.debounce(function nextTickOrAction(action) {
    if (!processing) {
        processing = action;
        checkForOngoingEffects();
        checkForExpiringEffects();
        if (!action && !gameState.characterOptionsOpen) {
            handleRandomEvent();
        } else {
            handleCharacterActions(action);
            if (!gameState.currentEvent) {
                const possibleEvent = handleStandardActions(action);
                if (possibleEvent && !gameState.characterOptionsOpen && action != 'Escape') handlePossibleEvent();
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
                } else if (gameState.currentEvent == 'throne') {
                    handleThrone(action);
                }  else if (gameState.currentEvent == 'cower') {
                    handleCower(action);
                } else if (gameState.currentEvent == 'huntersGuild') {
                    handleHuntersGuild(action);
                } else if (gameState.currentEvent == 'huntersGuildTraining') {
                    handleHuntersGuildTraining(action);
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
    const startPosition = {x:4,y:4,z:0};
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

