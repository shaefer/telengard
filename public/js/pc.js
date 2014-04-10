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

	/** Half of luck plus prowess = Level 1 has: 0 - 6.75% chance of crit**/
    this.critPercent = (this.luck/2) + (this.prowess/1);
    this.critMultiplier = 1 + (this.prowess/100);
    this.prowessMultiplier = 1 + (this.prowess/100*2);
    this.exp = 0;

    this.toDisplay = function() {
    	return prettyPrint(this);
    };
}
PlayerCharacter.prototype.toString = function() {
	return "HP: " + this.hp + " STR: " + this.strength + " ID: " + this.id;
}