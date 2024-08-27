function Vertex(x,y,z) {
    this.x = x;
    this.y = y;
    this.z = z
    this.id = x.toString() + y.toString() + z.toString();
};
Vertex.prototype.toString = function () {
    return "(" + this.x + ", " + this.y + ", " + this.z + "; Vid:" + this.id + ")";
};