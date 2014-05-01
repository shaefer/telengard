var Calculation = {
	toHitMonster:function(player) {
		return 50 + player.prowess + player.luck;
	},
	toHitPlayer:function(player, monster) {
		return 50 + monster.prowess - player.agility - player.luck;
	},
	playerDamage:function(player, crit) {
		var baseDamage = (player.weapon.damage() + player.strength) * Calculation.damageMultiplier(player);
		if (!crit) return Math.round(baseDamage);
		return Math.round((baseDamage * player.critMultiplier()) + player.weapon.bonusCritDamage());
	},
	monsterDamage:function(player, monster) {
		return Math.round(Calculation.damageMultiplier(monster) * monster.weaponDamage());
	},
	critMultiplier:function(player, weapon) {
		return 1.5 + weapon.critPercent + (player.prowess/100);
	},
	damageMultiplier:function(player) {
		return  1 + (player.prowess/100);
	},
	fleePercent:function(player) {
		return 50 + (player.luck/2) * (player.agility/1);
	},
	critPercent:function(player) {
		return (player.luck/2) + (player.prowess/1);
	},
	experience:function(player, monster) {
		var prowessMultiplier = 1 + (monster.prowess/100)
		var damageMultiplier = 1 + (monster.damageLevel/10);
		var combatExp = damageMultiplier * prowessMultiplier * monster.level;
		var spellExp = 1 * monster.level;
		var hpExp = monster.maxHp / 3 * monster.level;
		var adventurerBonus = player.adventurerExperienceBonusMultiplier(); //TODO: Set a max on this?
		console.debug(adventurerBonus);
		return Math.round((combatExp + spellExp + hpExp) * adventurerBonus);
	}
}

var RollFuncBuilder = function(num, sides, mod) {
	return function() {return DiceUtils.roll(num, sides, mod).total;};
};

var DieLevel = function(pow) {
	//(1-1), (1-2), (1-3), (2-3), (2-4), (2-6), (3-6), (4-6), (3-8), (4-8), (5-8), (6-8), (4-10), (5-10), (6-10), (7-10), (8-10), (5-12), (6-12), (7-12), (8-12), (9-12), (8-20), (10-20), (15-20)
	var level = [RollFuncBuilder(1,1,0), RollFuncBuilder(1,2,0), RollFuncBuilder(1,3,0), RollFuncBuilder(1,2,1), RollFuncBuilder(1,3,1), RollFuncBuilder(1,5,1),
				RollFuncBuilder(1,4,2), RollFuncBuilder(1,3,3), RollFuncBuilder(1,6,2), RollFuncBuilder(1,5,3), RollFuncBuilder(1,4,4), RollFuncBuilder(1,3,5),
				RollFuncBuilder(1,7,3), RollFuncBuilder(1,6,4), RollFuncBuilder(1,5,5), RollFuncBuilder(1,4,6), RollFuncBuilder(1,3,7), RollFuncBuilder(1,8,4),
				RollFuncBuilder(1,7,5), RollFuncBuilder(1,6,6), RollFuncBuilder(1,5,7), RollFuncBuilder(1,4,8), RollFuncBuilder(1,13,7), RollFuncBuilder(1,11,9),
				RollFuncBuilder(1,6,14)
				];
	return level[pow];
};

var DamageLevel = function(pow) {
	//(1-4), (2-4), (1-6), (2-6), (1-8), (2-8), (3-8), (1-10), (2-10), (3-10), (4-10), (1-12), (2-12), (3-12), (4-12), (5-12)
	var level = [RollFuncBuilder(1,4,0), RollFuncBuilder(1,3,1), RollFuncBuilder(1,6,0), RollFuncBuilder(1,5,1), RollFuncBuilder(1,8,0), RollFuncBuilder(1,7,1),
				 RollFuncBuilder(1,6,2), RollFuncBuilder(1,10,0), RollFuncBuilder(1,9,1), RollFuncBuilder(1,8,2), RollFuncBuilder(1,7,3), RollFuncBuilder(1,12,0),
				 RollFuncBuilder(1,11,1), RollFuncBuilder(1,10,2), RollFuncBuilder(1,9,3), RollFuncBuilder(1,8,4)
				];
	return level[pow];
};