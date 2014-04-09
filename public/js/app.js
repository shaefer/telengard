function Telengard() {
    var app = this;
    this.currentPosition = new Position(2,2,0);
    this.currentLevel = new DungeonLevel(0);
    this.viewRadius = 2;
    this.keyboard = new Keyboard(app);
    this.inCombat = false;
    this.validOptions = [];
    this.player = new PlayerCharacter();
    this.currentMonster = null;
    this.setPosition = function (pos) {
        var self = this;
        this.currentPosition = pos;
        this.render(this.currentPosition, this.currentLevel, this.viewRadius);
    };
    this.console = function(message) {
        $('.textContainer').prepend($("<div class='consoleMessage'>"+message+"<div class='timestamp'>"+toTimestamp(new Date())+"</div></div>"))
    };
    this.stateOptions = function() {
        var join = ", "
        if (this.validOptions.length == 2)
            join = " or ";
        this.console(this.validOptions.join(join));
    };
    this.randomEvent = function() {
        Math.seedrandom(new Date().getTime());
        var randomEventId = Math.random().toString().substring(2);
        var firstPair = Number(randomEventId.toString().substring(0, 2))
        //degrees of good events
        //random bad thing
        //totally weird event
        //battle
        console.warn('Pair rolled for randomEvent: ' + firstPair);
        if (firstPair <= 49) {
            this.beginCombat();
        }
    };
    this.beginCombat = function() {
        console.warn('beginCombat')
        this.inCombat = true;
        this.validOptions = ["[F]lee", "[A]ttack"];
        var monster = this.getMonster();
        this.currentMonster = monster;
        var pos = this.currentPosition;
        var monsterImg = $("<img class='monster' src='"+monster.src+"'>");
        monsterImg.css({top:(-monster.height/1.25) + "px", left:(-monster.width/1.25) + "px"})
        $('.x' + pos.x + 'y' + pos.y).append(monsterImg);
        this.stateOptions();
    };

    this.attack = function() {
        this.console("You have " + this.player.hp + " hp. The " + this.currentMonster.name + " has " + this.currentMonster.hp + " hp.");
        this.console("You strike for 20 damage.")
        this.currentMonster.hp = this.currentMonster.hp - 20;
        if (this.currentMonster.hp <= 0)
        {
            this.console("You killed the " + this.currentMonster.name + "!");
            this.endCombat();
        }
        else
        {
            this.stateOptions();
        }
        //calculate to hit vs current monster ac
        //display hit or miss and damage.
        //redisplay options
    };

    this.flee = function() {
        this.console("You have fled from the " + this.currentMonster.name);
        this.endCombat();
    };

    this.endCombat = function() {
        this.inCombat = false;
        this.currentMonster = null;
        $('.monster').remove();
        this.validOptions = [];
    }

    this.getMonster = function() {
        console.warn('getMonster')
        Math.seedrandom(new Date().getTime());
        var monsterId = Math.random().toString().substring(2);
        var firstPair = Number(monsterId.toString().substring(0, 2));
        if (firstPair <= 49) {
            this.console("A <span class='command'>dragon</span> stands before you!");
            return new Dragon(monsterId);
        }
        else {
            this.console("A <span class='command'>behir</span> looms above you!");
            return new Behir(monsterId);
        }
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