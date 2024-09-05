function RoomKey(x,y,z) {
    return x + "-" + y + "-" + z;
}

/**
 * DungeonRooms are derived from their xyz coordinates.
 * There are 16 digits to use to derive state. 
 * Other referenced Objects: DungeonLevel, Wall, Vertex
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
function DungeonRoom(x, y, z, startingRoom = true) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.roomKey = RoomKey(x,y,z);
    const rnd = new Math.seedrandom("theoden"+x.toString() + y.toString() + z.toString());
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

    this.oob = (x < 0 || y < 0 || x > DungeonLevelMaxWidth - 1 || y > DungeonLevelMaxHeight - 1);

    let lowerRoom = false;
    if (startingRoom)
        lowerRoom = new DungeonRoom(x, y, z+1, false); //prevent recursion of having each room check the room below it forever...


    const mutuallyExclusiveFeatures = GetIdCharPair(this.id, 2);
    this.featureId = mutuallyExclusiveFeatures;
    this.inn = mutuallyExclusiveFeatures <= 1 && !lowerRoom.stairsUp; //@15x15 there are 225 rooms @5% you will have 11.25 inns. 17 with the base seed. at 3% we go down to 9. 
    this.throne = mutuallyExclusiveFeatures > 1 && mutuallyExclusiveFeatures <= 2 && !lowerRoom.stairsUp//1%
    this.fountain = mutuallyExclusiveFeatures > 2 && mutuallyExclusiveFeatures <= 3 && !lowerRoom.stairsUp//1%
    this.stairsDown = (mutuallyExclusiveFeatures > 3 && mutuallyExclusiveFeatures <= 4) || lowerRoom.stairsUp //1%
    this.stairsUp = mutuallyExclusiveFeatures > 4 && mutuallyExclusiveFeatures <= 5 && z != 0 && !lowerRoom.stairsUp//1%

    this.hasFeature = this.inn || this.throne || this.fountain || this.stairsDown || this.stairsUp;
    //TODO: Stairs down likely should be a special rnd number shared between this room and the room below seed of this room + lower room.
    //check the room below to see if there are stairs up.



//Wall Objects
    //doors & one-way doors & fancy door/puzzle door

//Z Objects
    //stairs down/up or elevator or pit (z level connector)

//Room Objects
    //inn
    //throne
    //fountain
    //teleporter
    //button puzzle
    
    //coffin/tomb

    //for mutually exclusive rare items we can pull 2 digits and get 1-100 but handle multiple objects.
    //for everything else we can pull a single digit and have 10% increment likelihood to find it.
    //Is everything mutually exclusive...do we really want more than 1 item per location?
    //maybe not just items but also features of the room....cold, or stone or magic
}

//nsew, none, ns, ew, ne, nw, se, sw, nse, nsw, ews, ewn, e, w, s, n 15 options