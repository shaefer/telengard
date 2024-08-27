/**
 * DungeonRooms are derived from their xyz coordinates.
 * There are 16 digits to use to derive state. 
 * Other referenced Objects: DungeonLevel, Wall, Vertex
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
function DungeonRoom(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    const rnd = new Math.seedrandom(x.toString() + y.toString() + z.toString());
    this.id = rnd().toString().substring(2); //random number is always between 0 and 1 so 0.someting means we strip off the "0."
    this.nwVertex = new Vertex(this.x, this.y, this.z);
    this.neVertex = new Vertex(this.x + 1, this.y, this.z);
    this.seVertex = new Vertex(this.x + 1, this.y + 1, this.z);
    this.swVertex = new Vertex(this.x, this.y + 1, this.z);

    const currentDungeonLevel = new DungeonLevel(z);
    const DungeonLevelMaxWidth = currentDungeonLevel.floorWidth;
    const DungeonLevelMaxHeight = currentDungeonLevel.floorHeight;

    /**
     * By using vertices to create walls the seed for their ids is the same regardless of what room asks for them...
     * since each wall is shared between rooms we need a consistent seed to generate from.
     */
    this.northWall = new Wall(this.nwVertex, this.neVertex);
    if (this.nwVertex.y == 0) this.northWall.wallExists = true; // north wall borders top of dungeon
    this.southWall = new Wall(this.swVertex, this.seVertex);
    if (this.swVertex.y == DungeonLevelMaxHeight) this.southWall.wallExists = true;
    this.eastWall = new Wall(this.neVertex, this.seVertex);
    if (this.neVertex.x == DungeonLevelMaxWidth) this.eastWall.wallExists = true;
    this.westWall = new Wall(this.nwVertex, this.swVertex);
    if (this.nwVertex.x == 0) this.westWall.wallExists = true; //west wall borders beginning of dungeon.

    if (x < 0 || y < 0 || x > DungeonLevelMaxWidth - 1 || y > DungeonLevelMaxHeight - 1) {
        this.oob = true;
    } else {
        this.oob = false;
    }
}

//nsew, none, ns, ew, ne, nw, se, sw, nse, nsw, ews, ewn, e, w, s, n 15 options