function Telengard() {
    this.init = function() {
        this.currentPosition = new Position(2,2,0);
        this.currentLevel = new DungeonLevel(0);
        this.viewRadius = 2;
        this.keyboard = new Keyboard(this);
        this.inCombat = false;
        this.validOptions = [];
        this.player = new PlayerCharacter();
        this.currentMonster = null;

        this.statsDisplay();
        this.startGame();
    };

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
        this.validOptions = ["[<span class='command'>F</span>]lee", "[<span class='command'>A</span>]ttack"];
        var monster = this.getMonster();
        console.warn(monster);
        this.currentMonster = monster;
        var pos = this.currentPosition;
        var monsterImg = $("<img class='monster' src='"+monster.src+"'>");
        monsterImg.css({top:(-monster.height/1.25) + "px", left:(-monster.width/1.25) + "px", width:monster.width+"px", height:monster.height+"px"})
        $('.x' + pos.x + 'y' + pos.y).append(monsterImg);
        this.stateOptions();
    };

    this.attack = function() {
        this.console("You have " + this.player.hp + " hp. The " + this.currentMonster.name + " has " + this.currentMonster.hp + " hp.");
        var strike = this.strike();
        if (strike.hit)
        {
            console.warn(strike);
            this.console("You strike for <span class='command'>"+strike.damage+"</span> damage.")
            this.currentMonster.hp = this.currentMonster.hp - strike.damage;
            if (this.currentMonster.hp <= 0)
            {
                this.monsterDeath();
                this.endCombat();
                return;
            }
        }
        else
        {
            this.console("You missed the <span class='command'>" + this.currentMonster.name + "</span>");
        }
        this.monsterAttack()
        this.stateOptions();
        console.warn(this.player);
        //calculate to hit vs current monster ac
        //display hit or miss and damage.
        //redisplay options
    };

    this.monsterDeath = function() {
        this.console("You killed the <span class='command'>" + this.currentMonster.name + "</span>!");
        this.awardExperience();
    };

    this.monsterAttack = function() {
        var toHit = Calculation.toHitPlayer(this.player, this.currentMonster);
        var swing = DiceUtils.d100().total;
        if (swing <= toHit)
        {

            var damage = Calculation.monsterDamage(this.player, this.currentMonster);
            this.console("The " + this.currentMonster.name + " strikes you for <span class='command'>" + damage + "</span> damage.");
            this.player.hp = this.player.hp - damage;
            if (this.player.hp <= 0)
                this.death();
        }
        else
        {
            this.console("The " + this.currentMonster.name + " <span class='command'>misses</span> you.");
        }
    };

    this.strike = function() {
        var player = this.player;
        var toHit = Calculation.toHitMonster(player);
        var id = GetRand();
        console.debug("Strike roll: " + id)
        var swing = DiceUtils.d100().total;
        if (swing <= toHit)
        {
            var critRoll = Number(id.toString().substring(2, 5))/10;
            var critTarget = 100 - (Math.round(player.critPercent() * 10)/10);
            var crit = critRoll >= critTarget ? true : false;
            this.console("Crit Roll: " + critRoll + " vs " + critTarget);
            if (crit)
            {
                this.console("You scored a critical hit!");
            }
            return {hit:true, crit:crit, damage:Calculation.playerDamage(player, crit) }
        }
        else
        {
            return {hit:false, crit:false, damage:0}
        }
    };

    this.flee = function() {
        var player = this.player;
        var rand = GetRand();
        var fleeTarget = 100 - (Math.round(player.fleePercent() * 10)/10)
        var fleeRoll = Number(rand.toString().substring(0, 3))/10;
        var fled = fleeRoll >= 100 - fleeTarget;
        if (fled)
        {
            this.console("You have fled from the " + this.currentMonster.name);
            this.endCombat();
        }
        else
        {
            this.console("You were not quick enough to escape from the <span class='command'>" + this.currentMonster.name + "</span>");
            this.stateOptions();
        }
    };

    this.endCombat = function() {
        this.inCombat = false;
        this.currentMonster = null;
        $('.monster').remove();
        this.validOptions = [];
    }

    this.awardExperience = function() {
        var exp = Calculation.experience(this.currentMonster);
        this.player.awardExperience(exp);
        this.console("You earned <span class='command'>" + exp + "</span> experience!");
    }

    this.death = function() {
        this.console("You died!");
        this.init();
    }

    this.startGame = function() {
        this.render(new Position(2,2,0), new DungeonLevel(0), 2);
    }

    this.getMonster = function() {
        console.warn('getMonster')
        var monster = GetMonster(this.currentPosition);
        var foundMonsterPhrase = GetMonsterFoundPhrase(monster.name);
        this.console(foundMonsterPhrase);
        return monster;
    };
    this.statsDisplay = function() {
        $('.col3').empty().append(this.player.toDisplay())
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

    this.init();
}  