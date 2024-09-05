function handleSitOnThrone() {
    console.log("THRONE DEBUG")
    console.log(gameState.lastThroneEvent)
    console.log(new Date() - 0)
    console.log(new Date() - (60000 * 5))
    const now = new Date();
    if (now - gameState.lastThroneEvent < (60000 * 5)) {
        GameLog("The throne seems devoid of magic.", "THRONE");
        displayLog();
        endEvent();
        updateGameAndDisplay(gameState.position);
    }
    //nothing happens
    const throneEvent = Math.floor(Math.random() * 100 + 1);
    if (throneEvent > 80) {
        gameState.lastThroneEvent = new Date() - 0;
        playGongSound();
        //roll For Boss Monster level Mod.
        initiateCombat(BossMonsters, (enemy) => "The " + enemy.name + " has returned. (He is level " + enemy.level + ")", levelRangeMod = 5)
        
    } else {
        GameLog("Nothing happened.", "THRONE");
        displayLog();
        endEvent();
        updateGameAndDisplay(gameState.position);
    }
    //a gong sounds
        //you go up a level
        //you go down a level
        //the X king returns.
            //what happens if you defeat the king.
    //A surge of magical power flows through you!
        //increased vision.
        //only certain monsters for a period of time
        //Curse - you must kill X creatures in Y time or take Z damage.
        //knowledge of a certain dungeon location
    //A musical chime fills the air
        //Given a quest
        //Fairy gives a magic item.
}

const handleThrone = _.debounce(function handleThrone(action) {
    if (action == 's' && gameState.currentEvent == 'throne') {
        GameLog('You sit down on the glowing, jewel-encrusted throne', 'THRONE');
        displayLog();
        handleSitOnThrone();
    } else if ((action == 'i' || isDirection(action)) && gameState.currentEvent == 'throne') {
        GameLog("You ignore the throne and continue adventuring.", "THRONE");
        endEvent();
        updateGameAndDisplay(gameState.position);
    }
}, 100);