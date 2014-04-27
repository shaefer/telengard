function PlayerCharacter(startingPos) {
	Math.seedrandom(new Date().getTime());
    this.id = Math.random().toString().substring(2);

    this.level = 1;

    this.hp = 2000 + DiceUtils.roll(1,10).total;
    this.maxHp = this.hp;
    this.mp = 5 + DiceUtils.roll(1,4).total;
    this.maxMp = this.mp;

    this.strength = DiceUtils.roll(1,6,4).total; //base damage (5-10)...increase slowly...let gear do most of the increasing.
    this.intelligence = DiceUtils.roll(1,4).total;
    this.agility = DiceUtils.roll(1,4).total;

    this.luck = DiceUtils.roll(1,4).total;
    this.prowess = DiceUtils.roll(1,4).total;

	this.exp = 0;
	this.expToNext = 500;

	this.kills = [];
	this.steps = 0;
	this.stepsSinceLastRest = 0;
	this.killsSinceLastRest = 0;
	this.visited = [startingPos];

	this.lookingForTrouble = false;

	this.weapon = GetWeapon("Dagger", 0);
	this.gold = 0;

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

    this.step = function(pos) {
    	this.steps++;
    	this.stepsSinceLastRest++;
    	this.visited.push(pos);
    };

    this.hasVisited = function(pos) {
    	console.warn('checking for has visited on: ' + pos.toString());
    	var index = this.visited.map(function(e) { return e.toString(); }).indexOf(pos.toString());
    	console.warn("Found index: " + index);
    	return index != -1
    };

    this.awardKillAndExperience = function(monster, exp) {
    	this.kills.push({name:monster.name, level:monster.level});
    	this.killsSinceLastRest++;
    	this.exp += exp;
    	return this.levelUp();
    };

    this.adventurerExperienceBonusMultiplier = function() {
    	return 1 + this.killsSinceLastRest/100
    };

    this.levelUp = function() {
		if (this.exp < this.expToNext) return false;

		this.exp = this.exp - this.expToNext; //keep leftover
		this.level++;
		this.expToNext = Math.pow(this.level, 2)/2 * 1000;

        var str = DiceUtils.d3().total;
		this.strength += str;
        var intelligence = DiceUtils.d3().total
		this.intelligence+= intelligence;
        var agility = DiceUtils.d3().total
		this.agility += agility;
        var luck = DiceUtils.d3().total;
		this.luck += luck;
		var prowess = DiceUtils.d3().total
		this.prowess += prowess;

		var additionalHp = DiceUtils.roll(1,11,9).total;
		this.maxHp += additionalHp;
		if (this.hp + (additionalHp * 2) <= this.maxHp) {
			this.hp += (additionalHp * 2);
		}
		else
		{
			this.hp = this.maxHp;
		}

		return {str:str, intelligence:intelligence, agility:agility, luck:luck, prowess:prowess, hp:additionalHp};
    }

    this.rest = function() {
		this.hp = this.maxHp;
        this.mp = this.maxMp;
        this.stepsSinceLastRest = 0;
        this.killsSinceLastRest = 0;
    };

    this.toDisplay = function() {
    	return prettyPrint(this);
    };
}
PlayerCharacter.prototype.toString = function() {
	return "HP: " + this.hp + " STR: " + this.strength + " ID: " + this.id;
}