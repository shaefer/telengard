function Dragon(id) {
	this.id = id;
    this.name = "Red Dragon";
    this.src = "/images/dragon_red__malcolm_mcclinton_nobg_lq.png";
    this.width = 500;
    this.height = 353;
    //0,1 pair used to determine monster type.
    this.hp = 100 + Number(id.toString().substring(2, 3)) + Number(id.toString().substring(3, 4)) + Number(id.toString().substring(4, 5));
};
Dragon.prototype.toString = function() {
	return "HP: " + this.hp + " ID: " + this.id;
}

function Behir(id) {
	this.id = id;
    this.name = "Behir";
    this.src = "/images/behir__bruno_balixa_lq.png";
    this.width = 350;
    this.height = 361;

    //0,1 pair used to determine monster type.
    this.hp = 80 + Number(id.toString().substring(2, 3)) + Number(id.toString().substring(3, 4));
}
Behir.prototype.toString = function() {
	return "HP: " + this.hp + " ID: " + this.id;
}