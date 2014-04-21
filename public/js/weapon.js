function GetWeapon(name, level) {
	return new Weapons[name](level);
}

var Weapon = Class.extend({
  init: function(level){
  	this.id = Math.random().toString().substring(2);
    this.level = level ? level : 1;
  }
});

var BuildWeapon = function(varName, name, src, width, height, scale, damageLevel) {
	Weapons[varName] = Weapon.extend({
		init: function(level){
			this._super(level);
			this.src = src;
			this.width = width/scale;
			this.height = height/scale;
            var weaponLevel = damageLevel + this.level;
            this.name = WeaponDescriptions[weaponLevel] + " " + name;
			this.damageLevel = DamageLevel(weaponLevel);
			this.damage = function() {
				return this.damageLevel();
			};
		}
	})
};
var WeaponDescriptions = ["Broken", "Rusty", "Basic", "Sharpened", "Expertly Sharpened", "Crafted", "Honed", "Expertly Crafted", "Deadly", "Assassin's", "Perfect"];

var Weapons = {};
BuildWeapon("Dagger", "Dagger", "/images/dagger.png", 100, 100, 1, 0);