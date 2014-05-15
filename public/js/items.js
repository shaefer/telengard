var Effect = Class.extend({
	init:function(name, descriptionTemplateFn, effectFunc)
	{
		this.name = name;
		this.descriptionTemplateFn = descriptionTemplateFn;
		this.effectFunc = effectFunc;
	},
	trigger:function(target){
		var amountOfEffect = this.effectFunc(target); //effect functions should return the numeric value utilized.
		return this.descriptionTemplateFn(amountOfEffect);
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
			descriptions.push(this.effects[i].trigger(target)); //firing an effect returns the description of the effect.
		}
		return descriptions;
	}
});

Items = [];
var healEffect = new Effect(
	"Heal 5-15 hp", 
	function(amount){return "<span>You heal " + amount + " hit points</span>"}, 
	function(target){
		var amount = DiceUtils.roll(2, 6, 3).total;
		var newTotal = target.hp + amount;
		if (newTotal > target.maxHp)
			newTotal = target.maxHp
		target.hp = newTotal;
		return amount;
	}
);

Items.push(new Item("Potion of Healing", "potion", "player", [healEffect]));