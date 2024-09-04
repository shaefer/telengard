const handleInn = _.debounce(function handleInn(action) {
    GameLog("You have found an inn.", 'INN'); //TODO: Add Inn name
    displayLog();
    if (action == 'v' && gameState.currentEvent == 'inn') {
        GameLog('You enter the inn to relax.', 'INN');
        displayLog();
        handleRestAtInn();
    } else if ((action == 'i' ||  isDirection(action)) && gameState.currentEvent == 'inn') {
        GameLog("You ignore the inn and continue adventuring.", "INN");
        endEvent();
        updateGameAndDisplay(gameState.position);
    }
}, 100);

function isDirection(action) {
    return action == 'ArrowUp' || action == 'ArrowDown' || action == 'ArrowRight' || action == 'ArrowLeft';
}

function handleRestAtInn() {
    GameLog("You rest at the inn. You restore all your hit points.", "INN");
    const missingHp = gameState.maxHp - gameState.hp;
    gameState.hp += missingHp;
    endEvent();
    updateGameAndDisplay(gameState.position);
}