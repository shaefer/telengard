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
    this.id = Math.random();
};
Wall.prototype.toString = function () {
    return "(" + this.vertex1.toString() + ", " + this.vertex2.toString() + "; WallId: " + this.id + ")";
};

function Room(x,y,z) {
    this.x = x;
    this.y = y;
    this.z = z;
    Math.seedrandom(x.toString() + y.toString() + z.toString());
    this.id = Math.random();
    this.getNorthWall = function () {
        var self = this;
        return new Wall(new Vertex(self.x, self.y, self.z), new Vertex(self.x + 1, self.y, self.z))
    }
};
Room.prototype.toString = function () {
    return "(" + this.x + ", " + this.y + ", " + this.z + "), Room Id: " + this.id + ", North Wall: " + this.getNorthWall().toString()
};