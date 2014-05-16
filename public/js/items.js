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
var Buff = Class.extend({
	init:function(stat, amount, duration){
		this.stat = stat;
		this.amount = amount;
		this.duration = duration;
	},
	start:function(target){
		target[this.stat] += this.amount;
	},
	end:function(target){
		target[this.stat] -= this.amount;
	}
});
var Item = Class.extend({
	init: function(name, itemType, targetType, effectFuncs){
		this.name = name;
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
	}
});

Items = [];
var healEffect = new Effect(
	"Heal 5-15 hp", 
	function(item, amount){return "<span>You heal " + amount + " hit points</span>"}, 
	function(target){
		var amount = DiceUtils.roll(2, 6, 3).total;
		target.heal(amount);
		return amount;
	}
);

var strBoost = new Effect(
	"Boost Str 1-4",
	function(item, amount){return "<span>Your str increases by " + amount + ".</span>"},
	function(target){
		var amount = DiceUtils.d4().total;
		target.addBuff(new Buff("strength", amount, 5));
		return amount;
	}
);

var PotionOfStrength = function() {
	return new Item("Potion of Strength", "potion", "player", [strBoost]);
};

var PotionOfHealing = function() {
	return new Item("Potion of Healing", "potion", "player", [healEffect]);
};

var PotionOfStengthAndHealing = function() {
	return new Item("Potion of Mighty Health", "potion", "player", [strBoost, healEffect])
}

Items.push(PotionOfHealing(), PotionOfStrength(), PotionOfStengthAndHealing());