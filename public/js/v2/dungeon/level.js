/**
 * A DungeonLevel is the representation of the floor. It is made up by a series of rooms 
 * procedurally generated from their x,y,z coordinates.
 * 
 * we will use this id to represent all other "state" associated with this DungeonLevel. 
 * So for instance if this floor's type is lava that would be derived from the id. 
 * @param {*} z 
 */
function DungeonLevel(z) {
    if (!isNumber(z)) throw "cannot create dungeon from a non-number"
    const rnd = new Math.seedrandom(z);
    this.id = rnd().toString().substring(2); //random number is always between 0 and 1 so 0.someting means we strip off the "0."
    this.floor = z;
    this.floorWidth = 15; //fixed for now. Odd numbers allow for an exact center of the floor.
    this.floorHeight = 15;
}