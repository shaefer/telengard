//Because of Class construction depends on file: inheritance.js
//Because of RollFuncBuilder depends on 
//Because of DiceUtils depends on DiceUtils.js
function GetMonster(pos) {
	var monstersForLevel = GetMonstersForDungeonLevel(Monsters, pos.z);
    var monsterKeys = Object.keys(monstersForLevel);
    var key = monsterKeys[DiceUtils.roll(1,monsterKeys.length,-1).total];
    var monsterFunc = monstersForLevel[key].constructor;
    var monsterLevel = GetMonsterLevel(pos.z);
    var monster = new monsterFunc(monsterLevel.level, monsterLevel.template);
   	if (monsterLevel.champion)
   		monster.champion = true;
   	if (monsterLevel.royalty)
   		monster.royalty = true;
    return monster;
}

function GetMonsterLevel(dungeonLevel) {
	if (dungeonLevel == 0)
		dungeonLevel = 1;
	var levelObj = {level:dungeonLevel, template:""}
	var monsterLevelRoll = d00();
    if (monsterLevelRoll.inRange(76,85)) {
    	levelObj.level += 1;
    }
    else if (monsterLevelRoll.inRange(86, 95)) {
    	levelObj.level += 2;
    }
    else if (monsterLevelRoll.inRange(91, 99)) {
    	levelObj.level += DiceUtils.roll(1, 2, 2).total;
    }
    else if (monsterLevelRoll == 100) {
    	levelObj.level += DiceUtils.roll(1,3,4).total;
    }

    if (monsterLevelRoll.inRange(91, 99)) {
    	levelObj.template = "Champion "; //TODO: Apply lesser template
    }
    else if (monsterLevelRoll == 100) {
    	levelObj.template = "King "; //TODO: Apply major template.
    }
    return levelObj;
}

function GetMonsterFoundPhrase(monsterName) {
    var digit = DiceUtils.roll(1,3).total;
    if (digit == 1)
    	return "A menacing <span class='monsterName'>" + monsterName + "</span> appears from around a corner.";
    if (digit == 2)
    	return "A vicious <span class='monsterName'>" + monsterName + "</span> is ready to attack.";
    if (digit == 3)
    	return "An impressive <span class='monsterName'>" + monsterName + "</span> looms in front of you."; 
}

var Monster = Class.extend({
  init: function(level){
  	this.id = Math.random().toString().substring(2);
  	this.level = level;
  }
});

function GetMonstersForDungeonLevel(monsters, dungeonLevel) {
	var monstersForLevel = {};
	var monsterKeys = Object.keys(monsters);
	for(var i = 0;i<monsterKeys.length;i++)
	{
		var monsterKey = monsterKeys[i];
		var monster = monsters[monsterKey];
		if (monster.minDungeonLevel <= dungeonLevel)
			monstersForLevel[monsterKey] = monster;
	}
	return monstersForLevel;
};
var Monsters = {};
var BuildMonster = function(varName, name, src, width, height, scale, minDungeonLevel, hpFunc, prowessLevel, damageLevel, specialAttack) {

	Monsters[varName] = {minDungeonLevel:minDungeonLevel, constructor:Monster.extend({
		init: function(level, template){
			this._super(level);
			if (true || !hpPerLevelFunc) {
				var levelsPastOne = level - 1;
				hpPerLevelFunc = RollFuncBuilder(levelsPastOne, 16, 4*levelsPastOne);
			}
			this.hpPerLevelFn = hpPerLevelFunc;
			this.minDungeonLevel = minDungeonLevel;
			this.src = src;
			this.width = width/scale;
			this.height = height/scale;
			this.hpFn = hpFunc;
			this.hp = hpFunc.fn() + hpPerLevelFunc.fn();
			this.maxHp = this.hp;
            this.prowessLevel = prowessLevel;
            this.prowessFn = DieLevel(prowessLevel + level - 1);
			this.prowess = this.prowessFn.fn();
			this.damageLevel = damageLevel;
			this.weaponDamageFn = DamageLevel(damageLevel + level - 1);
			this.weaponDamage = function() {
				return this.weaponDamageFn.fn();
			}
			this.template = template;
			this.creatureType = name;
			this.name = "Level " + level + " " + this.template  + this.creatureType;
			this.specialAttack = specialAttack;
		}
	})};
};

var SpecialAttack = Class.extend({
	init: function(name, damageLevelBonus, percentChance, attackFunc){
		this.name = name;
		this.damageLevelBonus = damageLevelBonus;
		this.percentChance = percentChance;
		this.attack = attackFunc;
	}
});

var AcidSpit = function() {
	return new SpecialAttack("Acid Spit", 5, 30, function(player, monster){
		var damageLevelPower = monster.damageLevel + monster.level - 1 + this.damageLevelBonus;
		var damageLevel = DamageLevel(damageLevelPower);
		damageLevel.mod += monster.level;
		console.warn('Attacking at damageLevel: ' + damageLevelPower + " which is: " + damageLevel.toDisplay())
		var damage = damageLevel.fn();
		return {
			message: "The <span class='monsterName'>" + monster.name + "</span> uses <span class='specialAttack'>" + this.name + "</span> and deals <span class='command'>" + damage + "</span> damage.",
			damage: damage
			//next is debuffing effects.
		};
	});
};

var Poison = function(name) {
	return new SpecialAttack("Poison Bite", 0, 40, function(player, monster){
		var damage = monster.weaponDamage();
		return {
			message: "The <span class='monsterName'>" + monster.name + "</span> uses its <span class='specialAttack'>" + this.name + "</span> and deals <span class='command'>" + damage + "</span> damage.",
			damage: damage,
			effect: PoisonEffect(name)
		};
	});
};

var BuildAllMonsters = function() {
	//var BuildMonster = function(varName, name, src, width, height, scale, hpFunc, prowessLevel, damageLevel, hpPerLevelFunc) {
	BuildMonster("DireBat", "Dire Bat", "/images/bat_dire__nicole_cardiff.png", 300, 232, 3, 0, RollFuncBuilder(2, 10, 20), 0, 0);
	BuildMonster("DireRat", "Dire Rat", "/images/rat_dire__ryan_sumo.png", 212, 241, 4, 0, RollFuncBuilder(1, 10, 30), 0, 0);
	BuildMonster("ShockerLizard", "Shocker Lizard", "/images/shocker_lizard__matt_bulahao.png", 150, 124, 1, 0, RollFuncBuilder(1, 10, 10), 1, 0);
	BuildMonster("SlimeCrawler", "Slime Crawler", "/images/slime_crawler.png", 200, 186, 1.5, 0, RollFuncBuilder(1, 10, 20), 0, 0);
	BuildMonster("Skeleton", "Skeleton", "/images/skeleton_2__bruno_balixa.png", 277, 300, 1.8, 0, RollFuncBuilder(2, 10, 10), 0, 0);
	BuildMonster("Ankheg", "Ankheg", "/images/ankheg__matt_bulahao.png", 300, 249, 1.5, 0, RollFuncBuilder(1, 20, 40), 1, 1, AcidSpit());
	BuildMonster("Redcap", "Redcap", "/images/redcap__bruno_balixa.png", 150, 126, 1, 0, RollFuncBuilder(1, 20, 30), 1, 1);
	BuildMonster("KoboldMerc", "Kobold Mercenary", "/images/kobold_wsword__bruno_balixa.png", 139, 150, 1, 0, RollFuncBuilder(2, 10, 20), 2, 2);
	BuildMonster("IronCobra", "Iron Cobra", "/images/iron_cobra__matt_bulahao.png", 276, 300, 2.5, 0, RollFuncBuilder(2, 10, 30), 0, 2, Poison("Iron Cobra"));
	BuildMonster("ShamblingMound", "Shambing Mound", "/images/shambling_mound__matt_bulahao.png", 296, 268, 1.2, 0, RollFuncBuilder(2, 20, 20), 0, 2);
	BuildMonster("FeralTroll", "Feral Troll", "/images/troll_feral__forrest_imel.png", 300, 256, 1.5, 0, RollFuncBuilder(2, 10, 40), 2, 3);
	BuildMonster("Coautl", "Coautl", "/images/coautl__tadas_sidlauskas.png", 300, 300, 1.5, 0, RollFuncBuilder(1, 20, 50), 1, 2);
	BuildMonster("Djinn", "Djinn", "/images/genie_djinn__simon_buckroyd.png", 215, 300, 1.5, 0, RollFuncBuilder(1, 20, 50), 2, 2);
	BuildMonster("GoblinDog", "Goblin Dog", "/images/goblin_dog__matt_bulahao.png", 300, 256, 2, 0, RollFuncBuilder(1, 20, 20), 1, 1);

	BuildMonster("Choker", "Choker", "/images/choker_bruno_balixa.png", 262, 300, 2, 1, RollFuncBuilder(1, 20, 50), 1, 0);
	BuildMonster("Shoggoth", "Shoggoth", "/images/shoggoth__matt_bulahao.png", 300, 250, 1.5, 1, RollFuncBuilder(1, 20, 60), 0, 3);
	BuildMonster("Otyugh", "Otyugh", "/images/otyugh__bruno_balixa.png", 291, 300, 1.5, 1, RollFuncBuilder(1, 20, 60), 0, 2);
	BuildMonster("Lamia", "Lamia", "/images/lamia__bruno_balixa.png", 291, 300, 1.5, 1, RollFuncBuilder(1, 20, 60), 2, 2);
	BuildMonster("SkeletalMage", "Skeletal Mage", "/images/skeleton_halfling__nicole_cardiff.png", 237, 300, 2, 1, RollFuncBuilder(1, 20, 60), 0, 1);
	BuildMonster("DireTiger", "Dire Tiger", "/images/tiger_dire__felipe_gaona.png", 200, 217, 1, 1, RollFuncBuilder(1, 20, 60), 1, 3);
	BuildMonster("Wyvern", "Wyvern", "/images/wyvern__eric_quigley.png", 300, 277, 1, 1, RollFuncBuilder(1, 20, 60), 1, 3);
	BuildMonster("DireHyena", "Dire Hyena", "/images/hyena_dire__matt_bulahao.png", 300, 232, 1.5, 1, RollFuncBuilder(1, 20, 60), 2, 2);

	BuildMonster("Girallon", "Girallon", "/images/girallon__eric_quigley.png", 240, 300, 1, 2, RollFuncBuilder(2, 10, 50), 1, 4);
	BuildMonster("DireCrocodile", "Dire Crocodile", "/images/crocodile_dire__malcolm_mcclinton.png", 300, 218, 1.5, 2, RollFuncBuilder(3, 10, 40), 0, 3);
	BuildMonster("Cyclops", "Cyclops", "/images/cyclops__bruno_balixa.png", 182, 300, 1, 2, RollFuncBuilder(2, 10, 50), 1, 2);
	BuildMonster("Unicorn", "Unicorn", "/images/unicorn__jeff_ward.png", 270, 300, 1.5, 2, RollFuncBuilder(3, 10, 40), 2, 3);
	BuildMonster("KoboldLeader", "Kobold Leader", "/images/kobold_leader__bruno_balixa.png", 139, 150, 1, 2, RollFuncBuilder(2, 20, 20), 3, 2);
	BuildMonster("GiantFlytrap", "Giant Flytrap", "/images/flytrap_giant__jacqui_davis.png", 194, 300, 1.5, 2, RollFuncBuilder(1, 20, 30), 0, 2);

	BuildMonster("DireLion", "Dire Lion", "/images/lion_dire__eric_quigley.png", 300, 226, 1.5, 4, RollFuncBuilder(1, 20, 70), 0, 4);
	BuildMonster("DarkNaga", "Dark Naga", "/images/naga_dark__felipe_gaona.png", 232, 300, 1.2, 4, RollFuncBuilder(3, 10, 60), 1, 1);
	BuildMonster("Chuul", "Chuul", "/images/chuul__tadas_sidlauskas.png", 300, 245, 1.2, 4, RollFuncBuilder(3, 10, 60), 1, 3);
	BuildMonster("Cloaker", "Cloaker", "/images/cloaker__adam_schmidt.png", 300, 282, 1.2, 4, RollFuncBuilder(3, 10, 60), 3, 1);
	BuildMonster("Salamander", "Salamander", "/images/salamander__simon_buckroyd.png", 293, 300, 1.2, 4, RollFuncBuilder(3, 10, 60), 2, 2);

	BuildMonster("SpiritNaga", "Spirit Naga", "/images/naga_spirit__matt_bulahao.png", 221, 300, 1, 6, RollFuncBuilder(3, 10, 50), 3, 1);
	BuildMonster("Basilisk", "Basilisk", "/images/basilisk__storn_cook.png", 600, 346, 3, 6, RollFuncBuilder(2, 10, 50), 1, 1);
	BuildMonster("OrcLeader", "Orc Leader", "/images/orc_king__eric_quigley.png", 240, 300, 1.8, 6, RollFuncBuilder(4, 10, 30), 2, 2);
	BuildMonster("WarTroll", "War Troll", "/images/troll_warrior__bruno_balixa.png", 236, 300, 1.5, 6, RollFuncBuilder(2, 10, 70), 2, 3);
	BuildMonster("IceGolem", "Ice Golem", "/images/golem_ice__malcolm_mcclinton.png", 237, 300, 1, 6, RollFuncBuilder(1, 20, 80), 0, 2);
	BuildMonster("GreenDragon", "Green Dragon", "images/dragon_green__eric_quigley.png", 300, 231, 1, 6, RollFuncBuilder(3,10,70), 3, 2);
	BuildMonster("Bulette", "Bulette", "images/bulette__ian_maclean.png", 300, 232, 1.2, 6, RollFuncBuilder(2,10,60), 1, 4);

	BuildMonster("Froghemoth", "Froghemoth", "/images/froghemoth__eric_quigley.png", 300, 300, 1, 8, RollFuncBuilder(3, 10, 90), 0, 4);
	BuildMonster("Gorgon", "Gorgon", "/images/gorgon__tadas_sidlauskas.png", 300, 253, 1, 8, RollFuncBuilder(3, 20, 80), 0, 3);
	BuildMonster("Hydra", "Hydra", "/images/hydra__jacqui_davis.png", 194, 300, 1, 8, RollFuncBuilder(1, 10, 60), 0, 4);
	BuildMonster("FleshGolem", "Flesh Golem", "/images/golem_flesh__matt_bulahao.png", 226, 300, 1.5, 8, RollFuncBuilder(1, 20, 70), 0, 3);
	BuildMonster("BlueDragon", "Blue Dragon", "images/dragon_blue__nicole_cardiff.png", 300, 192, 1, 8, RollFuncBuilder(3, 10, 70), 3, 2);

	BuildMonster("EarthElemental", "Earth Elemental", "/images/elemental_earth_wtrees__ryan_sumo.png", 274, 300, 1, 10, RollFuncBuilder(1, 20, 100), 0, 2);
	BuildMonster("AirElemental", "Air Elemental", "/images/elemental_air__david_rabbitte_nobg.png", 250, 300, 1, 10, RollFuncBuilder(1, 20, 80), 0, 2);
	BuildMonster("EyeOfTheDeep", "Eye of the Deep", "/images/eye_of_the_deep_nobg__eric_quigley.png", 215, 300, 1, 10, RollFuncBuilder(2, 10, 90), 3, 3);
	BuildMonster("BlackDragon", "Black Dragon", "/images/dragon_black__forrest_imel.png", 300, 200, 1, 10, RollFuncBuilder(3, 10, 90), 4, 2);

	BuildMonster("DragonTurtle", "Dragon Turtle", "/images/dragon_turtle__eric_quigley.png", 411, 300, 1, 12, RollFuncBuilder(2, 10, 110), 1, 4);
	BuildMonster("IronGolem", "Iron Golem", "/images/golem_iron__bruno_balixa.png", 244, 300, 1, 12, RollFuncBuilder(3, 10, 100), 1, 3);
	BuildMonster("SkeletalDragon", "Skeletal Dragon", "/images/dragon_skeletal__bruno_balixa.png", 300, 225, 0.5, 12, RollFuncBuilder(2, 20, 85), 0, 4);
	BuildMonster("Behir", "Behir", "/images/behir__bruno_balixa_lq.png", 350, 361, 1.5, 12, RollFuncBuilder(2, 10, 80), 0, 4);
	BuildMonster("RedDragon", "Red Dragon", "/images/dragon_red__malcolm_mcclinton_nobg_lq.png", 500, 353, 1, 12, RollFuncBuilder(3, 10, 100), 4, 4);

}
