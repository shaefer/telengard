function Keyboard(app) {
	var _keyboard = this;
    this.directionMessage = function(direction, pos) {
        return "You moved <span class='command'>"+direction+"</span> to " + pos.x + "," + pos.y
    }
    this.leftArrow = function(app) {
        var pos = app.currentPosition;
        var room = new Room(pos.x, pos.y, pos.z);
        if (!room.getWestWall().hasWall() && !room.getWestLimit(pos))
        {
            var nextPos = new Position(pos.x - 1, pos.y, pos.z);
            app.setPosition(nextPos);
            app.console(this.directionMessage("west", nextPos));
            app.randomEvent();
        }
        else
        {
            console.warn("You can't move through walls.")
        }
	}

	this.rightArrow = function() {
	    var pos = app.currentPosition;
        var room = new Room(pos.x, pos.y, pos.z);
        if (!room.getEastWall().hasWall() && !room.getEastLimit(pos))
        {
            var nextPos = new Position(pos.x + 1, pos.y, pos.z);
            app.setPosition(nextPos);
            app.console(this.directionMessage("east", nextPos));
            app.randomEvent();
        }
        else
        {
            console.warn("You can't move through walls.")
        }
	}

	this.upArrow = function() {
	    var pos = app.currentPosition;
        var room = new Room(pos.x, pos.y, pos.z);
        if (!room.getNorthWall().hasWall() && !room.getNorthLimit(pos))
        {
            var nextPos = new Position(pos.x, pos.y - 1, pos.z);
            app.setPosition(nextPos);
            app.console(this.directionMessage("north", nextPos));
            app.randomEvent();
        }
        else
        {
            console.warn("You can't move through walls.")
        }
	}

	this.downArrow = function() {
	    var pos = app.currentPosition;
        var room = new Room(pos.x, pos.y, pos.z);
        if (!room.getSouthWall().hasWall() && !room.getSouthLimit(pos))
        {
            var nextPos = new Position(pos.x, pos.y + 1, pos.z);
            app.setPosition(nextPos);
            app.console(this.directionMessage("south", nextPos));
            app.randomEvent();
        }
        else
        {
            console.warn("You can't move through walls.")
        }
	}

	$(document).keydown(function(e) {
        switch(e.which) {
            case 37: // left
            _keyboard.leftArrow(app);
            break;

            case 38: // up
            _keyboard.upArrow();
            break;

            case 39: // right
            _keyboard.rightArrow();
            break;

            case 40: // down
            _keyboard.downArrow();
            break;

            default: return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });
};