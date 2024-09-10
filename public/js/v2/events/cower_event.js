//Demand Tribute
//Fight it
//Ignore it
const handleCower = _.debounce(function handleCower(action) {
    if (action == 'd' && gameState.currentEvent == 'cower') {
        const goldEarned = Math.floor(Math.random() * 100 + 1);
        gameState.gold += goldEarned;
        GameLog("You demand tribute! It pays you <span class='logGold'>" + goldEarned + "</span> gold.", 'COWER');
        displayLog();
        //TODO: Actually implement gold. Or give exp.
        gameState.enemy = null;
        endEvent();
        updateGameAndDisplay(gameState.position);
    } else if ((action == 'i') && gameState.currentEvent == 'cower') { //removed action check so that tribute is not so easily accidentally ignored.
        GameLog("You ignore the creature and continue adventuring.", "COWER");
        gameState.enemy = null;
        endEvent();
        updateGameAndDisplay(gameState.position);
    }
}, 100);