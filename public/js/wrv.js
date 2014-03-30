//http://pcg.wikidot.com/pcg-algorithm:dungeon-generation
//http://pcg.wdfiles.com/local--files/pcg-algorithm%3Amaze/growingtree.py

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
    console.debug(firstChar)
    return firstChar > 6
};

function Room(x,y,z) {
    this.x = x;
    this.y = y;
    this.z = z;
    Math.seedrandom(x.toString() + y.toString() + z.toString());
    this.id = Math.random();
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
};
Room.prototype.toString = function () {
    return "(" + this.x + ", " + this.y + ", " + this.z + "), Room Id: " + this.id + ", North Wall: " + this.getNorthWall().toString()
};