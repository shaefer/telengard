function PlayerCharacter() {
	Math.seedrandom(new Date().getTime());
    var rand = Math.random().toString().substring(2);
    var r = 0;
    this.id = rand;

    this.level = 1;

    this.hp = 200 + GetIdChar(rand, r++);
    this.maxHp = this.hp;
    this.mp = 5 + GetIdChar(rand, r++)/2;

    this.strength = 10 + GetIdChar(rand, r++)/2;
    this.intelligence = 10 + GetIdChar(rand, r++)/2;
    this.agility = 10 + GetIdChar(rand, r++)/2;

    this.luck = 0 + GetIdChar(rand, r++)/2;
    this.prowess = 0 + GetIdChar(rand, r++)/2;

	this.exp = 450;
	this.expToNext = 500;

	/** Half of luck plus prowess = Level 1 has: 0 - 6.75% chance of crit**/
    this.critPercent = function () {
    	return Calculation.critPercent(this);
    };
    this.fleePercent = function() {
    	return Calculation.fleePercent(this);
    };
    this.critMultiplier = function(){
    	return Calculation.critMultiplier(this);
    }
    this.damageMultiplier = function() {
    	return Calculation.damageMultiplier(this);
    }
    
    this._critPercent = this.critPercent();
    this._fleePercent = this.fleePercent();
    this._critMultiplier = this.critMultiplier();
    this._damageMultiplier = this.damageMultiplier();

    this.awardExperience = function(exp) {
    	this.exp += exp;
    	return this.levelUp();
    };

    this.levelUp = function() {
		if (this.exp < this.expToNext) return false;

		this.exp = this.exp - this.expToNext; //keep leftover
		this.level++;
		this.expToNext = Math.pow(this.level, 2)/2 * 1000;

		this.strength += DiceUtils.d6().total;
		this.intelligence+= DiceUtils.d6().total;
		this.agility += DiceUtils.d6().total;
		this.luck += DiceUtils.d4().total;
		this.prowess += DiceUtils.d4().total;

		var additionalHp = DiceUtils.roll(1,11,9).total;
		this.maxHp += additionalHp;
		if (this.hp + (additionalHp * 2) <= this.maxHp) {
			this.hp += (additionalHp * 2);
		}
		else
		{
			this.hp = this.maxHp;
		}

		return true;
    }

    this.toDisplay = function() {
    	return prettyPrint(this);
    };
}
PlayerCharacter.prototype.toString = function() {
	return "HP: " + this.hp + " STR: " + this.strength + " ID: " + this.id;
}