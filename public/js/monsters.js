function GetMonster(pos) {
    var roll = DiceUtils.roll(2, 6, -2).total 
    var level0 = ["Behir", "TrollWarrior", "Basilisk", "KoboldMerc", "DireBat", "DireRat", "Skeleton", "OrcLeader", "DireCrocodile", "IronGolem", "Dragon"];
    //TrollFeral currently unused.
    var monsterName = level0[roll]
    var monsterFunc = window[monsterName];
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
 
var Dragon = Monster.extend({
  init: function(level){
    this._super( level );
    this.name = "Red Dragon";
    this.src = "/images/dragon_red__malcolm_mcclinton_nobg_lq.png";
    this.width = 500;
    this.height = 353;
    this.hp = DiceUtils.roll(3, 10, 100).total;
  }
});

var Behir = Monster.extend({
  init: function(level){
    this._super( level );
    this.name = "Behir";
    this.src = "/images/behir__bruno_balixa_lq.png";
    this.width = 350/1.5;
    this.height = 361/1.5;
    this.hp = DiceUtils.roll(2, 10, 80).total;
  }
});

var TrollFeral = Monster.extend({
  init: function(level){
    this._super( level );
	this.name = "Feral Troll";
    this.src = "/images/troll_feral__forrest_imel.png";
    this.width = 300/1.5;
    this.height = 256/1.5;
    this.hp = DiceUtils.roll(2, 10, 60).total;
  }
});

var TrollWarrior = Monster.extend({
  init: function(level){
    this._super( level );
    this.name = "War Troll";
    this.src = "/images/troll_warrior__bruno_balixa.png";
    this.width = 236/1.5;
    this.height = 300/1.5;
    this.hp = DiceUtils.roll(2, 10, 70).total;
  }
});

var DireRat = Monster.extend({
  init: function(level){
    this._super( level );
    this.name = "Dire Rat";
    this.src = "/images/rat_dire__ryan_sumo.png";
    this.width = 212/4;
    this.height = 241/4;
    this.hp = DiceUtils.roll(1, 10, 30).total;
  }
});

var Basilisk = Monster.extend({
  init: function(level){
    this._super( level );
    this.name = "Basilisk";
    this.src = "/images/basilisk__storn_cook.png";
    this.width = 600/3;
    this.height = 346/3;
    this.hp = DiceUtils.roll(2, 10, 50).total;
  }
});

var DireBat = Monster.extend({
  init: function(level){
    this._super( level );
    this.name = "Dire Bat";
    this.src = "/images/bat_dire__nicole_cardiff.png";
    this.width = 300/3;
    this.height = 232/3;
    this.hp = DiceUtils.roll(2, 10, 20).total;
  }
});

var KoboldMerc = Monster.extend({
  init: function(level){
    this._super( level );
    this.name = "Kobold Mercenary";
    this.src = "/images/kobold_wsword__bruno_balixa.png";
    this.width = 139;
    this.height = 150;
    this.hp = DiceUtils.roll(2, 10, 20).total;
  }
});

var Skeleton = Monster.extend({
  init: function(level){
    this._super( level );
    this.name = "Skeleton";
    this.src = "/images/skeleton_2__bruno_balixa.png";
    this.width = 277/1.8;
    this.height = 300/1.8;
    this.hp = DiceUtils.roll(3, 10, 10).total;
  }
});

var IronGolem = Monster.extend({
  init: function(level){
    this._super( level );
    this.name = "Iron Golem";
    this.src = "/images/golem_iron__bruno_balixa.png";
    this.width = 244;
    this.height = 300;
    this.hp = DiceUtils.roll(3, 10, 100).total;
  }
});

var DireCrocodile = Monster.extend({
  init: function(level){
    this._super( level );
    this.name = "Dire Crocodile";
    this.src = "/images/crocodile_dire__malcolm_mcclinton.png";
    this.width = 300/1.5;
    this.height = 218/1.5;
    this.hp = DiceUtils.roll(3, 10, 40).total;
  }
});

var OrcLeader = Monster.extend({
  init: function(level){
    this._super( level );
    this.name = "Orc Leader";
    this.src = "/images/orc_king__eric_quigley.png";
    this.width = 240/1.8;
    this.height = 300/1.8;
    this.hp = DiceUtils.roll(2, 10, 30).total;
  }
});