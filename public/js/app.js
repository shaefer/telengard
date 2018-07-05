function Telengard() {
    this.init = function() {
        this.config = {
            percentChanceOfCombat:20,
            percentChanceOfCombatIncrease: 20,
            percentChanceOfFriendlyMonsterGivingGold: 2,
            percentChanceOfFindingTreasure: 4,
            percentChanceOfFriendlyMonsterUpgradingWeapon: 1,
            percentChanceOfFriendlyMonsterGivingPotion: 2,
            percentChanceOfMonsterRevealingLocations: 5,
            bonusExpForKillCount: .1,
            bonusExpAwardedForEveryXKills: 100,
            monsterGoldDie: 200,
            foundGoldLevelMultiplier: 50,
            percentChanceToFindInns: 50,
            percentChanceToFindStairsUp: 50,
            percentChanceToFindStairsDown: 30,
            innExperienceMultiplier: 50,
            stairsupExperienceMultiplier: 75,
            stairsdownExperienceMultiplier: 100
        };
        this.discoveryType = {
            inn: {mult:this.config.innExperienceMultiplier, exp: function(level) {return this.mult * level;}},
            stairsup: {mult:this.config.stairsupExperienceMultiplier, exp: function(level) {return this.mult * level;}},
            stairsdown: {mult:this.config.stairsdownExperienceMultiplier, exp: function(level) {return this.mult * level;}}
        };
        this.startingPosition = new Position(2,2,0);
        this.startingViewRadius = 3;
        this.currentPosition = this.startingPosition;
        this.viewRadius = this.startingViewRadius; //Should this property be on the player? -> Probably.
        this.keyboard = new Keyboard(this);
        this.inCombat = false;
        this.busy = false;
        this.validOptions = [];
        this.player = new PlayerCharacter(this.startingPosition);
        this.currentMonster = null;
        this.debugMode = true;
        if (Object.keys(Monsters).length == 0)
            BuildAllMonsters();
    };

    this.setPosition = function (pos) {
        this.currentPosition = pos;
        this.render(this.currentPosition, new DungeonLevel(this.currentPosition.z), this.viewRadius);
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
        this.player.step(this.currentPosition, this.console);
        //degrees of good events
        //random bad thing
        //totally weird event
        //battle
        var roll = d00();
        this.debug('Pair rolled for randomEvent: ' + roll);
        var percentChanceOfCombat = this.config.percentChanceOfCombat;
        if (this.player.lookingForTrouble) {
            percentChanceOfCombat += this.config.percentChanceOfCombatIncrease;
        }
        

        var ranges = [];
        ranges.push(this.getRandomEventRollRange(1, percentChanceOfCombat, "beginCombat"));
        ranges.push(this.getRandomEventRollRange(ranges[ranges.length-1].end + 1, this.config.percentChanceOfFriendlyMonsterGivingGold, "friendlyMonsterGivesGold"));
        ranges.push(this.getRandomEventRollRange(ranges[ranges.length-1].end + 1, this.config.percentChanceOfFriendlyMonsterUpgradingWeapon, "friendlyMonsterUpgradesWeapon"));
        ranges.push(this.getRandomEventRollRange(ranges[ranges.length-1].end + 1, this.config.percentChanceOfFindingTreasure, "findExtraTreasure"));
        ranges.push(this.getRandomEventRollRange(ranges[ranges.length-1].end + 1, this.config.percentChanceOfFriendlyMonsterGivingPotion, "friendlyMonsterGivesPotion"));
        ranges.push(this.getRandomEventRollRange(ranges[ranges.length-1].end + 1, this.config.percentChanceOfMonsterRevealingLocations, "friendlyMonsterGivesLocationInfo"));

        var eventOccurred = this._fireRandomEvent(roll, ranges);
        if (!eventOccurred)
            this.describePosition();
    };
    this._fireRandomEvent = function(roll, ranges)
    {
        for(var i = 0;i<ranges.length;i++)
        {
            var range = ranges[i];
            if (roll.inRange(range.start, range.end))
            {
                this[range.fnName]();
                return true;
            }
        }
        return false;
    };
    this.getRandomEventRollRange = function(start, percentChance, fn)
    {
        return {start:start, end:start + percentChance - 1, fnName:fn};
    };

    this.drinkPotion = function() {
        var item = Items[2]();
        var descriptions = item.use(this.player);
        var message = "You use the <class='item'>" + item.name + "<span>. ";
        for(var i = 0;i<descriptions.length;i++)
        {
            message += descriptions[i] + " ";
        }
        this.console(message);
        this.determinePlayerStatus();
        this.statsDisplay();
    };

    this.beginCombat = function() {
        console.warn('beginCombat')
        var monster = this.monsterAppears();
        this.inCombat = true;
        this.validOptions = ["[<span class='command'>F</span>]lee", "[<span class='command'>A</span>]ttack"];
        this.stateOptions();
    };

    this.findExtraTreasure = function() {
        var treasureRoll = d00();
        this.debug('FINDING EXTRA TREASURE ROLL: ' + treasureRoll);
        if (treasureRoll.inRange(1, 50))
            this.findGold();
        else
            this.findPotion();
    };

    this.findGold = function() {
        var pos = this.currentPosition;
        var gold = DiceUtils.roll(1, this.config.foundGoldLevelMultiplier * (pos.z + 1)).total;
        this.player.gold += gold;
        this.console("You found a hidden alcove and within it you discover <span class='gold'>" + gold + "</span> pieces.");
        this.describePosition();
    };

    this.findPotion = function() {
        this.debug("FIND POTION")
        var potion = this.itemAppears(GetRandomPotion());
        this.debug("POTION SELECTED: " + potion.name)
        this.currentItem = potion;
        this.validOptions = ["You found a "+potion.name+". [<span class='command'>T</span>]ake the " + potion.name];
        this.stateOptions();
    };

    this.itemAppears = function(item) {
        this.busy = true;
        var pos = this.currentPosition;
        var img = $("<img class='treasure' style='width:32px;height:32px' src='"+item.src+"'>");
        $('.x' + pos.x + 'y' + pos.y).append(img);
        return item;
    };

    this.takeItem = function() {
        if (!this.currentItem) return;

        var item = this.currentItem;
        this.console("You pick up the " + item.name);
        this.player.items.push(item);

        this.busy = false;
        this.currentItem = null;
        this.validOptions = [];
        $('.treasure').remove();

        this.statsDisplay();
        this.describePosition();
    };

    this.monsterAppears = function() {
        this.busy = true;
        var monster = this.getMonster();
        this.currentMonster = monster;
        var pos = this.currentPosition;
        var monsterImg = $("<img class='monster' src='"+monster.src+"'>");
        monsterImg.css({top:(-monster.height/1.25) + "px", left:(-monster.width/1.25) + "px", width:monster.width+"px", height:monster.height+"px"})
        $('.x' + pos.x + 'y' + pos.y).append(monsterImg);
        return monster;
    };

    this.friendlyMonsterGivesGold = function() {
        this.friendlyMonster("gold");
    };
    this.friendlyMonsterUpgradesWeapon = function() {
        this.friendlyMonster("upgradeWeapon");
    };
    this.friendlyMonsterGivesPotion = function() {
        this.friendlyMonster("potion");
    };
    this.friendlyMonsterGivesLocationInfo = function() {
        this.friendlyMonster("locationInfo");
    };
    this.friendlyMonster = function(giftType) {
        var monster = this.monsterAppears();
        this.validOptions = ["Accept the [<span class='command'>G</span>]ift"];
        
        var likes = LikesSynonyms[DiceUtils.roll(1, LikesSynonyms.length, -1).total]
        var thingMonsterAdmires = ThingsMonstersLike[DiceUtils.roll(1,ThingsMonstersLike.length,-1).total];
        if (giftType == "gold")
            this.currentGift = this.getGoldGift(monster);
        else if (giftType == "upgradeWeapon")
            this.currentGift = this.getUpgradeWeaponGift(this.player.weapon.name);
        else if (giftType == "potion")
            this.currentGift = this.getPotionGift();
        else if (giftType == "locationInfo")
            this.currentGift = this.getLocationInfo();
        this.console("<span class='goodEvent'>The <span class='friendlyMonsterName'>" + monster.name + "</span> "+likes+" your "+thingMonsterAdmires+". "+this.currentGift.offer+"</span>");
        this.stateOptions();
    };

    this.getUpgradeWeaponGift = function(weaponName) {
        return {
            giftType:"upgradeWeapon", 
            offer:"He offers to upgrade your <span class='gold'>" + weaponName + "</span>.", 
            accept:function(player){player.weapon.upgrade()},
            acceptedText:function(player){return " Your weapon is now a: <span class='gold'>" + player.weapon.name + "</span>"}
        }
    };

    this.getGoldGift = function(monster) {
        var gold = DiceUtils.roll(monster.level, this.config.monsterGoldDie).total;
        return {
            giftType:"gold", 
            gold:gold, offer:"He offers you <span class='gold'>" + gold + "</span> gold pieces.", 
            accept:function(player){player.gold += this.gold},
            acceptedText:function(){return ""}
        };
    };

    this.getPotionGift = function() {
        var potion = GetRandomPotion();
        this.itemAppears(potion);
        return {giftType:"potion",
        gift:potion, offer:"He offers you a <span class='gold'>" + potion.name + "</span>.",
        accept:function(player){player.items.push(this.gift)},
        acceptedText:function(){return ""}}
    };

// _.select arrayOne, (item) ->
//     !_.findWhere(arrayTwo, {id: item.id})

    this.getLocationInfo = function() {
        var rooms = this.getRoomsWithAnyFeatureOnLevel(this.currentPosition.z);
        console.warn(rooms);
        var playerVisitedOrKnownRooms = this.player.visited.concat(this.player.roomInfoKnown);
        var roomsNotKnownOrVisited = _.filter(rooms, function(item) {return !_.findWhere(playerVisitedOrKnownRooms, {x:item.x, y:item.y, z:item.z})});
        console.warn("Rooms not known or visited: " + roomsNotKnownOrVisited.length);
        if (roomsNotKnownOrVisited.length > 0)
        {
            var room = GetRandomItemFromArray(roomsNotKnownOrVisited);
            console.warn(room);
            return {
                room: room,
                giftType: "locationInfo",
                offer: "He offers you information about the dungeon level.",
                accept:function(player){
                    player.roomInfoKnown.push(this.room);
                },
                acceptedText:function() {
                    return " He tells you to head to " + this.room.x + ", " + this.room.y + "."
                }
            }
        }
        else {
            return {
                giftType: "locationInfo",
                offer: "He starts to offer you information, but ends up learning from you instead!",
                accept:function(player){
                    player.awardExperienceAndLevelUp((this.currentPosition.z + 1) * 200)
                },
                acceptedText:function() {
                    return " He says teaching is the best way to learn."
                }
            }
        }
    };

    this.acceptGift = function() {
        console.warn('about to accept gift')
        if (!this.currentGift) return;

        var acceptStatement = "You accept the kind offer from the <span class='friendlyMonsterName'>" + this.currentMonster.name + "</span>.";
        this.busy = false;
        this.currentMonster = null;
        // if (this.currentGift.giftType == 'gold')
        // {
        //     this.player.gold += this.currentGift.gold;
        //     this.console(acceptStatement);
        // }
        // else if (this.currentGift.giftType == 'upgradeWeapon')
        // {
        //     this.player.weapon.upgrade();
        //     this.console(acceptStatement + " Your weapon is now a: <span class='gold'>" + this.player.weapon.name + "</span>");
        // }
        this.currentGift.accept(this.player);
        this.console(acceptStatement + this.currentGift.acceptedText(this.player));

        this.currentGift = null;
        this.validOptions = [];
        $('.monster').remove();
        $('.treasure').remove();

        this.statsDisplay();
        this.describePosition();
    };

    this.attack = function() {
        if (!this.inCombat) return;
        //this.console("The <span class='monsterName'>" + this.currentMonster.name + "</span> has " + this.currentMonster.hp + " hp.");
        var strike = this.strike();
        if (strike.hit)
        {
            console.warn(strike);
            
            this.currentMonster.hp = this.currentMonster.hp - strike.damage;
            var crit = "";
            if (strike.crit)
                crit = "<span class='injured'>critically</span> ";
            if (this.currentMonster.hp <= this.currentMonster.maxHp/4 && !this.currentMonster.nearDeath)
            {
                this.currentMonster.nearDeath = true;
                this.console("You "+crit+"strike with your " + this.player.weapon.name + " for <span class='command'>"+strike.damage+"</span> damage. The <span class='monsterName'>" + this.currentMonster.name + "</span> is <span class='injured'>near death</span>.");
            }
            else if (this.currentMonster.hp <= this.currentMonster.maxHp/2 && !this.currentMonster.bloodied)
            {
                this.currentMonster.bloodied = true;
                this.console("You "+crit+"strike with your " + this.player.weapon.name + " for <span class='command'>"+strike.damage+"</span> damage. The <span class='monsterName'>" + this.currentMonster.name + "</span> has been <span class='injured'>seriously injured</span>.");
            }
            else
            {
                this.console("You "+crit+"strike with your " + this.player.weapon.name + " for <span class='command'>"+strike.damage+"</span> damage.");
            }
            
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
        this.awardExperienceForKill();
        this.statsDisplay();
    };

    this.monsterAttackOfOpportunity = function() {
        var opRoll = d00();
        var target = 100 - Math.round(25 + this.currentMonster.prowess - (this.player.agility + this.player.luck));
        if (opRoll <= target) {
            this.console("The <span class='monsterName'>" + this.currentMonster.name + "</span> takes advantage of your attempted flight and attacks!");
            this.monsterAttack();
        }
    };

    this.monsterAttack = function() {
        var toHit = Calculation.toHitPlayer(this.player, this.currentMonster);
        var swing = DiceUtils.d100().total;
        if (swing <= toHit)
        {
            if (this.currentMonster.specialAttack)
            {
                var specialAttack = this.currentMonster.specialAttack;
                var specialAttackRoll = d00();
                if (specialAttackRoll <= specialAttack.percentChance)
                {
                    var result = specialAttack.attack(this.player, this.currentMonster);
                    this.console(result.message);
                    if (result.effect)
                    {
                        var effectDescription = result.effect.trigger(this.player, this.player);
                        this.console(effectDescription);
                    }
                    this.player.hp = this.player.hp - result.damage;
                    this.determinePlayerStatus();
                }
                else
                {
                    this.monsterNormalAttack();
                }
            }
            else
            {
                this.monsterNormalAttack();
            }    
        }
        else
        {
            this.console("The <span class='monsterName'>" + this.currentMonster.name + "</span> <span class='miss'>misses</span> you.");
        }
        this.statsDisplay();
    };

    this.monsterNormalAttack = function() {
        var damage = Calculation.monsterDamage(this.player, this.currentMonster);
        this.console("The <span class='monsterName'>" + this.currentMonster.name + "</span> strikes you for <span class='command'>" + damage + "</span> damage.");
        this.player.hp = this.player.hp - damage;
        this.determinePlayerStatus();
    };

    this.strike = function() {
        var player = this.player;
        var toHit = Calculation.toHitMonster(player);
        var swing = d00();
        if (swing <= toHit)
        {
            var critRoll = d0000()/100;
            var critTarget = 100 - (Math.round(player.critPercent() * 10)/100);
            var crit = critRoll >= critTarget ? true : false;
            this.debug("Crit Roll: " + critRoll + " vs " + critTarget);
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
        var validOptions = [];
        if (inn != null && !this.busy)
        {
            this.showInn();
            this.console("You stand outside the <span class='location'>" + inn.name + "</span>");
            validOptions.push("[<span class='command'>R</span>]est at the Inn.");
        }
        if (loc.hasStairsDown() && !this.busy)
        {
            this.showStairsDown();
            this.console("You see a set of stairs descending deeper into the dungeon.");
            validOptions.push("Go [<span class='command'>D</span>]own the stairs.");
        }
        if (loc.hasStairsUp() && !this.busy) {
            this.showStairsUp();
            this.console("You set a set of stairs ascending to a higher level of the dungeon.");
            validOptions.push("Go [<span class='command'>U</span>]p the stairs.");
        }
        this.validOptions = validOptions;
        this.stateOptions();
    };

    this.showStairsUp = function() {
        var pos = this.currentPosition;
        $('.x' + pos.x + 'y' + pos.y).addClass("stairsup");
    };

    this.showStairsDown = function() {
        var pos = this.currentPosition;
        $('.x' + pos.x + 'y' + pos.y).addClass("stairsdown");
    };

    this.showInn = function() {
        var pos = this.currentPosition;
        var innImg = $("<img class='inn' src='../images/openclipart/inn.png'>");
        innImg.css({top:-230 + "px", left:-230 + "px"})
        $('.x' + pos.x + 'y' + pos.y).append(innImg);
    };

    this.showPlayer = function(cell) {
        var img = $("<img class='player' src='../images/barbarian.png'>");
        img.css({height:"150px", top:"0", left: "40px", margin:0,zIndex:1});
        cell.append(img);
    };

    this.restAtInn = function() {
        var inn = GetRoom(this.currentPosition).inn();
        if (inn == null || this.busy) return;
        this.player.rest();
        this.player.recordStatsForLevel(this.currentPosition.z);
        this.statsDisplay();
        this.console("You feel refreshed. Your hit points and magic are restored!");
    };

    this.toggleTravelMode = function() {
        this.player.lookingForTrouble = !this.player.lookingForTrouble;
        if (this.player.lookingForTrouble)
            this.console("You are now looking for trouble.");
        else
            this.console("You are now traveling more carefully.");
        this.statsDisplay();
    }

    this.toggleDebugMode = function() {
        this.debugMode = !this.debugMode;
        if (this.debugMode)
            this.console("Debugging on.");
        else
            this.console("Debugging off.");
    };

    this.awardExperienceForKill = function() {
        var exp = Calculation.experience(this.player, this.currentMonster);
        var killReport = this.player.awardKill(this.currentMonster);
        if (killReport.killCount % this.config.bonusExpAwardedForEveryXKills == 0) {
            var bonusExp = this.player.expToNext * this.config.bonusExpForKillCount;
            this.console("You just killed your " + killReport.killCount + "th monster! ");
        }
        var leveledUp = this.player.awardExperienceAndLevelUp(exp);
        this.reportExperienceAndLevelUp(exp, bonusExp, leveledUp);
    };

    this.awardExperienceForDiscovery = function(player, discoveryType, level) {
        var exp = Calculation.experienceForDiscovery(player, discoveryType, level); //TODO: Implement
        var leveledUp = player.awardExperienceAndLevelUp(exp);
        this.reportExperienceAndLevelUp(exp, 0, leveledUp);
    };

    this.reportExperienceAndLevelUp = function(exp, bonusExp, leveledUp) {
        var bonusPhrase = "";
        if (bonusExp)
            bonusPhrase = " (" + bonusExp + " bonus)"
        else
            bonusExp = 0;
        this.console("You earned <span class='experience'>" + (exp+bonusExp) + "</span> experience" + bonusPhrase + "!");
        if (leveledUp)
        {
            this.console("<span class='levelup'>You are now level <span class='command'>" + this.player.level + "</span>!<span>You gained "+leveledUp.str+" str</span></span>");
            console.warn(leveledUp);
        }
    };

    this.determinePlayerStatus = function() {
        if (this.player.hp <= 0)
        {
            this.player.setStatus("Dead");
            this.death();
        }
        else if (this.player.hp <= this.player.maxHp/4)
        {
            var result = this.player.setStatus("Near Death");
            if (result)
                this.console("<span class='playerInjured'>You are near death.</span>")
        }
        else if (this.player.hp <= this.player.maxHp/2)
        {
            var result = this.player.setStatus("Seriously Injured");
            if (result)
                this.console("<span class='playerInjured'>You are seriously injured.</span>")
        }
        else
        {
            var result = this.player.setStatus("");
            if (result)
                this.console("<span class='goodEvent'>You feel healthy again.<span>")
        }
    };

    this.death = function() {
        this.console("You died!");
        //TODO: Display stats.
        this.init();
        this.startGame();
    };

    this.startGame = function() {
        this.statsDisplay();
        this.render(this.startingPosition, new DungeonLevel(this.startingPosition.z), this.startingViewRadius);
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

    this.getRoomsWithAnyFeatureOnLevel = function(level) {
        return this.getRoomsWithOnLevel(level, "hasAnyFeature");
    };

    this.getRoomsWithOnLevel = function(level, check) {
        var dungeonLevel = new DungeonLevel(level);
        var width = dungeonLevel.width;
        var height = dungeonLevel.height;
        var rooms = [];
        for (var w = 0;w<width;w++) {
            for (var h = 0;h<height;h++) {
                var room = new Room(w, h, level);
                if (room[check]())
                {
                    rooms.push(room.getPosition());
                }
            }
        }
        this.debug(rooms.length + " rooms with " + check + " on level " + level);
        return rooms;
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
                {
                    cell.addClass("currentLocation");
                    this.showPlayer(cell);
                }
                var roomPos = new Position(col, row, level.depth);
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

                if (room.hasInn() && !InRoom(room, pos) && this.player.knowsAbout(roomPos)) //or if inn has been visited we always show it.
                {
                    cell.addClass("innLoc");
                }

                if (room.hasStairsDown() && !InRoom(room, pos) && this.player.knowsAbout(roomPos)) //or if inn has been visited we always show it.
                {
                    cell.addClass("stairsdown");
                }

                if (room.hasStairsUp() && !InRoom(room, pos) && this.player.knowsAbout(roomPos)) //or if inn has been visited we always show it.
                {
                    cell.addClass("stairsup");
                }

                cell.append($("<span>" + col + "," + row + "</span>"));
            }
        }
        //after grid has been rendered.
        var northRoom = new Room(pos.x, pos.y - 1, pos.z);
        northRoom.dir = "north";
        var eastRoom = new Room(pos.x + 1, pos.y, pos.z);
        eastRoom.dir = "east";
        var southRoom = new Room(pos.x, pos.y + 1, pos.z);
        southRoom.dir = "south";
        var westRoom = new Room(pos.x - 1, pos.y, pos.z);
        westRoom.dir = "west";

        var adjacentRooms = [northRoom, southRoom, eastRoom, westRoom];
        for(var i = 0;i<adjacentRooms.length;i++) {
            var room = adjacentRooms[i];
            var knownRoom = this.player.hasRoomInfo(room.getPosition());
            if (!knownRoom && room.hasInn() && d00() <= this.config.percentChanceToFindInns)
            {
                this.console("You hear the sounds of merriment to the "+room.dir+"...it could be an <span class='gold'>inn</span>.");
                this.player.roomInfoKnown.push(room.getPosition());
                $(".x" + room.x + "y" + room.y).addClass("innLoc");
                this.awardExperienceForDiscovery(this.player, this.discoveryType.inn, room.z + 1);
            }
            if (!knownRoom && room.hasStairsDown() && d00() <= this.config.percentChanceToFindStairsDown)
            {
                this.console("<span class='gold'>You hear a strange echo to the "+room.dir+"...Could it be a way down deeper into the dungeon?</span>");
                this.player.roomInfoKnown.push(room.getPosition());
                $(".x" + room.x + "y" + room.y).addClass("stairsdown");
                this.awardExperienceForDiscovery(this.player, this.discoveryType.stairsdown, room.z + 1); //You currently only get exp for finding them from a distance.
            }
            if (!knownRoom && room.hasStairsUp() && d00() <= this.config.percentChanceToFindStairsUp)
            {
                this.console("<span class='gold'>You saw a strange light to the "+room.dir+"...Could it be a way back up?</span>");
                this.player.roomInfoKnown.push(room.getPosition());
                $(".x" + room.x + "y" + room.y).addClass("stairsup");
                this.awardExperienceForDiscovery(this.player, this.discoveryType.stairsup, room.z + 1);
            }
        }
    };

    this.init();
}  