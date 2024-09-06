const handleCombatEventActions = _.debounce(function handleCombatEventActions(action) {
    if (action == 'f' && gameState.currentEvent == 'in combat') {
        gameState.currentEvent = 'combat attack'
        console.log('in combat and receiving the action "f"');
        const dmg = Math.floor(Math.random() * (gameState.str + gameState.strBonus) + 1);
        const critRoll = (Math.floor(Math.random() * 20 + 1));
        const isCrit = critRoll == 20 || (gameState.skills.find(x => x.name == 'Critical Strike') && critRoll >= 19);
        const critBonus = (isCrit) ? Math.floor(Math.random() * (gameState.str + gameState.strBonus) + 1) : 0;
        const newHp = gameState.enemy.hp - (dmg + critBonus);
        if (newHp <= 0) {
            if (isCrit) {
                GameLog("Your <span class='logEmphasis'>critical hit</span> deals <span class='logEnemyDamage'>" + dmg + " + " + critBonus + "</span> damage, obliterating your enemy.", "COMBAT");
            } else {
                GameLog("Your blow deals <span class='logEnemyDamage'>" + dmg + "</span> damage, carving through your foe.", "COMBAT");
            }
            displayLog(); //TODO: Log by event so that they are grouped and then fade if that event ended a certain period of time ago.
            gameState.options = null;
            gameState.currentEvent = 'combat resolution';

            setTimeout(handleCombatWin, 500);
        } else {
            if (isCrit) {
                GameLog("You land a <span class='logEmphasis'>critical</span> blow on the " + gameState.enemy.name + ", dealing <span class='logEnemyDamage'>" + dmg + " + " + critBonus + "</span> hp of damage.", "COMBAT");
            } else {
                GameLog("You swing viciously at the " + gameState.enemy.name + ", dealing <span class='logEnemyDamage'>" + dmg + "</span> hp of damage.", "COMBAT");
            }
            displayLog();
            gameState.enemy.hp = newHp;
            setTimeout(handleEnemyFightBack, 500);
        }
    } else if (action == 'r' && gameState.currentEvent == 'in combat') {
        const run = Math.floor(Math.random() * 4 + 1);
        if (run == 1) {
            GameLog("You attempt to run, but the "+gameState.enemy.name+" blocks your path!", "COMBAT");
            displayLog();
            setTimeout(handleEnemyFightBack, 500);
        } else {
            GameLog("You dodge into the shadows and escape the battle.", "COMBAT");
            displayLog();
            gameState.enemy = null;
            endEvent();
            updateGameAndDisplay(gameState.position);
        }
    }

}, 100);

function handleDamage(dmg) {
    console.log('monsterAttack returned dmg: ' + dmg);
    const newHp = gameState.hp - dmg;
    console.log('hp fell to: ' + newHp);
    gameState.hp = Math.max(newHp, 0);
    displayPlayerStats();
    if (newHp <= 0) {
            gameState.enemy = null;
            playerDying();
    } else {
            GameLog("The battle continues. What do you want to do?", "COMBAT");
            displayLog();
            gameState.currentEvent = 'in combat'
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

    const attackType = Math.floor(Math.random() * 10 + 1);
    //TODO use gameConfig.percentChangeOfDragonFire to adjust this attackType check.
    if (attackType >= 7 && gameState.enemy.name == 'Red Dragon') {
        //special attack.
        GameLog("<span class='logDamageToPlayer'>The red dragon breathes fire!!!</span>", "COMBAT");
        displayLog();
        const specialAttackTime = 4000;
        handleSpecialAttackEvent(gameState.enemy.specialAttackImg, specialAttackTime);
        setTimeout(function() {
            const dmg = dragonFire(gameState.enemy);
            handleDamage(dmg);
        }, specialAttackTime);
    } else {
        const dmg = monsterAttack(gameState.enemy);
        handleDamage(dmg);
    }
}

function handleCombatWin() {
    if(gameState.enemy.isBoss) {
        console.log("BOSS DEFEATED: " + gameState.enemy.name);
        //TODO: We don't want to have enemies cower forever so we likely need to record boss defeat and what dungeon level.
        gameState.bossesDefeated.push(gameState.enemy.name);
    } else {
        gameState.enemiesDefeated.push({name: gameState.enemy.name, level: gameState.enemy.level});
        gameState.uniqueEnemiesDefeated.add(gameState.enemy.name);
    }

    const exp = monsterExp(gameState.enemy);
    GameLog("You have defeated the " + gameState.enemy.name + ". You gain <span class='logExperience'>" + exp + "</span> experience.", "COMBAT VICTORY");
    displayLog();

    setTimeout(function () {
        handleLevelUp(exp);
        gameState.enemy = null;
        endEvent();
        updateGameAndDisplay(gameState.position);
    }, 500);
}

function handleSpecialAttackEvent(eventImg, specialEventTime) {
    playDragonFire();
    drawSpecialEventAndFade(eventImg, specialEventTime);
}