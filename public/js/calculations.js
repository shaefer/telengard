var Calculation = {
	toHitMonster:function(player) {
		return 50 + player.prowess + player.luck;
	},
	toHitPlayerBase:function(player) {
		return Math.max(0, 50 - player.agility - player.luck);
	},
	toHitPlayer:function(player, monster) {
		return Calculation.toHitPlayerBase(player) + monster.prowess;
	},
	playerDamage:function(player, crit) {
		var weaponDamage = player.weapon.damage();
		var dmgMult = Calculation.damageMultiplier(player);
		var baseDamage = (weaponDamage + DiceUtils.roll(1, player.strength).total) * dmgMult;
		console.warn("wd: " + weaponDamage + " str: " + player.strength + " mult: " + dmgMult + " total: " + baseDamage);
		if (!crit) return Math.round(baseDamage);
		return Math.round((baseDamage * player.critMultiplier()) + player.weapon.bonusCritDamage());
	},
	monsterDamage:function(player, monster) {
		console.warn(monster.name + " damage: " + monster.weaponDamageFn.toDisplay() + " * " + Calculation.damageMultiplier(monster));
		var dmgMult = Calculation.damageMultiplier(monster);
		var weaponDmg = monster.weaponDamage();
		console.warn(monster.name + " damage: " + weaponDmg + " * " + dmgMult);
		return Math.round(dmgMult * weaponDmg);
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
		return 1 + (player.luck/100) + (player.prowess/100) + player.weapon.critPercent;
	},
	experience:function(player, monster) {
		var prowessMultiplier = 1 + (monster.prowess/100)
		var damageMultiplier = 1 + (monster.damageLevel/10);
		if (monster.specialAttack)
			damageMultiplier = 1 + ((monster.specialAttack.damageLevelBonus + monster.damageLevel)/10);
		var differenceInLevels = monster.level - player.level;
		var specialAttackMultiplier = 1;
		if (monster.specialAttack)
			specialAttackMultiplier = 1.1; //10% bonus for having any special attacks. (this is in addition to the way it affects damageMultiplier)
		var levelDiffMultiplier = 1;
		//+1 = 50%, +2 = 75%, +3 = 115%, +4 = 150%,  
		if (differenceInLevels > 0)
			levelDiffMultiplier = Math.pow(1.25, differenceInLevels)
		console.debug("damageMultiplier: " + damageMultiplier + " prowessMultiplier: " + prowessMultiplier + " monsterLevel: " + monster.level + " levelDiffMultiplier: " + levelDiffMultiplier + " specialAttackMultiplier: " + specialAttackMultiplier);
		var combatExp = damageMultiplier * prowessMultiplier * monster.level * levelDiffMultiplier * specialAttackMultiplier;
		var spellExp = 1 * monster.level;
		var hpExp = monster.maxHp / 3 * monster.level;
		var adventurerBonus = player.adventurerExperienceBonusMultiplier(); //TODO: Set a max on this?
		console.debug(adventurerBonus);
		return Math.round((combatExp + spellExp + hpExp) * adventurerBonus);
	},
	experienceForDiscovery:function(player, discoveryType, level) {
		return player.adventurerExperienceBonusMultiplier() * discoveryType.exp(level);
	}
}

var RollFuncBuilder = function(num, sides, mod) {
	return {
		num:num,
		sides:sides,
		mod:mod,
		toDisplay:function() {
			var modDesc = "";
			if (this.mod < 0)
				modDesc = "-" + this.mod;
			if (this.mod > 0)
				modDesc = "+" + this.mod;
			return this.num + "d" + this.sides + modDesc;
		},
		fn:function() {
			return DiceUtils.roll(this.num, this.sides, this.mod).total;
		}
	};
};

//TODO: Standardize progressions into something mathematical...they are close now.
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

//avg dmg wide range
//avg dmg med range
//avg dmg small range

//wide range (just upping max with slow upping of min(mod))
//slow progression with min around half of roll