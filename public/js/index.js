$(document).ready(init);
function init() {
    console.warn('init');
    var app = new Telengard();
    var start = new Date();
    app.render(app.currentPosition,app.currentLevel,app.viewRadius);
    var end = new Date();
    console.warn('Time to draw: ' + (end.getTime() - start.getTime()) + "ms");
}

function Position(x,y,z) {
    this.x = x;
    this.y = y;
    this.z = z;
}
Position.prototype.toString = function() {
    return "(" + this.x + ", " + this.y + ", " + this.z + ")"; 
}

function Telengard() {
    var app = this;
    this.currentPosition = new Position(2,2,0);
    this.currentLevel = new DungeonLevel(0);
    this.viewRadius = 2;
    this.keyboard = new Keyboard(app);
    this.setPosition = function (pos) {
        var self = this;
        this.currentPosition = pos;
        this.render(this.currentPosition, this.currentLevel, this.viewRadius);
    };
    this.render = function(pos, level, radius) {
        //pos is the current position. Should be center with squares in each direction equal to radius so radius 2 = 3x3 grid.
        var container = $('.level').empty();
        var table = $('<table class="dungeon">').appendTo(container);
        for(var row = pos.y - radius;row <= pos.y + radius;row++) {
            var trow = $('<tr>').appendTo(table);
            for(var col = pos.x - radius;col <= pos.x + radius;col++) {
                var cell = $('<td>').addClass("x" + col + "y" + row).appendTo(trow);
                if (row == pos.y && col == pos.x) 
                    cell.addClass("currentLocation");

                var room = new Room(col, row, level.depth);
                if (row == 0 || room.getNorthWall().hasWall())
                    cell.addClass("northWall")
                if (col == level.width - 1 || room.getEastWall().hasWall())
                    cell.addClass("eastWall")
                if (row == level.height - 1 || room.getSouthWall().hasWall())
                    cell.addClass("southWall")
                if (col == 0 || room.getWestWall().hasWall())
                    cell.addClass("westWall")

                if (row == -1)
                    cell.addClass("southWall")
                if (col == -1)
                    cell.addClass("eastWall")
                if (row >= level.height)
                    cell.addClass("northWall")
                if (col >= level.width)
                    cell.addClass("westWall")

                if (row < 0 || row >= level.height)
                    cell.addClass("offGrid")
                if (col < 0 || cell >= level.width)
                    cell.addClass("offGrid")

                cell.html(col + "," + row);
            }
        }
    };
}  