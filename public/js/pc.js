function PlayerCharacter(startingPos) {
	Math.seedrandom(new Date().getTime());
    this.id = Math.random().toString().substring(2);

    this.level = 1;
    this.role = "Knight";

    this.status = "";

    this.hp = 200 + DiceUtils.roll(1,10).total;
    this.maxHp = this.hp;
    this.mp = 5 + DiceUtils.roll(1,4).total;
    this.maxMp = this.mp;

    this.strength = DiceUtils.roll(1,4).total; //base damage (1-4)...increase slowly...let gear do most of the increasing.
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
    this.roomInfoKnown = [startingPos]; //For rooms we detected from a distance or were informed of.

	this.lookingForTrouble = false;

	this.weapon = GetWeapon("Dagger", 0); //1-4 damage.
	this.gold = 0;

	this.items = [];
	this.buffs = [];
	this.debuffs = [];

    this.critPercent = function () {
    	return Calculation.critPercent(this);
    };
    this.fleePercent = function() {
    	return Calculation.fleePercent(this);
    };
    this.critMultiplier = function(){
    	return Calculation.critMultiplier(this, this.weapon);
    }
    this.damageMultiplier = function() {
    	return Calculation.damageMultiplier(this);
    }
    this.toHit = function() {
    	return Calculation.toHitMonster(this);
    }
    this.dodge = function() {
    	return (100 - Calculation.toHitPlayerBase(this));
    }
    
    this._critPercent = this.critPercent();
    this._fleePercent = this.fleePercent();
    this._critMultiplier = this.critMultiplier();
    this._damageMultiplier = this.damageMultiplier();

    this.step = function(pos, console) {
    	this.steps++;
    	this.stepsSinceLastRest++;
    	if (!this.hasVisited(pos))
    		this.visited.push(pos);
    	var buffMessages = this.activateBuffs(this.buffs);
    	var debuffMessages = this.activateBuffs(this.debuffs);
    	var messages = buffMessages.concat(debuffMessages);
    	for(var i = 0;i<messages.length;i++)
    	{
    		console(messages[i]);
    	}
    };

    this.setStatus = function(status) {
    	if (status != this.status)
    	{
    		this.status = status;
    		return true;
    	}
    };

    this.activateBuffs = function(buffs) {
		var messages = [];
    	for (var i = buffs.length - 1;i>=0;i--)
    	{
    		var buff = buffs[i];
    		var results = buff.activate(this);
    		if (!results.stillActive)
    		{
    			//display console message on buff expiration?
    			messages.push(results.message + " <span class='specialAttack'>" + buff.name + "</span> has worn off.");
    			buffs.splice(i, 1);
    		}
    		else
    		{
				messages.push(results.message);
    		}
    	}
    	if(messages.length > 0)
    		console.warn(messages);
    	return messages;
    };

    this.hasVisited = function(pos) {
    	var index = this.visited.map(function(e) { return e.toString(); }).indexOf(pos.toString());
    	return index != -1
    };
    this.hasRoomInfo = function(pos) {
        var index = this.roomInfoKnown.map(function(e) { return e.toString(); }).indexOf(pos.toString());
        return index != -1
    }
    this.knowsAbout = function(pos) {
        return this.hasVisited(pos) || this.hasRoomInfo(pos);
    };

    this.heal = function(amount) {
    	var newTotal = this.hp + amount;
		if (newTotal > this.maxHp)
			newTotal = this.maxHp
		this.hp = newTotal;
    };

    this.addBuff = function(buff, harmful) {
    	if (harmful)
    	{
    		return this.addBuffToList(this.debuffs, buff);
    	}
    	else
    	{
    		return this.addBuffToList(this.buffs, buff);
    	}
    };

    this.addBuffToList = function(buffList, buff) {
    	var currentBuff = this.findBuff(buffList, buff);
    	if (currentBuff && currentBuff.continuous)
    	{
    		this.augmentBuff(currentBuff, buff.duration); //maybe just +1 step duration rather than full reset?
    		return "augmented";
    	}
    	else if (currentBuff && !currentBuff.continuous)
    	{
    		console.warn('Tried to buff non continuous buff again...ignored.')
    		return false;
    	}
    	else if (!currentBuff)
    	{
    		this.addNewBuff(buffList, buff);
    		return true;
    	}
    };

    this.augmentBuff = function(buff, newDuration) {
    	buff.augment();
    	buff.duration = newDuration;
    };

    this.addNewBuff = function(buffList, buff) {
    	buffList.push(buff);
		if (!buff.continuous)
			buff.start(this);
    };

    this.findBuff = function(buffList, buff) {
    	for(var i = 0;i<buffList.length;i++)
    	{
    		var currentBuff = buffList[i];
    		if (currentBuff.name == buff.name)
    			return currentBuff;
    	}
    };

    this.awardKill = function(monster) {
        this.kills.push({name:monster.name, level:monster.level});
        this.killsSinceLastRest++;
        return {killCount: this.kills.length, skillSinceLastRest: this.killsSinceLastRest};
    };

    this.awardExperienceAndLevelUp = function(exp) {
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
        this.debuffs = [];
    };

    this.toDisplay = function() {
    	//return prettyPrint(this);
    	var display = "";
    	display += "<div>Level: " + this.level + "</div>";
    	display += "<div>Class: " + this.role + "</div>";
    	display += "<div>Exp: " + this.exp + "/" + this.expToNext + "</div>";
    	display += "<div>Gold: " + this.gold + "</div>";

    	display += "<div>Steps: " + this.steps + "</div>";
    	display += "<div>Kills: " + this.kills.length + "</div>";
    	display += "<div>Rooms visited: " + this.visited.length + "</div>";

    	display += "<div>Items: [" + this.items.join(", ") + "]</div>";
    	display += "<div>Buffs: [" + this.buffs.join(", ") + "]</div>";
    	display += "<div>Debuffs: [" + this.debuffs.join(", ") + "]</div>";

    	display += "<div>Hp: " + this.hp + "/" + this.maxHp + "</div>";
    	display += "<div>Str: " + this.strength + "</div>";
    	display += "<div>Int: " + this.intelligence + "</div>";
    	display += "<div>Agi: " + this.agility + "</div>";
    	display += "<div>Lck: " + this.luck + "</div>";
    	display += "<div>Prw: " + this.prowess + "</div>";
    	display += "<div>Dmg: (" + this.weapon.damageDisplay() + " + 1d" + this.strength + ") * " + this.damageMultiplier();
    	display += "<div>Crit%: " + this.critPercent() + "</div>";
    	display += "<div>Crit x: " + this.critMultiplier() + "</div>";
    	display += "<div>Dmg x: " + this.damageMultiplier() + "</div>";
    	display += "<div>Flee%: " + this.fleePercent() + "</div>";
    	display += "<div>Hit%: " + this.toHit() + "</div>";
    	display += "<div>Dodge%: " + this.dodge() + " - monster's prowess score.</div>";
    	display += this.weapon.toDisplay();

    	display += "<div>lookingForTrouble: " + this.lookingForTrouble + "</div>";
    	return display;
    };
}
PlayerCharacter.prototype.toString = function() {
	return "HP: " + this.hp + " STR: " + this.strength + " ID: " + this.id;
}