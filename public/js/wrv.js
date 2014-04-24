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
    Math.seedrandom(z);
    this.id = Math.random().toString().substring(2);
    this.depth = z;
    var firstChar = Number(this.id.toString().substring(0, 1));
    if (firstChar >= 0 && firstChar <=4) {
        this.width = 50;
        this.height = 50;
    }
    else {
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
    this.id = Math.random().toString().substring(2);
    this.onMap = function() {
        var dungeonLevel = new DungeonLevel(this.z);
        return this.x >= 0 && this.y >= 0 && this.x <= dungeonLevel.width - 1 && this.y <= dungeonLevel.height - 1;
    }
    this.hasInn = function() {
        var innChar = GetIdCharPair(this.id, 0);
        return innChar == 78 && z <= 5 
    };
    this.inn = function() {
        if (!this.hasInn()) return null;
        return new Inn(this.id);
    };
    this.hasStairsDown = function() {
        var stairs = GetIdCharPair(this.id, 2);
        return stairs == 77;
    };
    this.hasStairsUp = function() {
        if (this.z == 0) return false;
        var upperDungeonRoom = new Room(this.x, this.y, this.z - 1);
        return upperDungeonRoom.hasStairsDown();
    };
    this.nwVertex = function () {
        var self = this;
        return new Vertex(self.x, self.y, self.z)
    };
    this.neVertex = function () {
        var self = this;
        return new Vertex(self.x + 1, self.y, self.z)
    };
    this.seVertex = function () {
        var self = this;
        return new Vertex(self.x + 1, self.y + 1, self.z)
    };
    this.swVertex = function () {
        var self = this;
        return new Vertex(self.x, self.y + 1, self.z)
    };
    this.getNorthWall = function () {
        var self = this;
        return new Wall(self.nwVertex(), self.neVertex())
    }
    this.getEastWall = function () {
        var self = this;
        return new Wall(self.neVertex(), self.seVertex())
    }
    this.getSouthWall = function () {
        var self = this;
        return new Wall(self.swVertex(), self.seVertex())
    }
    this.getWestWall = function () {
        var self = this;
        return new Wall(self.nwVertex(), self.swVertex())
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
    this.name = "Worthy Inn " + id;
}