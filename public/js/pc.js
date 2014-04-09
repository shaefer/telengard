function PlayerCharacter() {
	Math.seedrandom(new Date().getTime());
    var rand = Math.random().toString().substring(2);
    this.id = rand;

    this.hp = 20 + Number(rand.toString().substring(0, 1));
    this.mp = 5 + (Number(rand.toString().substring(5, 6))/2);

    this.strength = 10 + (Number(rand.toString().substring(1, 2))/2);
    this.intelligence = 10 + (Number(rand.toString().substring(2, 3))/2);
    this.luck = 10 + (Number(rand.toString().substring(3, 4))/2);
    this.prowess = 10 + (Number(rand.toString().substring(4, 5))/2);

    this.exp = 0;
}
PlayerCharacter.prototype.toString = function() {
	return "HP: " + this.hp + " STR: " + this.strength + " ID: " + this.id;
}