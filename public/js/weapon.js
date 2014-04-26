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

var BuildWeapon = function(varName, name, src, width, height, scale, damageLevel) {
	Weapons[varName] = Weapon.extend({
		init: function(level){
			this._super(level);
			this.src = src;
			this.width = width/scale;
			this.height = height/scale;
            this.damageLevel = damageLevel;
            var totalLevel = this.level + damageLevel;
            this.weaponType = name;
            this.name = WeaponDescriptions[totalLevel] + " " + name;
            this.upgradeDamageLevel = function() {
                this.damageLevel++;
                this.name = WeaponDescriptions[this.level + this.damageLevel] + " " + this.weaponType;
            };
			this.damage = function() {
				return DamageLevel(this.level + this.damageLevel)();
			};
		}
	})
};
var WeaponDescriptions = ["Broken", "Rusty", "Basic", "Sharpened", "Expertly Sharpened", "Crafted", "Honed", "Expertly Crafted", "Deadly", "Assassin's", "Perfect"];

var Weapons = {};
BuildWeapon("Dagger", "Dagger", "/images/dagger.png", 100, 100, 1, 0);
BuildWeapon("ShortSword", "Short Sword", "/images/shortsword.png", 100, 100, 1, 1);
BuildWeapon("LongSword", "Long Sword", "/images/sword.png", 100, 100, 1, 2);
BuildWeapon("Battleaxe", "Battleaxe", "/images/axe.png", 100, 100, 1, 3);