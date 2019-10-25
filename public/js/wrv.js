//http://pcg.wikidot.com/pcg-algorithm:dungeon-generation
//http://pcg.wdfiles.com/local--files/pcg-algorithm%3Amaze/growingtree.py

function Position(x,y,z) {
    this.x = x;
    this.y = y;
    this.z = z;
}
Position.prototype.toString = function() {
    return "(" + this.x + ", " + this.y + ", " + this.z + ")"; 
}

function Vertex(x,y,z) {
    this.x = x;
    this.y = y;
    this.z = z
    this.id = x.toString() + y.toString() + z.toString();
};
Vertex.prototype.toString = function () {
    return "(" + this.x + ", " + this.y + ", " + this.z + "; Vid:" + this.id + ")";
};

function Wall(vertex1, vertex2) {
    this.vertex1 = vertex1;
    this.vertex2 = vertex2;
    Math.seedrandom(this.vertex1.toString() + this.vertex2.toString());
    this.id = Math.random().toString().substring(2);
};
Wall.prototype.toString = function () {
    return "(" + this.vertex1.toString() + ", " + this.vertex2.toString() + "; WallId: " + this.id + ")";
};
Wall.prototype.hasWall = function () {
    var firstChar = Number(this.id.toString().substring(0, 1))
    //console.debug(firstChar)
    return firstChar > 6
};

function DungeonLevel(z) {
    if (!isNumber(z)) throw "cannot create dungeon from a non-number"
    Math.seedrandom(z);
    this.id = Math.random().toString().substring(2); //random number is always between 0 and 1 so 0.someting means we strip off the 0.
    this.depth = z;
    var firstChar = Number(this.id.toString().substring(0, 1)); //currently we don't have any dungeon level setting except size which we aren't really using.
    if (firstChar >= 0 && firstChar <=9) {
        this.width = 50;
        this.height = 50;
    }
    else {
        //TODO: Handling levels of different sizes means handling mismatched layering and offsets of levels. We can do this, but the logic for stairs will need to take it into account.
        this.width = 100; 
        this.height = 100;
    }
}
function InRoom(room, pos) {
    return room.x == pos.x && room.y == pos.y && room.z == pos.z;
}
function GetRoom(pos) {
    return new Room(pos.x, pos.y, pos.z);
}
function Room(x,y,z) {
    this.x = x;
    this.y = y;
    this.z = z;
    Math.seedrandom(x.toString() + y.toString() + z.toString());
    this.id = Math.random().toString().substring(2); //strip 0. off the random num. This leaves 16 random digits! This means 8 pairs. If we use the pairs cleverly we should make any pair of 2 together...so 0,1 and 1,2 are both different pairs even though the 1 is reused it should only matter if our expected percentile roll checks match. This means we could control when there is forced overlap of feature triggers. If the first pair expects a roll of 78 then we make sure the expected roll for the 2nd pair is not 80 something.
    //First 2 digits are the inn, 2nd two are the stairs down, 4-6 are deepinn. We should be able to pull a just single extra to use instead of burned 3 more.
    this.onMap = function() { 
        var dungeonLevel = new DungeonLevel(this.z);
        return this.x >= 0 && this.y >= 0 && this.x <= dungeonLevel.width - 1 && this.y <= dungeonLevel.height - 1;
    }
    this.hasInn = function() {
        if (z <= 5) { 
            var innChar = GetIdCharPair(this.id, 0); //0-1
            return innChar == 78; //basically 1% chance of inn if the floor is level 1-5.
        } else {
            var deepInnChar = GetIdCharTriple(this.id, 4); //used 4-6
            console.warn("Chance of Inn on low level: " + deepInnChar + " id: " + this.id)
            return deepInnChar >= 101 && deepInnChar <= 150; // 0.5% chance 50/1000 
        }
    };
    this.inn = function() {
        if (!this.hasInn()) return null;
        return new Inn(this.id);
    };
    this.hasStairsDown = function() {
        var stairs = GetIdCharPair(this.id, 2); //2-3
        return stairs == 77; //TODO: Make sure we can't end up with both inn and stairs. This is a problem if we use different pairs for different things.
    };
    this.hasStairsUp = function() {
        if (this.z == 0) return false;
        var upperDungeonRoom = new Room(this.x, this.y, this.z - 1);
        return upperDungeonRoom.hasStairsDown();
    };
    this.hasAnyFeature = function() {
        return this.hasInn() || this.hasStairsDown() || this.hasStairsUp();
    };
    this.getPosition = function() {
        return new Position(this.x, this.y, this.z);
    };
    this.nwVertex = function () {
        return new Vertex(this.x, this.y, this.z);
    };
    this.neVertex = function () {
        return new Vertex(this.x + 1, this.y, this.z);
    };
    this.seVertex = function () {
        return new Vertex(this.x + 1, this.y + 1, this.z);
    };
    this.swVertex = function () {
        return new Vertex(this.x, this.y + 1, this.z);
    };
    this.getNorthWall = function () {
        return new Wall(this.nwVertex(), this.neVertex());
    }
    this.getEastWall = function () {
        return new Wall(this.neVertex(), this.seVertex());
    }
    this.getSouthWall = function () {
        return new Wall(this.swVertex(), this.seVertex());
    }
    this.getWestWall = function () {
        return new Wall(this.nwVertex(), this.swVertex());
    }
    this.getWestLimit = function() {
        //if we start to use offset positionj it will change this to be slightly more complicated.
        return this.x == 0;
    }
    this.getNorthLimit = function() {
        return this.y == 0
    }
    this.getEastLimit = function() {
        var dungeonLevel = new DungeonLevel(this.z);
        return this.x == dungeonLevel.width - 1;
    }
    this.getSouthLimit = function() {
        var dungeonLevel = new DungeonLevel(this.z);
        return this.y == dungeonLevel.height - 1;
    }
};
Room.prototype.toString = function () {
    return "(" + this.x + ", " + this.y + ", " + this.z + "), Room Id: " + this.id + ", North Wall: " + this.getNorthWall().hasWall() + ", South Wall: " + this.getSouthWall().hasWall() + ", EastWall: " + this.getEastWall().hasWall() + ", West Wall: " + this.getWestWall().hasWall() + ", inn: " + this.hasInn() + ")";
};

function Inn(id) {
    this.id = id;
    this.name = GetTavernName(id);
}