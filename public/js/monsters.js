function GetMonster(pos) {
    var roll = DiceUtils.roll(2, 6, -2).total 
    var level0 = [Monsters.Behir, Monsters.WarTroll, Monsters.Basilisk, Monsters.KoboldMerc, Monsters.DireBat, Monsters.DireRat, 
    			 Monsters.Skeleton, Monsters.OrcLeader, Monsters.DireCrocodile, Monsters.IronGolem, Monsters.RedDragon];
    //FeralTroll currently unused.
    var monsterFunc = level0[roll]
    return new monsterFunc(pos.z);
}

function GetMonsterFoundPhrase(monsterName) {
    var id = Math.random().toString().substring(2);
    var digit = Number(id.toString().substring(0, 1));
    if (digit.inRange(0,3))
    	return "A menacing " + monsterName + " appears from around a corner.";
    if (digit.inRange(4,6))
    	return "A vicious " + monsterName + " is ready to attack.";
    if (digit.inRange(7,9))
    	return "An impressive " + monsterName + " looms in front of you."; 
}

var Monster = Class.extend({
  init: function(level){
  	this.id = Math.random().toString().substring(2);
    this.level = level;
  }
});

var BuildMonster = function(varName, name, src, width, height, hpFunc) {
	Monsters[varName] = Monster.extend({
		init: function(level){
			this._super(level);
			this.name = name;
			this.src = src;
			this.width = width;
			this.height = height;
			this.hp = hpFunc();
		}
	})
};

var Monsters = {};
BuildMonster("DireRat", "Dire Rat", "/images/rat_dire__ryan_sumo.png", 212/4, 241/4, function() {return DiceUtils.roll(1, 10, 30).total;});
BuildMonster("OrcLeader", "Orc Leader", "/images/orc_king__eric_quigley.png", 240/1.8, 300/1.8, function() {return DiceUtils.roll(2, 10, 30).total;});
BuildMonster("FeralTroll", "Feral Troll", "/images/troll_feral__forrest_imel.png", 300/1.5, 256/1.5, function() {return DiceUtils.roll(2, 10, 60).total;});
BuildMonster("Behir", "Behir", "/images/behir__bruno_balixa_lq.png", 350/1.5, 361/1.5, function() {return DiceUtils.roll(2, 10, 80).total;});
BuildMonster("RedDragon", "Red Dragon", "/images/dragon_red__malcolm_mcclinton_nobg_lq.png", 500, 353, function() {return DiceUtils.roll(3, 10, 100).total;});
BuildMonster("WarTroll", "War Troll", "/images/troll_warrior__bruno_balixa.png", 236/1.5, 300/1.5, function() {return DiceUtils.roll(2, 10, 70).total;});
BuildMonster("Basilisk", "Basilisk", "/images/basilisk__storn_cook.png", 600/3, 346/3, function() {return DiceUtils.roll(2, 10, 50).total;});
BuildMonster("DireBat", "Dire Bat", "/images/bat_dire__nicole_cardiff.png", 300/3, 232/3, function() {return DiceUtils.roll(2, 10, 20).total;});
BuildMonster("KoboldMerc", "Kobold Mercenary", "/images/kobold_wsword__bruno_balixa.png", 139, 150, function() {return DiceUtils.roll(2, 10, 20).total;});
BuildMonster("Skeleton", "Iron Skeleton", "/images/skeleton_2__bruno_balixa.png", 277/1.8, 300/1.8, function() {return DiceUtils.roll(3, 10, 10).total;});
BuildMonster("IronGolem", "Iron Golem", "/images/golem_iron__bruno_balixa.png", 244, 300, function() {return DiceUtils.roll(3, 10, 100).total;});
BuildMonster("DireCrocodile", "Dire Crocodile", "/images/crocodile_dire__malcolm_mcclinton.png", 300/1.5, 218/1.5, function() {return DiceUtils.roll(3, 10, 40).total;});
