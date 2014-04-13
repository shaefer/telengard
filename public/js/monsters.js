function GetMonster(pos) {
    var roll = DiceUtils.roll(2, 11, -2).total;
    console.debug("Monster roll: " + roll);
    var level0 = [Monsters.Behir, 
    				Monsters.Froghemoth, 
    				Monsters.Gorgon,
    					Monsters.WarTroll, 
    						Monsters.Basilisk, 
    						Monsters.Unicorn,
    							Monsters.Chuul,
    							Monsters.DarkNaga,
    								Monsters.KoboldMerc,
    								Monsters.DireBat, 
    									Monsters.DireRat, 
    			 					Monsters.Skeleton, 
    			 					Monsters.OrcLeader, 
    			 				Monsters.DireCrocodile, 
    			 				Monsters.IronCobra,
    			 			Monsters.FeralTroll,
    			 			Monsters.ShamblingMound,
    			 		Monsters.Cyclops,
    			 	Monsters.IronGolem, 
    			 	Monsters.SkeletalDragon,
    			 Monsters.RedDragon];
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

var BuildMonster = function(varName, name, src, width, height, scale, hpFunc) {
	Monsters[varName] = Monster.extend({
		init: function(level){
			this._super(level);
			this.name = name;
			this.src = src;
			this.width = width/scale;
			this.height = height/scale;
			this.hp = hpFunc();
		}
	})
};

var HpFuncBuilder = function(num, sides, mod) {
	return function() {return DiceUtils.roll(num, sides, mod).total;};
};

var Monsters = {};
BuildMonster("DireRat", "Dire Rat", "/images/rat_dire__ryan_sumo.png", 212, 241, 4, HpFuncBuilder(1, 10, 30));
BuildMonster("OrcLeader", "Orc Leader", "/images/orc_king__eric_quigley.png", 240, 300, 1.8, HpFuncBuilder(2, 10, 30));
BuildMonster("FeralTroll", "Feral Troll", "/images/troll_feral__forrest_imel.png", 300, 256, 1.5, HpFuncBuilder(2, 10, 60));
BuildMonster("Behir", "Behir", "/images/behir__bruno_balixa_lq.png", 350, 361, 1.5, HpFuncBuilder(2, 10, 80));
BuildMonster("RedDragon", "Red Dragon", "/images/dragon_red__malcolm_mcclinton_nobg_lq.png", 500, 353, 1, HpFuncBuilder(3, 10, 100));

BuildMonster("WarTroll", "War Troll", "/images/troll_warrior__bruno_balixa.png", 236, 300, 1.5, HpFuncBuilder(2, 10, 70));
BuildMonster("Basilisk", "Basilisk", "/images/basilisk__storn_cook.png", 600, 346, 3, HpFuncBuilder(2, 10, 50));
BuildMonster("DireBat", "Dire Bat", "/images/bat_dire__nicole_cardiff.png", 300, 232, 3, HpFuncBuilder(2, 10, 20));
BuildMonster("KoboldMerc", "Kobold Mercenary", "/images/kobold_wsword__bruno_balixa.png", 139, 150, 1, HpFuncBuilder(2, 10, 20));
BuildMonster("Skeleton", "Iron Skeleton", "/images/skeleton_2__bruno_balixa.png", 277, 300, 1.8, HpFuncBuilder(3, 10, 10));

BuildMonster("IronGolem", "Iron Golem", "/images/golem_iron__bruno_balixa.png", 244, 300, 1, HpFuncBuilder(3, 10, 100));
BuildMonster("DireCrocodile", "Dire Crocodile", "/images/crocodile_dire__malcolm_mcclinton.png", 300, 218, 1.5, HpFuncBuilder(3, 10, 40));
BuildMonster("Froghemoth", "Froghemoth", "/images/froghemoth__eric_quigley.png", 300, 300, 1, HpFuncBuilder(3, 10, 90));
BuildMonster("Cyclops", "Cyclops", "/images/cyclops__bruno_balixa.png", 182, 300, 1, HpFuncBuilder(2, 10, 50));
BuildMonster("DarkNaga", "Dark Naga", "/images/naga_dark__felipe_gaona.png", 232, 300, 1.2, HpFuncBuilder(3, 10, 60));

BuildMonster("Chuul", "Chuul", "/images/chuul__tadas_sidlauskas.png", 300, 245, 1.2, HpFuncBuilder(3, 10, 60));
BuildMonster("Cloaker", "Cloaker", "/images/cloaker__adam_schmidt.png", 300, 282, 1.2, HpFuncBuilder(3, 10, 60));
BuildMonster("IronCobra", "Iron Cobra", "/images/iron_cobra__matt_bulahao.png", 276, 300, 2.5, HpFuncBuilder(3, 10, 30));
BuildMonster("SkeletalDragon", "Skeletal Dragon", "/images/dragon_skeletal__bruno_balixa.png", 300, 225, 0.5, HpFuncBuilder(2, 20, 85));
BuildMonster("ShamblingMound", "Shambing Mound", "/images/shambling_mound__matt_bulahao.png", 296, 268, 1.2, HpFuncBuilder(2, 20, 20));

BuildMonster("Gorgon", "Gorgon", "/images/gorgon__tadas_sidlauskas.png", 300, 253, 1, HpFuncBuilder(3, 20, 80));


BuildMonster("Unicorn", "Unicorn", "/images/unicorn__jeff_ward.png", 270, 300, 1.5, HpFuncBuilder(3, 10, 40));
BuildMonster("Ankheg", "Ankheg", "/images/ankheg__matt_bulahao.png", 300, 249, 1.5, HpFuncBuilder(1, 20, 40));
BuildMonster("Coautl", "Coautl", "/images/coautl__tadas_sidlauskas.png", 300, 300, 1.5, HpFuncBuilder(1, 20, 60));
BuildMonster("Djinn", "Djinn", "/images/genie_djinn__simon_buckroyd.png", 215, 300, 1.5, HpFuncBuilder(2, 20, 50));
BuildMonster("SlimeCrawler", "Slime Crawler", "/images/slime_crawler.png", 200, 186, 1.5, HpFuncBuilder(1, 10, 20));
BuildMonster("ShockerLizard", "Shocker Lizard", "/images/shocker_lizard__matt_bulahao.png", 150, 124, 1, HpFuncBuilder(1, 10, 10));
BuildMonster("Girallon", "Girallon", "/images/girallon__eric_quigley.png", 240, 300, 1, HpFuncBuilder(2, 10, 50));

BuildMonster("Wyvern", "Wyvern", "/images/wyvern__eric_quigley.png", 300, 277, 1, HpFuncBuilder(1, 20, 60));
BuildMonster("Hydra", "Hydra", "/images/hydra__jacqui_davis.png", 194, 300, 1, HpFuncBuilder(1, 10, 60));
BuildMonster("IceGolem", "Ice Golem", "/images/golem_ice__malcolm_mcclinton.png", 237, 300, 1, HpFuncBuilder(1, 20, 80));
BuildMonster("Redcap", "Redcap", "/images/redcap__bruno_balixa.png", 150, 126, 1, HpFuncBuilder(1, 20, 30));
BuildMonster("Shoggoth", "Shoggoth", "/images/shoggoth__matt_bulahao.png", 300, 250, 1.5, HpFuncBuilder(1, 20, 60));

BuildMonster("Otyugh", "Otyugh", "/images/otyugh__bruno_balixa.png", 291, 300, 1.5, HpFuncBuilder(1, 20, 60));
BuildMonster("Lamia", "Lamia", "/images/lamia__bruno_balixa.png", 291, 300, 1.5, HpFuncBuilder(1, 20, 60));
BuildMonster("SkeletalMage", "Skeletal Mage", "/images/skeleton_halfling__nicole_cardiff.png", 237, 300, 2, HpFuncBuilder(1, 20, 60));
BuildMonster("DireTiger", "Dire Tiger", "/images/tiger_dire__felipe_gaona.png", 200, 217, 1, HpFuncBuilder(1, 20, 60));
BuildMonster("FleshGolem", "Flesh Golem", "/images/golem_flesh__matt_bulahao.png", 226, 300, 1.5, HpFuncBuilder(1, 20, 70));

BuildMonster("DireLion", "Dire Lion", "/images/lion_dire__eric_quigley.png", 300, 226, 1.5, HpFuncBuilder(1, 20, 70));
BuildMonster("KoboldLeader", "Kobold Leader", "/images/kobold_leader__bruno_balixa.png", 139, 150, 1, HpFuncBuilder(2, 20, 20));
BuildMonster("GiantFlytrap", "Giant Flytrap", "/images/flytrap_giant__jacqui_davis.png", 194, 300, 1.5, HpFuncBuilder(1, 20, 30));

BuildMonster("EarthElemental", "Earth Elemental", "/images/elemental_earth_wtrees__ryan_sumo.png", 274, 300, 1, HpFuncBuilder(1, 20, 100));
BuildMonster("AirElemental", "Air Elemental", "/images/elemental_air__david_rabbitte_nobg.png", 250, 300, 1, HpFuncBuilder(1, 20, 80));
