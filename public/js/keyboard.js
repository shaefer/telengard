Direction = {north:"N", south:"S", east:"E", west:"W", down:"D", up:"U"};

Keys = {
    Arrows:{ 'left':37,'up':38,'right':39,'down':40 },
    Control:{ 'BACKSPACE':8,'TAB':9,'ENTER':13,'SHIFT':16,'CTRL':17,'ALT':18,'PAUSE':19,'CAPS':20,'SPACE':32,'PAGEUP':33,'PAGEDOWN':34,'END':35,'HOME':36,'INSERT':45,'DELETE':46,'PRTSCN':44,'SCRLOK':145 },
    QWERTY:{ '0':48,'1':49,'2':50,'3':51,'4':52,'5':53,'6':54,'7':55,'8':56,'9':57,'a':65,'b':66,'c':67,'d':68,'e':69,'f':70,'g':71,'h':72,'i':73,'j':74,'k':75,'l':76,'m':77,'o':79,'n':78,'p':80,'q':81,'r':82,'s':83,'t':84,'u':85,'v':86,'w':87,'x':88,'y':89,'z':90 },
    NUMLOCK:{ '0':96,'1':97,'2':98,'3':99,'4':100,'5':101,'6':102,'7':103,'8':104,'9':105,'*':106,'+':107,'-':109,'.':110,'/':111 },
    FKeys:{ 'F1':112,'F2':113,'F3':114,'F4':115,'F5':116,'F6':117,'F7':118,'F8':119,'F9':120,'F10':121,'F11':122,'F12':123 },
    Misc:{ ';':186,'=':187,',':188,'-':189,'.':190,'/':191,'`':192,'[':219,'\\':220,']':221,"'":222 }
};

function Keyboard(app) {
	var _keyboard = this;
    this.directionMessage = function(direction, pos) {
        return "You moved <span class='command'>"+direction+"</span> to " + pos.x + "," + pos.y
    }
    this.move = function(app, direction) {
        if (app.busy)
        {
            app.console("You are busy. Please select a valid option.");
            app.stateOptions();
            return;
        }
        if (direction == Direction.north)
            this.upArrow(app);
        if (direction == Direction.south)
            this.downArrow(app);
        if (direction == Direction.east)
            this.rightArrow(app);
        if (direction == Direction.west)
            this.leftArrow(app);
        if (direction == Direction.down)
            this.downStairs(app);
        if (direction == Direction.up)
            this.upStairs(app);
        app.statsDisplay();
    }
    this.downStairs = function(app) {
        var pos = app.currentPosition;
        var room = new Room(pos.x, pos.y, pos.z);
        if (room.hasStairsDown())
        {
            var nextPos = new Position(pos.x, pos.y, pos.z + 1);
            app.setPosition(nextPos);
            app.console(this.directionMessage("down the stairs", nextPos));
            app.randomEvent();
        }
        else
        {
            console.warn("There are no stairs going down here.");
        }
    };
    this.upStairs = function(app) {
        var pos = app.currentPosition;
        var room = new Room(pos.x, pos.y, pos.z);
        if (room.hasStairsUp())
        {
            var nextPos = new Position(pos.x, pos.y, pos.z - 1);
            app.setPosition(nextPos);
            app.console(this.directionMessage("up the stairs", nextPos));
            app.randomEvent();
        }
        else
        {
            console.warn("There are no stairs going up here.");
        }
    };
    this.leftArrow = function(app) {
        var pos = app.currentPosition;
        var room = new Room(pos.x, pos.y, pos.z);
        if (!room.getWestWall().hasWall() && !room.getWestLimit())
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
	};

	this.rightArrow = function(app) {
	    var pos = app.currentPosition;
        var room = new Room(pos.x, pos.y, pos.z);
        if (!room.getEastWall().hasWall() && !room.getEastLimit())
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
	};

	this.upArrow = function(app) {
	    var pos = app.currentPosition;
        var room = new Room(pos.x, pos.y, pos.z);
        if (!room.getNorthWall().hasWall() && !room.getNorthLimit())
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
	};

	this.downArrow = function(app) {
	    var pos = app.currentPosition;
        var room = new Room(pos.x, pos.y, pos.z);
        if (!room.getSouthWall().hasWall() && !room.getSouthLimit())
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
	};

    $(document).unbind();
	$(document).keydown(function(e) {
        switch(e.which) {
            case Keys.Arrows.left: // left
            _keyboard.move(app, Direction.west);
            break;

            case Keys.Arrows.up: // up
            _keyboard.move(app, Direction.north);
            break;

            case Keys.Arrows.right: // right
            _keyboard.move(app, Direction.east);
            break;

            case Keys.Arrows.down: // down
            _keyboard.move(app, Direction.south);
            break;

            case Keys.QWERTY.a:
            app.attack();
            break;

            case Keys.QWERTY.f:
            app.flee()
            break;

            case Keys.QWERTY.r:
            app.restAtInn(); 
            break;

            case Keys.QWERTY.t:
            app.toggleTravelMode();
            break;

            case Keys.QWERTY.g:
            app.acceptGift();
            break;

            case Keys.QWERTY.d:
            _keyboard.move(app, Direction.down);
            break;

            case Keys.QWERTY.u:
            _keyboard.move(app, Direction.up);
            break;

            case Keys.QWERTY.m:
            app.toggleDebugMode();
            break;

            case Keys.QWERTY.q:
            app.drinkPotion();
            break;

            default: return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });
};