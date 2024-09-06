const handleHuntersGuild = _.debounce(function handleHuntersGuild(action) {
    if (action == 'e' && gameState.currentEvent == 'huntersGuild') {
        GameLog("You enter the hunter's guild. There is much to learn here.", 'HUNTERSGUILD');
        
        displayLog();
        //endEvent();
        gameState.currentEvent = "huntersGuildTraining"
        gameState.options = "[<span class='logOption'>1</span>] train the <span class='logGold'>Hunter (500G)</span> skill." 
            + "[<span class='logOption'>2</span>] train the <span class='logGold'>Surveyor (500G)</span> skill." 
            + "[<span class='logOption'>3</span>] train the <span class='logGold'>Stealth (500G)</span> skill." 
            + "[<span class='logOption'>L</span>]eave the guild.]"
        updateGameAndDisplay(gameState.position);
    } else if ((action == 'i' || isDirection(action)) && gameState.currentEvent == 'huntersGuild') {
        GameLog("You ignore the guild and continue adventuring.", "HUNTERSGUILD");
        gameState.enemy = null;
        endEvent();
        updateGameAndDisplay(gameState.position);
    }
}, 100);

const hunterSkills = [
    {name: 'Critical Strike', cost: 500, option: "0", description: "This secret skill increases the chance of a critical hit by 5%"},
    {name: 'Big Game Hunter', cost: 500, option: "1", description: "Increase the chance that when you encounter a creature it is the variety of creature that you specifiy when activating the skill"},
    {name: 'Surveyor', cost: 500, option: "2", description: "When you use the Surveyor skill you check the 8 surrounding squares for locations of note. This skill is affected by Wisdom."},
    {name: 'Stealth', cost: 500, option: "3", description: "When you activate Stealth and move around the dungeon your chances of encounters is greatly lowered."}
];

function handleSkillPurchase(skill, secret = false) {
    if (gameState.gold < skill.cost) {
        GameLog("You don't have enough gold to train that.", "HUNTERSGUILDTRAINING");
        displayLog();
        updateGameAndDisplay(gameState.position);
        return;
    }
    if (gameState.skills.find(x => x.name == skill.name)) {
        GameLog("You already have that skill.", "HUNTERSGUILDTRAINING");
        displayLog();
        updateGameAndDisplay(gameState.position);
        return;
    }

    if (gameState.gold >= skill.cost) {
        gameState.gold -= skill.cost;
        gameState.skills.push(skill);
        const secretText = (secret) ? " <span class='logAmazing'>secret</span> " : " ";
        GameLog("You learn the" + secretText + "skill: <span class='logGold'>" + skill.name + "</span>", "HUNTERSGUILDTRAINING");
        displayLog();
        endEvent();
        updateGameAndDisplay(gameState.position);
    }      
}

const handleHuntersGuildTraining = _.debounce(function handleHuntersGuildTraining(action) {
    if (action == '0' && gameState.currentEvent == 'huntersGuildTraining') {
        handleSkillPurchase(hunterSkills[0], true);
    } else if (action == '1' && gameState.currentEvent == 'huntersGuildTraining') {
        handleSkillPurchase(hunterSkills[1]);
    } else if (action == '2' && gameState.currentEvent == 'huntersGuildTraining') {
        handleSkillPurchase(hunterSkills[2]);
    } else if (action == '3' && gameState.currentEvent == 'huntersGuildTraining') {
        handleSkillPurchase(hunterSkills[3]);
    } else if ((action == 'l') && gameState.currentEvent == 'huntersGuildTraining') {
        //move actions are deliberately turned off while in the training menu.
        GameLog("You leave the warmth of the hunter's guild.", "HUNTERSGUILDTRAINING");
        endEvent();
        updateGameAndDisplay(gameState.position);
    }
}, 100);