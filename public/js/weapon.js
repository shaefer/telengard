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
			this.name = name;
			this.src = src;
			this.width = width/scale;
			this.height = height/scale;
			this.damageLevel = DamageLevel(damageLevel + this.level);
			this.damage = function() {
				return this.damageLevel();
			};
		}
	})
};

var Weapons = {};
BuildWeapon("Dagger", "Dagger", "/images/dagger.png", 100, 100, 1, 0);