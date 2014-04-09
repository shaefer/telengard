function PlayerCharacter() {
	Math.seedrandom(new Date().getTime());
    var rand = Math.random().toString().substring(2);
    this.id = rand;
    this.hp = 20 + Number(rand.toString().substring(0, 1));
    this.strength = 10 + (Number(rand.toString().substring(1, 2))/2);
}
PlayerCharacter.prototype.toString = function() {
	return "HP: " + this.hp + " STR: " + this.strength + " ID: " + this.id;
}