var Calculation = {
	toHitMonster:function(player) {
		return 50 + player.prowess;
	},
	playerDamage:function(player, crit) {
		var critMult = crit ? player.critMultiplier : 1;
		return Math.round(
                ((player.strength * player.prowessMultiplier) + Calculation.weaponDamage().total) * critMult
            );
	},
	weaponDamage:function(weapon) {
		return DiceUtils.d4();
	}
}

//calculation:"((" + player.strength + " * " + player.prowessMultiplier + ") + " + Calculation.weaponDamage() + ") * " + critMult