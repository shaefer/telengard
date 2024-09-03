const handleDyingStruggle = _.debounce(function handleDyingStruggle(action) {
    if (action == 'd' && gameState.currentEvent == 'dying') {
        GameLog('You see a light, but you refuse to give up!', 'DYING');
        handleRecovery();
    } else if (action == 'a' && gameState.currentEvent == 'dying') {
        GameLog("You've struggled enough in this world and head toward the glowing light.", "DYING");
        handleDeath();
    }
}, 250);

function handleDeath() {
    GameLog("You died!", "DEATH");
    displayLog();
    setTimeout(gameOver, 2000);
}

function handleRecovery() {
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