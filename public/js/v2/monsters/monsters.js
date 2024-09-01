const monsterImgFolder = 'images/v2/monsters/';

const monsterAttack = (monster) => {
    //percent chance to hit == 25%+5%/level over player.
    const levelDiff = Math.max(monster.level - gameState.level, 0);
    const percentToHit = 25 + (levelDiff * 5);
    const rnd = Math.floor(Math.random() * 100 + 1);
    if (rnd <= percentToHit) {
        if (rnd <= 5) {
            //critical hit!
            const critMultiplier = Math.floor(Math.random() * 2 + 1)/2;
            const dmg = monsterDamage(monster) * (1+critMultiplier);
            GameLog("The" + monster.name + " lands a crushing blow for <span class='logDamageToPlayer'>" + dmg + "</span> damage! (critmult: " + critMultiplier+")", "COMBAT");
            displayLog();
            return dmg;
        } else {
            //hit
            const dmg = monsterDamage(monster);
            GameLog("The" + monster.name + " strikes you for <span class='logDamageToPlayer'>" + dmg + "</span> damage.", "COMBAT");
            displayLog();
            return dmg;
        }
    } else {
        //miss
        GameLog("The" + monster.name + " <span class='logPlayerGood'>misses</span> you!", "COMBAT");
        displayLog();
        return 0;
    }
}

const monsterExp = (monster) => {
    //TODO: If monster has above average hp give more exp. 
    return monster.level * monster.power;
}

const monsterDamage = (monster) => {
    const maxDamage = monster.level * monster.power;
    const damage = Math.floor(Math.random() * maxDamage + 1);
    return damage;
}
const Monsters = [
    {name: 'Troll', imgSrc: monsterImgFolder + 'troll.png', size: 1.5, baseHp: 6, power: '3'},
    {name: 'Mountain Troll', imgSrc: monsterImgFolder + 'troll_blue.png', size: 1.5, baseHp: 8, power: '4'},
    {name: 'Zombie', imgSrc: monsterImgFolder + 'zombie.png', size: 0.75, baseHp: 4, power: '1'},
    {name: 'Red Dragon', imgSrc: monsterImgFolder + 'reddragon-1.png', size:1.25, baseHp: 10, power:'5'}
];