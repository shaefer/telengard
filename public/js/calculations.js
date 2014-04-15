var Calculation = {
	toHitMonster:function(player) {
		return 50 + player.prowess + player.luck;
	},
	toHitPlayer:function(player, monster) {
		return 50 + monster.prowess - player.agility - player.luck;
	},
	playerDamage:function(player, crit) {
		var critMult = crit ? player.critMultiplier() : 1;
		return Math.round(
                ((player.strength * player.damageMultiplier()) + Calculation.weaponDamage()) * critMult
            );
	},
	monsterDamage:function(player, monster) {
		return Math.round((monster.strength * Calculation.damageMultiplier(monster)) + monster.weaponDamage());
	},
	weaponDamage:function(weapon) {
		return DiceUtils.d4().total;
	},
	critMultiplier:function(player) {
		return 1.5 + (player.prowess/100);
	},
	damageMultiplier:function(player) {
		return  1 + (player.prowess/100*2);
	},
	fleePercent:function(player) {
		return 50 + (player.luck/2) * (player.agility/1);
	},
	critPercent:function(player) {
		return (player.luck/2) + (player.prowess/1);
	},
	experience:function(monster) {
		var prowessMultiplier = 1 + (player.prowess/100)
		var combatExp = monster.strength * prowessMultiplier * monster.level;
		var spellExp = monster.intelligence * monster.level;
	}
}

var RollFuncBuilder = function(num, sides, mod) {
	return function() {return DiceUtils.roll(num, sides, mod).total;};
};

var DieLevel = function(pow) {
	//no prowess, 0-1 (almost none), (1-2), (1-3), (2-3), (2-4), (2-6), (3-6), (4-6), (3-8), (4-8), (5-8), (6-8), (4-10), (5-10), (6-10), (7-10), (8-10), (5-12), (6-12), (7-12), (8-12), (9-12), (8-20), (10-20), (15-20)
	var level = [RollFuncBuilder(0,0,0), RollFuncBuilder(1,2,-1), RollFuncBuilder(1,3,0), RollFuncBuilder(1,2,1), RollFuncBuilder(1,3,1), RollFuncBuilder(1,5,1),
				RollFuncBuilder(1,4,2), RollFuncBuilder(1,3,3), RollFuncBuilder(1,6,2), RollFuncBuilder(1,5,3), RollFuncBuilder(1,4,4), RollFuncBuilder(1,3,5),
				RollFuncBuilder(1,7,3), RollFuncBuilder(1,6,4), RollFuncBuilder(1,5,5), RollFuncBuilder(1,4,6), RollFuncBuilder(1,3,7), RollFuncBuilder(1,8,4),
				RollFuncBuilder(1,7,5), RollFuncBuilder(1,6,6), RollFuncBuilder(1,5,7), RollFuncBuilder(1,4,8), RollFuncBuilder(1,13,7), RollFuncBuilder(1,11,9),
				RollFuncBuilder(1,6,14)
				];
	return level[pow];
}