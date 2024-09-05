//Demand Tribute
//Fight it
//Ignore it
const handleCower = _.debounce(function handleCower(action) {
    if (action == 'd' && gameState.currentEvent == 'cower') {
        GameLog("You demand tribute! It pays you <span class='logGold'>" + Math.floor(Math.random() * 100 + 1) + "</span> gold.", 'COWER');
        displayLog();
        //TODO: Actually implement gold. Or give exp.
        gameState.enemy = null;
        endEvent();
        updateGameAndDisplay(gameState.position);
    } else if ((action == 'i' || isDirection(action)) && gameState.currentEvent == 'cower') {
        GameLog("You ignore the creature and continue adventuring.", "COWER");
        gameState.enemy = null;
        endEvent();
        updateGameAndDisplay(gameState.position);
    }
}, 100);