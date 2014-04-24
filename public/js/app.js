function Telengard() {
    this.init = function() {
        this.currentPosition = new Position(2,2,0);
        console.warn('room: ' + GetRoom(this.currentPosition).toString());
        this.currentLevel = new DungeonLevel(0);
        this.viewRadius = 2;
        this.keyboard = new Keyboard(this);
        this.inCombat = false;
        this.busy = false;
        this.validOptions = [];
        this.player = new PlayerCharacter();
        this.currentMonster = null;
        this.debugMode = true;
        this.statsDisplay();
        this.startGame();
    };

    this.setPosition = function (pos) {
        this.currentPosition = pos;
        this.render(this.currentPosition, this.currentLevel, this.viewRadius);
    };
    this.console = function(message) {
        $('.textContainer').prepend($("<div class='consoleMessage'>"+message+"<div class='timestamp'>"+toTimestamp(new Date())+"</div></div>"));
    };
    this.debug = function(message) {
        if (this.debugMode)
            $('.textContainer').prepend($("<div class='consoleMessage'><span class='debug'>[DEBUG]</span>"+message+"<div class='timestamp'>"+toTimestamp(new Date())+"</div></div>"));
    }
    this.stateOptions = function() {
        var join = ", "
        if (this.validOptions.length == 2)
            join = " or ";
        this.console(this.validOptions.join(join));
    };
    this.randomEvent = function() {
        this.player.step();
        //degrees of good events
        //random bad thing
        //totally weird event
        //battle
        var roll = d00();
        this.debug('Pair rolled for randomEvent: ' + roll);
        var topCombatRange = 50;
        if (this.player.lookingForTrouble) {
            topCombatRange += 10;
        }
        if (roll.inRange(11, topCombatRange)) {
            this.beginCombat();
        }
        else if (roll.inRange(6, 10)) {
            this.friendlyMonster();
        }
        else if (roll.inRange(1, 5)) {
            this.findExtraTreasure();
        }
        //whenever nothing random is happening describe room and options based on room features.
        this.describePosition();
    };
    this.beginCombat = function() {
        console.warn('beginCombat')
        this.inCombat = true;
        this.busy = true;
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

    this.findExtraTreasure = function() {
        var gold = DiceUtils.roll(1, 200).total;
        this.player.gold += gold;
        this.console("You found a hidden alcove and within it you discover " + gold + " pieces.");
        this.describePosition();
    };

    this.friendlyMonster = function() {
        this.busy = true;
        var monster = this.getMonster();
        this.currentMonster = monster;
        var pos = this.currentPosition;
        var monsterImg = $("<img class='monster' src='"+monster.src+"'>");
        monsterImg.css({top:(-monster.height/1.25) + "px", left:(-monster.width/1.25) + "px", width:monster.width+"px", height:monster.height+"px"})
        $('.x' + pos.x + 'y' + pos.y).append(monsterImg);

        this.validOptions = ["Accept the [<span class='command'>G</span>]ift"];
        var gold = DiceUtils.roll(1, 300).total;
        this.currentGift = gold;
        this.console("<span class='goodEvent'>The " + monster.name + " likes your gumption. He offers you <span class='gold'>" + gold + "</span> gold pieces.</span>");
        this.stateOptions();
    };

    this.acceptGift = function() {
        if (!this.currentGift) return;

        this.console("You accept the kind offer from the " + this.currentMonster.name);
        this.busy = false;
        this.currentMonster = null;
        this.player.gold += this.currentGift;
        this.currentGift = null;
        this.validOptions = [];
        $('.monster').remove();

        this.statsDisplay();
        this.describePosition();
    };

    this.attack = function() {
        if (!this.inCombat) return;
        this.console("The <span class='monsterName'>" + this.currentMonster.name + "</span> has " + this.currentMonster.hp + " hp.");
        var strike = this.strike();
        if (strike.hit)
        {
            console.warn(strike);
            this.console("You strike with your " + this.player.weapon.name + " for <span class='command'>"+strike.damage+"</span> damage.")
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
            this.console("You <span class='miss'>missed</span> the <span class='monsterName'>" + this.currentMonster.name + "</span>");
        }
        this.monsterAttack();
        this.statsDisplay();
        this.stateOptions();
        console.warn(this.player);
        //calculate to hit vs current monster ac
        //display hit or miss and damage.
        //redisplay options
    };

    this.monsterDeath = function() {
        this.console("You killed the <span class='monsterName'>" + this.currentMonster.name + "</span>!");
        this.awardExperience();
        this.statsDisplay();
    };

    this.monsterAttackOfOpportunity = function() {
        var opRoll = d00();
        var target = 100 - Math.round(25 + this.currentMonster.prowess - (this.player.agility + this.player.luck));
        if (opRoll <= target) {
            this.console("The " + this.currentMonster.name + " takes advantage of your attempted flight and attacks!");
            this.monsterAttack();
        }
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
            this.console("The " + this.currentMonster.name + " <span class='miss'>misses</span> you.");
        }
        this.statsDisplay();
    };

    this.strike = function() {
        var player = this.player;
        var toHit = Calculation.toHitMonster(player);
        var swing = d00();
        if (swing <= toHit)
        {
            var critRoll = d00();
            var critTarget = 100 - (Math.round(player.critPercent() * 10)/10);
            var crit = critRoll >= critTarget ? true : false;
            this.debug("Crit Roll: " + critRoll + " vs " + critTarget);
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
        if (!this.inCombat) return;
        var player = this.player;
        var fleeTarget = 100 - Math.round((Math.round(player.fleePercent() * 10)/10));
        var fleeRoll = d00();
        this.debug("Flee roll: " + fleeRoll + " vs " + fleeTarget);
        var fled = fleeRoll >= 100 - fleeTarget;
        if (fled)
        {
            this.console("You have fled from the " + this.currentMonster.name);
            this.endCombat();
        }
        else
        {
            this.console("You were not quick enough to escape from the <span class='command'>" + this.currentMonster.name + "</span>");
            this.monsterAttackOfOpportunity();
            this.stateOptions();
        }
    };

    this.endCombat = function() {
        this.inCombat = false;
        this.busy = false;
        this.currentMonster = null;
        $('.monster').remove();
        this.validOptions = [];
        this.describePosition();
    };

    this.describePosition = function() {
        var loc = GetRoom(this.currentPosition);
        var inn = loc.inn();
        if (inn != null && !this.inCombat)
        {
            this.console("You stand outside the " + inn.name);
            this.validOptions = ["[<span class='command'>R</span>]est at the Inn."];
        }
        else
        {
            this.validOptions = [];
        }
        this.stateOptions();
    };

    this.restAtInn = function() {
        var inn = GetRoom(this.currentPosition).inn();
        if (inn == null || this.inCombat) return;
        this.player.rest();
        this.statsDisplay();
        this.console("You feel refreshed. Your hit points and magic are restored!");
    };

    this.toggleTravelMode = function() {
        var current = this.player.lookingForTrouble;
        if (current)
            this.player.lookingForTrouble = false;
        else
            this.player.lookingForTrouble = true;

        if (this.player.lookingForTrouble)
            this.console("You are now looking for trouble.");
        else
            this.console("You are now traveling more carefully.");
    }

    this.awardExperience = function() {
        var exp = Calculation.experience(this.player, this.currentMonster);
        var leveledUp = this.player.awardKillAndExperience(this.currentMonster, exp);
        this.console("You earned <span class='experience'>" + exp + "</span> experience!");
        if (leveledUp)
        {
            this.console("<span class='levelup'>You are now level <span class='command'>" + this.player.level + "</span>!</span>");
            console.warn(leveledUp);
        }
    };

    this.death = function() {
        this.console("You died!");
        this.init();
        console.warn(this);
    };

    this.startGame = function() {
        this.render(new Position(2,2,0), new DungeonLevel(0), 2);
        this.describePosition();
    };

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

                if (room.hasInn() && InRoom(room, pos))
                {
                    console.warn(room.toString() + " has inn.")
                    var inn = room.inn();
                    cell.addClass("inn");
                }

                cell.html(col + "," + row);
            }
        }
    };

    this.init();
}  