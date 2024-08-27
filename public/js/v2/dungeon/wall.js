function Wall(vertex1, vertex2) {
    this.vertex1 = vertex1;
    this.vertex2 = vertex2;
    const rnd = new Math.seedrandom(this.vertex1.toString() + this.vertex2.toString());
    this.id = rnd().toString().substring(2);
    this.wallExists = new Number(this.id.charAt(0)) >= 8; //30% chance of wall.
    //TODO: The challenge here is that this wall could be the 4th wall for any of 4 different blocks. To solve this we likely need to use the flood methodology to identify which blocks are not part of the flooded area and thus blocked off completely.
};