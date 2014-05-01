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
      this.name = WeaponDescriptions[this.level] + " " + name;
      this.upgrade = function() {
          this.level++;
          this.name = WeaponDescriptions[this.level] + " " + this.weaponType;
      };
			this.damage = function() {
				return DamageLevel(this.level)() + BaseWeaponDamage(this.baseDamage)();
			};
      this.bonusCritDamage = function() {
        return BonusCritDamage(this.bonusCritDamageLevel)();
      };
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

//currently maps to weapon level
var WeaponDescriptions = ["Broken", "Rusty", "Basic", "Sharpened", "Expertly Sharpened", "Crafted", "Honed", "Expertly Crafted", "Deadly", "Assassin's", "Perfect"];
//TODO: Create named mappings for features of weapon that affect crit percent and crit bonus damage (baseDamage is the type of weapon itself)
var BonusCritDamageDescriptions = ["Biting", "Vicious", "Bloody", "Maiming", "Eviscerating"];

var Weapons = {};
BuildWeapon("Dagger", "Dagger", "/images/dagger.png", 100, 100, 1, 0, 0, 0);
BuildWeapon("ShortSword", "Short Sword", "/images/shortsword.png", 100, 100, 1, 1, 0.01, 0);
BuildWeapon("LongSword", "Long Sword", "/images/sword.png", 100, 100, 1, 2, 0.02, 0);
BuildWeapon("Battleaxe", "Battleaxe", "/images/axe.png", 100, 100, 1, 3, 0.03, 0);