function PlayerCharacter() {
	Math.seedrandom(new Date().getTime());
    var rand = Math.random().toString().substring(2);
    var r = 0;
    this.id = rand;

    this.level = 1;

    this.hp = 20 + GetIdChar(rand, r++);
    this.mp = 5 + GetIdChar(rand, r++)/2;

    this.strength = 10 + GetIdChar(rand, r++)/2;
    this.intelligence = 10 + GetIdChar(rand, r++)/2;
    this.agility = 10 + GetIdChar(rand, r++)/2;

    this.luck = 0 + GetIdChar(rand, r++)/2;
    this.prowess = 0 + GetIdChar(rand, r++)/2;

	this.exp = 0;

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

    this.toDisplay = function() {
    	return prettyPrint(this);
    };
}
PlayerCharacter.prototype.toString = function() {
	return "HP: " + this.hp + " STR: " + this.strength + " ID: " + this.id;
}