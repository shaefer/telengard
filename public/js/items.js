var Effect = Class.extend({
	init:function(name, descriptionTemplateFn, effectFunc)
	{
		this.name = name;
		this.descriptionTemplateFn = descriptionTemplateFn;
		this.effectFunc = effectFunc;
	},
	trigger:function(item, target){
		var amountOfEffect = this.effectFunc(target); //effect functions should return the numeric value utilized.
		return this.descriptionTemplateFn(item, amountOfEffect);
	}
});

//continuous buffs can generate different values each activation (function based rolled values)
var ContinuousBuff = Class.extend({
	init: function(name, stat, amount, duration){
		this.continuous = true;
		this.name = name;
		this.stat = stat;
		this.amount = amount;
		this.duration = duration;
	},
	activate: function(target) {
		var amount = this.getAmount();
		if (this.stat == 'hp')
			target.heal(amount); //TODO: some stats have specific rules around not exceeding maxhp...how to handle generically? Probably will need stat objects with rules like that.
		else
			target[this.stat] += amount;
		this.duration -= 1;
		return {stillActive: this.duration > 0, message:this.getMessage(amount)}
	},
	getAmount:function() {
		if (isNumber(this.amount))
			return this.amount;
		else if (isFunction(this.amount))
			return this.amount();
		else if (isObject(this.amount)) //really should be checking for RollObject (which is not a thing yet.)
			return this.amount.fn();
	},
	augment:function() {
		if (isNumber(this.amount))
		{
			if (this.amount < 0)
				this.amount -= 1;
			else if (this.amount > 0)
				this.amount += 1;
		}
		else if (isFunction(this.amount))
		{
			var sampleValue = this.amount();
			this.previousAmount = this.amount;
			if (sampleValue < 0)
				this.amount = function() {return this.previousAmount() - 1};
			else if (sampleValue > 0)
				this.amount = function() {return this.previousAmount() + 1};
		}
		else if (isObject(this.amount)) //really should be checking for RollObject (which is not a thing yet.)
		{
			if (this.amount.fn.mod < 0)
				this.amount.fn.mod -= 1;
			else if (this.amount.fn.mod > 0)
				this.amount.fn.mod += 1;
		}
	},
	getMessage:function(amount) {
		if (amount > 0)
			return "<span class='specialAttack'>" + this.name + "</span> raised your " + this.stat + " by " + amount + ".";
		else if (amount < 0)
			return "<span class='specialAttack'>" + this.name + "</span> drained your " + this.stat + " by " + amount + ".";
		else
			return "";
	},
	toString:function() {
		if (isNumber(this.amount))
		{
			var sign = "+";
			if (this.amount < 0)
				sign = "";
			return sign + this.amount + " " + this.stat + " for " + this.duration + " steps.";
		}
		else if (isObject(this.amount))
			return "+/-" + this.amount.toDisplay() + " " + this.stat + " for " + this.duration + " steps.";
		else
			return "+/-" + " some amount of " + this.stat + " for " + this.duration + " steps.";
	}
});
//standard buffs always have a fixed value...this value could always be rolled, but it would be rolled prior to construction.
var Buff = Class.extend({
	init:function(name, stat, amount, duration){
		this.name = name;
		this.stat = stat;
		this.amount = amount;
		this.duration = duration;
	},
	start:function(target){
		target[this.stat] += this.amount;
	},
	end:function(target){
		target[this.stat] -= this.amount;
	},
	activate: function(target) {
		this.duration -= 1;
		var stillActive = this.duration > 0;
		if (!stillActive) this.end(target);
		return {stillActive:stillActive, message:""};
	},
	augment: function() {
		if (this.amount < 0)
			this.amount -= 1;
		else if (this.amount > 0)
			this.amount += 1;
	},
	getMessage:function(amount) {
		if (amount > 0)
			return "<span class='specialAttack'>" + this.name + "</span> raised your " + this.stat + " by " + amount + ".";
		else if (amount < 0)
			return "<span class='specialAttack'>" + this.name + "</span> drained your " + this.stat + " by " + amount + ".";
		else
			return "";
	},
	toString:function() {
		return "+" + this.amount + " " + this.stat + " for " + this.duration + " steps.";
	}
});
var Item = Class.extend({
	init: function(name, src, itemType, targetType, effectFuncs){
		this.name = name;
		this.src = src;
		this.type = itemType;
		this.targetType = targetType;
		this.effects = effectFuncs;
	},
	use: function(target)
	{
		var descriptions = [];
		for(var i=0;i<this.effects.length;i++)
		{
			descriptions.push(this.effects[i].trigger(this.name, target)); //firing an effect returns the description of the effect.
		}
		return descriptions;
	},
	toString: function(){
		return this.name;
	}
});

var Potion = Item.extend({
	init: function(name, effectFuncs) {
		var imgNum = DiceUtils.d2().total;
		this._super(name, "/images/openclipart/potion_"+imgNum+".png", "potion", "player", effectFuncs);
	}
});

Items = [];
var healEffect = new Effect(
	"Heal 5-15 hp", 
	function(item, amount){return "You heal <span class='goodEvent'>" + amount + "</span> hit points."}, 
	function(target){
		var amount = DiceUtils.roll(2, 6, 3).total;
		target.heal(amount);
		return amount;
	}
);

var strBoost = new Effect(
	"Boost Str 1-4",
	function(item, amount){
		if (amount)
			return "Your str increases by <span class='goodEvent'>" + amount + "</span>."
		else
			return "<span>Your str cannot be increased further<span>"
	},
	function(target){
		var amount = DiceUtils.d4().total;
		var result = target.addBuff(new Buff("Strength Boost", "strength", amount, 5));
		if (result === true)
			return amount;
		return result;
	}
);

var PoisonEffect = function(prefix) {
	var name = "Poison";
	if (prefix)
		name = prefix + " " + name;
	return new Effect(
		name,
		function(item, amount){
			if (amount == 'augmented')
				return "The <span class='specialAttack'>"+name+"</span> has become more virulent."
			else if (amount)
				return "You have been <span class='specialAttack'>poisoned</span>."
			
		}, 
		function(target){
			return target.addBuff(new ContinuousBuff(name, "hp", -1, 5), true);
		}
	);
};


var PotionOfStrength = function() {
	return new Potion("Potion of Strength", [strBoost]);
};

var PotionOfHealing = function() {
	return new Potion("Potion of Healing", [healEffect]);
};

var PotionOfStengthAndHealing = function() {
	return new Potion("Potion of Mighty Health", [strBoost, healEffect])
}

Items.push(PotionOfHealing, PotionOfStrength, PotionOfStengthAndHealing);
function GetRandomPotion() {
	//TODO: Split out chance of simple potion versus combo potions.
	return Items[DiceUtils.roll(1, Items.length, -1).total]();
}