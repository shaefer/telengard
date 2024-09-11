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
            const dmg = Math.round(monsterDamage(monster) * (1+critMultiplier));
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

const monsterExp = (monster, playerLevel) => {
    //TODO: If monster has above average hp give more exp. 
    let levelAdjustMultiplier = 1;
    if (playerLevel > monster.level) levelAdjustMultiplier = 0.5;
    if (playerLevel < monster.level) levelAdjustMultiplier = 1.25;
    if (playerLevel + 5 < monster.level) levelAdjustMultiplier = 2;
    return Math.round(monster.level * monster.power * (monster.xpBonusMultiplier||1) * levelAdjustMultiplier);
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

const fear_sa = () => {

}

const Monsters = [
    {name: 'Troll', imgSrc: monsterImgFolder + 'troll.png', size: 1.1, baseHp: 6, power: 3, boss:BossMonsters[1].name},
    {name: 'Mountain Troll', imgSrc: monsterImgFolder + 'troll_mountain.png', size: 1.25, baseHp: 8, power: 4, boss:BossMonsters[1].name},
    {name: 'Zombie', imgSrc: monsterImgFolder + 'zombie.png', size: 0.75, baseHp: 4, power: 1},
    {name: 'Red Dragon', imgSrc: monsterImgFolder + 'reddragon.png', size:1.25, baseHp: 10, power:5, 
            hasSpecialAttack: true,
            specialAttackText: "breathes fire",
            specialAttackImg: monsterImgFolder + 'dragonfire.png',
            specialAttackAudio:'audio/v2/dragon-roar-high-intensity-36564.mp3', boss: BossMonsters[0].name,
            specialAttackLength: 4000,
            specialAttackPercentChance: 40},
    {name: 'Lizardfolk', imgSrc: monsterImgFolder + 'lizardfolk.png', size:0.6, baseHp: 10, power: 2, boss:BossMonsters[2].name},
    {name: 'Skeleton', imgSrc: monsterImgFolder + 'skeleton.png', size: 1, baseHp: 6, power: 2, boss:BossMonsters[3].name},
    {name: 'Spectre', imgSrc: monsterImgFolder + 'spectre.png', size: 1.2, baseHp: 10, power: 4},
    {name: 'Dark Elf', imgSrc: monsterImgFolder + 'darkelf.png', size: 1, baseHp: 8, power: 4}
];

const MoreMonsters = [
    {name: 'Minotaur', imgSrc: monsterImgFolder + 'minotaur.png', size: 1.5, baseHp: 12, power: 5, xpBonusMultiplier: 1.2},
    {name: 'Runic Minotaur', imgSrc: monsterImgFolder + 'minotaur_runic.png', size: 1.2, baseHp: 8, power: 7, xpBonusMultiplier: 1.2},
    {name: 'Molten Minotaur', imgSrc: monsterImgFolder + 'minotaur_fire.png', size: 1.5, baseHp: 10, power: 6, xpBonusMultiplier: 1.2},
    {name: 'Lightning Minotaur', imgSrc: monsterImgFolder + 'minotaur_lightning.png', size: 1.2, baseHp: 10, power: 4, xpBonusMultiplier: 1.2},
];

function MonstersForLevel(z) {
    if (gameConfig.testMonsters) {
        return MoreMonsters;
    }
    
    if (z <= 1) { //first floor is 0
        return Monsters.filter(x => x.name != 'Red Dragon');
    } else if (z > 1 && z <= 3) {
        return Monsters;
    } else if (z > 3 && z <= 5) {
        return Monsters.concat(MoreMonsters.filter(x => x.name == 'Minotaur'));
    } else {
        return Monsters.filter(x => !['Zombie', 'Lizardfolk'].includes(x.name)).concat(MoreMonsters);
    }
}

