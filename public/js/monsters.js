function GetMonster() {
    var roll = DiceUtils.d10().total - 1;
    if (roll <= 0)
        return new Dragon();
    if (roll > 0 && roll <= 1)
        return new Behir();
    if (roll > 1 && roll <= 3)
    	return new TrollFeral();
    if (roll > 3 && roll <= 5)
    	return new TrollWarrior();
    if (roll > 5 && roll <= 7)
    	return new DireRat();
    if (roll > 7 && roll <= 9)
    	return new Basilisk();
}

function GetMonsterFoundPhrase(monsterName) {
	Math.seedrandom(new Date().getTime());
    var id = Math.random().toString().substring(2);
    var digit = Number(id.toString().substring(0, 1));
    if (digit <= 3)
    	return "A menacing " + monsterName + " appears from around a corner.";
    if (digit > 3 && digit <= 6)
    	return "A vicious " + monsterName + " is ready to attack.";
    if (digit > 6)
    	return "An impressive " + monsterName + " looms in front of you."; 
}

function Dragon() {
	Math.seedrandom(new Date().getTime());
    var id = Math.random().toString().substring(2);
	this.id = id;
    this.name = "Red Dragon";
    this.src = "/images/dragon_red__malcolm_mcclinton_nobg_lq.png";
    this.width = 500;
    this.height = 353;
    var r = 2;
    this.hp = 100 + GetIdChar(id, r++) + GetIdChar(id, r++) + GetIdChar(id, r++);
};

function Behir() {
	Math.seedrandom(new Date().getTime());
    var id = Math.random().toString().substring(2);
	this.id = id;
    this.name = "Behir";
    this.src = "/images/behir__bruno_balixa_lq.png";
    this.width = 350;
    this.height = 361;
    var r = 2;
    this.hp = 80 + GetIdChar(id, r++) + GetIdChar(id, r++);
}

function TrollFeral() {
	Math.seedrandom(new Date().getTime());
    var id = Math.random().toString().substring(2);
	this.id = id;
    this.name = "Feral Troll";
    this.src = "/images/troll_feral__forrest_imel.png";
    this.width = 300;
    this.height = 256;
    var r = 2;
    this.hp = 60 + GetIdChar(id, r++) + GetIdChar(id, r++);
}

function TrollWarrior() {
	Math.seedrandom(new Date().getTime());
    var id = Math.random().toString().substring(2);
	this.id = id;
    this.name = "War Troll";
    this.src = "/images/troll_warrior__bruno_balixa.png";
    this.width = 236;
    this.height = 300;
    var r = 2;
    this.hp = 70 + GetIdChar(id, r++) + GetIdChar(id, r++);
}

function DireRat() {
	Math.seedrandom(new Date().getTime());
    var id = Math.random().toString().substring(2);
	this.id = id;
    this.name = "Dire Rat";
    this.src = "/images/rat_dire__ryan_sumo.png";
    this.width = 212;
    this.height = 241;
    var r = 2;
    this.hp = 30 + GetIdChar(id, r++);
}

function Basilisk() {
	Math.seedrandom(new Date().getTime());
    var id = Math.random().toString().substring(2);
	this.id = id;
    this.name = "Basilisk";
    this.src = "/images/basilisk__storn_cook.png";
    this.width = 600;
    this.height = 346;
    var r = 2;
    this.hp = 50 + GetIdChar(id, r++) + GetIdChar(id, r++);
}