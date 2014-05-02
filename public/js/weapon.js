function GetWeapon(name, level) {
	return new Weapons[name](level);
}

var Weapon = Class.extend({
  init: function(level){
  	this.id = Math.random().toString().substring(2);
    this.level = level;
  }
});

//weapon level (quality), power (base damage), magic, critPercent, specialAbility

var BuildWeapon = function(varName, name, src, width, height, scale, baseDamage, critPercent, bonusCritDamageLevel) {
	Weapons[varName] = Weapon.extend({
		init: function(level){
			this._super(level);
			this.src = src;
			this.width = width/scale;
			this.height = height/scale;
			this.critPercent = critPercent;
			this.bonusCritDamageLevel = bonusCritDamageLevel;
			this.baseDamage = baseDamage;
			var totalLevel = this.level + baseDamage;
			this.weaponType = name;
			this.upgrade = function() {
			  this.level++;
			  this.name = this.buildWeaponName();
			};
			this.damage = function() {
				var additionalDamage = 0;
				if (this.level > 0)
					additionalDamage = DamageLevel(this.level - 1)()
				return additionalDamage + BaseWeaponDamage(this.baseDamage)();
			};
			this.bonusCritDamage = function() {
				return BonusCritDamage(this.bonusCritDamageLevel)();
			};
			this.critPercentDescriptionIndex = function() {
				return Math.floor(this.critPercent/5*100);
			};
			this.buildWeaponName = function() {
				var name = this.weaponType;
				if (this.critPercent > 0)
					name = BonusCritMultiplierDescriptions[this.critPercentDescriptionIndex()] + " " + name;
				if (this.level > 0)
					name = "+" + this.level + " " + name;
				if (this.bonusCritDamageLevel > 0)
					name = BonusCritDamageDescriptions[this.bonusCritDamageLevel] + " " + name;
				return name;
			};
			this.name = this.buildWeaponName();
		}
	})
};
var BaseWeaponDamage = function(pow) {
    //(1-4), (1,5), (1-6), (1-7), (1-8), (1-9), (1-10), (1-11), (1-12)
    var level = [RollFuncBuilder(1,4), RollFuncBuilder(1,5), RollFuncBuilder(1,6), RollFuncBuilder(1,7), RollFuncBuilder(1,8), RollFuncBuilder(1,9),
                 RollFuncBuilder(1,10), RollFuncBuilder(1,11), RollFuncBuilder(1,12)
                ];
    return level[pow];
};

var BonusCritDamage = function(pow) {
    //(1-4), (1,5), (1-6), (1-7), (1-8), (1-9), (1-10), (1-11), (1-12)
    var level = [RollFuncBuilder(1,1), RollFuncBuilder(1,2), RollFuncBuilder(1,3), RollFuncBuilder(1,4), RollFuncBuilder(1,5), RollFuncBuilder(1,6), RollFuncBuilder(1,7), RollFuncBuilder(1,8), RollFuncBuilder(1,9),
                 RollFuncBuilder(1,10), RollFuncBuilder(1,11), RollFuncBuilder(1,12)
                ];
    return level[pow];
};

//TODO: Create named mappings for features of weapon that affect crit percent and crit bonus damage (baseDamage is the type of weapon itself)
var BonusCritDamageDescriptions = ["", "Sharpened", "Harsh", "Stinging", "Biting", "Vicious", "Bloody", "Brutal", "Maiming", "Deadly", "Eviscerating"];
var BonusCritMultiplierDescriptions = ["Stone", "Copper", "Bronze", "Bone", "Iron", "Steel", "Gold", "Obsidian", "Crystal", "Silver", "Jade", "Ruby", "Emerald", "Sapphire", "Titanium", "Meteorite", "Diamond", "Mithral", "Dragon-Claw", "Adamant"];

var Weapons = {};
BuildWeapon("Dagger", "Dagger", "/images/dagger.png", 100, 100, 1, 0, 0, 0);
BuildWeapon("ShortSword", "Short Sword", "/images/shortsword.png", 100, 100, 1, 1, 0, 0);
BuildWeapon("LongSword", "Long Sword", "/images/sword.png", 100, 100, 1, 2, 0, 0);
BuildWeapon("Battleaxe", "Battleaxe", "/images/axe.png", 100, 100, 1, 3, 0, 0);