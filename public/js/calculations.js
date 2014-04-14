var Calculation = {
	toHitMonster:function(player) {
		return 50 + player.prowess;
	},
	toHitPlayer:function(player, monster) {
		return 50 + monster.prowess - player.agility - player.luck;
	},
	playerDamage:function(player, crit) {
		var critMult = crit ? player.critMultiplier() : 1;
		return Math.round(
                ((player.strength * player.damageMultiplier()) + Calculation.weaponDamage().total) * critMult
            );
	},
	weaponDamage:function(weapon) {
		return DiceUtils.d4();
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
	}

}

//calculation:"((" + player.strength + " * " + player.prowessMultiplier + ") + " + Calculation.weaponDamage() + ") * " + critMult