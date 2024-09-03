const handleFountain = _.debounce(function handleFountain(action) {
    if (action == 'd' && gameState.currentEvent == 'fountain') {
        GameLog("You <span class='logEmphasis'>drink</span> from the fountain.", 'FOUNTAIN');
        displayLog();
        handleDrink();
    } else if (action == 'i' && gameState.currentEvent == 'fountain') {
        GameLog("You ignore the <span class='logEmphasis'>fountain</span> and continue adventuring.", "FOUNTAIN");
        endEvent();
        updateGameAndDisplay(gameState.position);
    }
}, 100);

function handleDrink() {
    GameLog("You take a drink from the mysterious fountain.", "FOUNTAIN");
    displayLog();
    setTimeout(function() {
        const fountainEffect = Math.floor(Math.random() * 4 + 1);
        if (fountainEffect == 1 && gameState.hp < gameState.maxHp) {
            const healHp = Math.min(Math.floor(Math.random() * 20 + 1), gameState.maxHp - gameState.hp); //make sure it can't heal more than you're damaged.
            gameState.hp += healHp;
            GameLog("Your wounds heal. You recover <span class='logPlayerGood'>" + healHp + " hp.</span>", "FOUNTAIN");
        } else if (fountainEffect == 2) {
            const dmg = Math.floor(Math.random() * (4 * (gameState.position.z+1)) + 1);
            const newHp = gameState.hp - dmg;
            gameState.hp = Math.max(newHp, 0);
            GameLog("The water is poison. You lose <span class='logDamageToPlayer'>" + dmg + " hp.</span>", "FOUNTAIN");
            if (newHp <= 0) {
                playerDying();
                return;
            }
        } else if (fountainEffect == 3) {
            const str = Math.floor(Math.random() * 4 + 1);
            gameState.str += str;
            setTimeout(function() {
                gameState.str -= str;
                GameLog("You <span class='logEmphasis'>strength</span> returns to normal.", "FOUNTAIN");
                displayLog();
            }, 120000);
            GameLog("The magic in the water makes you stronger. You gain <span class='logPlayerGood'>" + str + " str points.</span>", "FOUNTAIN");
        } else {
            //4
            GameLog("Nothing happens. It is just water.", "FOUNTAIN");
        }
        displayLog();
        endEvent();
        updateGameAndDisplay(gameState.position);
    }, 100);
}