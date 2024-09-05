const monsterImgFolder = 'images/v2/monsters/';

const monsterAttack = (monster) => {
    //percent chance to hit == 25%+5%/level over player.
    const levelDiff = Math.max(monster.level - gameState.level, 0);
    const percentToHit = 25 + (levelDiff * 5);
    const rnd = Math.floor(Math.random() * 100 + 1);
    console.log("monster attack roll: " + rnd);
    if (rnd <= percentToHit) {
        if (rnd <= 5) {
            console.log('critical hit')
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

const dragonFire = (monster) => {
    const levelDiff = Math.max(monster.level - gameState.level, 0);
    const dmgRolled = Math.max(monsterDamage(monster),3); //min 3 damage
    const dmg = Math.round(dmgRolled * (1.5+(levelDiff*.1))); // 150%+10% bonus damage per level diff.
    const dmgMinusFireResist = dmg - gameState.fireResist;
    GameLog("You burn for <span class='logDamageToPlayer'>" + dmgMinusFireResist + "</span> damage. (<span class='logDamageToPlayer'>"+dmg+"</span> - <span class='logPlayerGood'>"+gameState.fireResist+" fire resist</span>)", "COMBAT");
    displayLog();
    return dmg;
}

const monsterExp = (monster) => {
    //TODO: If monster has above average hp give more exp. 
    return monster.level * monster.power * (monster.xpBonusMultiplier||1);
}

const monsterDamage = (monster) => {
    const maxDamage = monster.level * monster.power;
    const damage = Math.floor(Math.random() * maxDamage + 1);
    return damage;
}

const BossMonsters = [
    {name: 'Dracolich', imgSrc: monsterImgFolder + 'dracolich.png', size: 2, baseHp: 10, power: 6, xpBonusMultiplier: 2, isBoss: true},
    {name: 'Troll King', imgSrc: monsterImgFolder + 'troll_king.png', size: 2, baseHp: 8, power: 4, xpBonusMultiplier: 2, isBoss:true},
    {name: 'Mecha-Dragon King', imgSrc: monsterImgFolder + 'dragonking.png', size: 2, baseHp: 10, power: 5, xpBonusMultiplier: 2, isBoss:true},
    {name: 'Skeleton Captain', imgSrc: monsterImgFolder + 'skeleton_captain.png', size: 1, baseHp: 6, power: 4, xpBonusMultiplier: 2, isBoss: true}
];

const Monsters = [
    {name: 'Troll', imgSrc: monsterImgFolder + 'troll.png', size: 1.1, baseHp: 6, power: 3, boss:BossMonsters[1].name},
    {name: 'Mountain Troll', imgSrc: monsterImgFolder + 'troll_blue.png', size: 1.25, baseHp: 8, power: 4, boss:BossMonsters[1].name},
    {name: 'Zombie', imgSrc: monsterImgFolder + 'zombie.png', size: 0.75, baseHp: 4, power: 1},
    {name: 'Red Dragon', imgSrc: monsterImgFolder + 'reddragon-1.png', size:1.25, baseHp: 10, power:5, specialAttackImg: monsterImgFolder + 'dragonfire.png', boss: BossMonsters[0].name},
    {name: 'Lizardfolk', imgSrc: monsterImgFolder + 'lizardfolk.png', size:0.6, baseHp: 10, power: 2, boss:BossMonsters[2].name},
    {name: 'Skeleton', imgSrc: monsterImgFolder + 'skeleton.png', size: 1, baseHp: 6, power: 2, boss:BossMonsters[3].name}
];

