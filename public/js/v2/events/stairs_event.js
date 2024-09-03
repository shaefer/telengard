const handleStairsDown = _.debounce(function handleStairsDown(action) {
    if (action == 'g' && gameState.currentEvent == 'stairs down') {
        GameLog('You head down to the next level of the dungeon', 'STAIRS DOWN');
        displayLog();
        handleDescent();
    } else if (action == 'i' && gameState.currentEvent == 'stairs down') {
        GameLog("You ignore the stairs and continue adventuring.", "STAIRS DOWN");
        endEvent();
        updateGameAndDisplay(gameState.position);
    }
}, 100);

const handleStairsUp = _.debounce(function handleStairsUp(action) {
    if (action == 'g' && gameState.currentEvent == 'stairs up') {
        GameLog('You head up to a higher level of the dungeon', 'STAIRS UP');
        displayLog();
        handleAscent();
    } else if (action == 'i' && gameState.currentEvent == 'stairs up') {
        GameLog("You ignore the stairs and continue adventuring.", "STAIRS UP");
        endEvent();
        updateGameAndDisplay(gameState.position);
    }
}, 100);

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