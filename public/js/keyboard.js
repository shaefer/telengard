function Keyboard(app) {
	var _keyboard = this;
    this.leftArrow = function(app) {
        var pos = app.currentPosition;
        var room = new Room(pos.x, pos.y, pos.z);
        if (!room.getWestWall().hasWall())
        {
            var nextPos = new Position(pos.x - 1, pos.y, pos.z);
            app.setPosition(nextPos);
        }
        else
        {
            console.warn("You can't move through walls.")
        }
	}

	this.rightArrow = function() {
	    var pos = app.currentPosition;
        var room = new Room(pos.x, pos.y, pos.z);
        if (!room.getEastWall().hasWall())
        {
            var nextPos = new Position(pos.x + 1, pos.y, pos.z);
            app.setPosition(nextPos);
        }
        else
        {
            console.warn("You can't move through walls.")
        }
	}

	this.upArrow = function() {
	    var pos = app.currentPosition;
        var room = new Room(pos.x, pos.y, pos.z);
        if (!room.getNorthWall().hasWall())
        {
            var nextPos = new Position(pos.x, pos.y - 1, pos.z);
            app.setPosition(nextPos);
        }
        else
        {
            console.warn("You can't move through walls.")
        }
	}

	this.downArrow = function() {
	    var pos = app.currentPosition;
        var room = new Room(pos.x, pos.y, pos.z);
        if (!room.getSouthWall().hasWall())
        {
            var nextPos = new Position(pos.x, pos.y + 1, pos.z);
            app.setPosition(nextPos);
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