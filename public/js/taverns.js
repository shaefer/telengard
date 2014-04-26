var desc = ["Fearsome", "Vengeful", "Bald", "Fat", "Thin", "Hungry", "Thirsty", "Ravenous", "Starving", "Portly", "Quiet", "Noisy", "Loud", "Silent", "Penitent", "Injured", "Limping", "Bloody", "Bleeding", "Thoughtful", "Murderous", "Dead", "Blind", "Mysterious", "Arcane", "All-seeing", "Transcendent", "Drunken", "Hammered", "Feasting", "Greedy", "Stingy", "Jolly", "Happy", "Smiling", "Frowning", "Contemptuous", "Jovial", "Ill-tempered", "Vicious", "Lecherous", "Burly", "Cross-eyed", "One-eyed", "Red-eyed", "Toothless", "Tattooed", "Scarred", "Pierced", "Lone", "Howling", "Grappling", "Wretched", "Beloved", "Cantankerous", "Crafty", "Salty", "Shifty"];
var ppl = ["Dwarf", "Elf", "Giant", "Halfing", "Knight", "Pirate", "Slave", "King", "Queen", "Prince", "Princess", "Barbarian", "Bard", "Cleric", "Priest", "Druid", "Sorcerer", "Wizard", "Warrior", "Thief", "Rogue", "Cutpurse", "Mage", "Ranger", "Wench", "Maid", "Butler", "Urchin", "Champion", "Hero", "Vagrant", "Shadow", "Assassin"];
var colors = ["Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Violet", "Brown", "Black", "White", "Gray", "Golden", "Silver", "Crimson", "Emerald", "Ruby", "Silver", "Turquoise"];
var emotions = ["Pensive", "Laughing", "Yelling", "Smoking", "Angry", "Flaming", "Drunken", "Flying", "Lost", "Sleeping", "Frowning", "Smiling", "Grinning", "Chuckling", "Roaring", "Cursing", "Buxom", "Busty"];
var materials = ["Ivory", "Ebon", "Stone", "Wooden", "Alabaster", "Turquoise", "Glass", "Ceramic", "Crystal", "Emerald", "Diamond", "Amethyst", "Jade", "Ruby", "Gleaming", "Sparkling"];
var dwelling = ["Den", "Cage", "Lair", "Cave", "Alcove", "Nest", "Fen", "Rest", "Hut", "Bog", "Swamp", "Portal", "Plane"];
var things = ["Flame", "Sand", "Sun", "Moon", "Stars", "Silence", "Shadow", "Wind", "Sword", "Spear", "Whisper", "Cask"];
var animals = ["Orc", "Ogre", "Hawk", "Troll", "Bear", "Dragon", "Goblin", "Snake", "Squirrel", "Wolf", "Unicorn", "Hag", "Toad", "Nymph", "Fairy", "Sprite", "Kraken", "Minotaur", "Serpent", "Hydra"];
var items_tv = ["Blade", "Mug", "Plow", "Wagon", "Fist", "Dagger", "Diamond", "Tankard", "Keg"];
var innTypes = ["Inn", "Tavern", "Alehouse", "Rest", "Bar", "Dive", "Drinkery", "Gin mill", "Grog Shop", "Lodge", "Pub", "Roadhouse", "Saloon", "Speakeasy", "Taphouse", "Taproom", "Watering hole", "Cottage", "Chalet", "Hostel", "Refuge", "Den", "Shelter"];

var tavern_templates = [{pattern:"The Material Animal", fn:function(){return the() + tLookup(materials) + " " + tLookup(animals) + apos() + " " + tLookup(innTypes);}},
                        {pattern:"The Color Animal",fn:function(){return the() + tLookup(colors) + " " + tLookup(animals) + apos() + " " + tLookup(innTypes);}},
                        {pattern:"The Emotion Animal",fn:function(){return the() + tLookup(emotions) + " " + tLookup(animals) + apos() + " " + tLookup(innTypes);}},
                        {pattern:"The Emotion Person",fn:function(){return the() + tLookup(emotions) + " " + tLookup(ppl) + apos() + " " + tLookup(innTypes);}},
                        {pattern:"The Person & Animal",fn:function(){return tavernWrap( tLookup(ppl) + " & " + tLookup(animals) );}},
                        {pattern:"The Animal's Dwelling",fn:function(){return "The " + tLookup(animals) + "'s " + tLookup(dwelling);}},
                        {pattern:"The Animal & Animal",fn:function(){return tavernWrap(tLookup(animals) + " & " + tLookup(animals));}},
                        {pattern:"The Thing & Thing",fn:function(){return tavernWrap( tLookup(things) + " & " + tLookup(things) );}},
                        {pattern:"The Material Item",fn:function(){return tavernWrap(tLookup(materials) + " " + tLookup(items_tv), true);}},
                        {pattern:"The Material Dwelling",fn:function(){return "The " + tLookup(materials) + " " + tLookup(dwelling);}},
                        {pattern:"The Emotion Item",fn:function(){return the() + tLookup(emotions) + " " + tLookup(items_tv) + innType();}},
                        {pattern:"The Color Item",fn:function(){return tavernWrap(tLookup(colors) + " " + tLookup(items_tv), true);}},
                        {pattern:"The Color Thing",fn:function(){return tavernWrap(tLookup(colors) + " " + tLookup(things), true);}},
                        {pattern:"The Descriptor Animal",fn:function(){return the() + tLookup(desc) + " " + tLookup(animals) + apos() + " " + tLookup(innTypes);}},
                        {pattern:"The Descriptor People",fn:function(){return the() + tLookup(desc) + " " + tLookup(ppl) + apos() + " " + tLookup(innTypes);}}];

function GetTavernName(seed) {
	if (seed)
		Math.seedrandom(seed);
	var templateInt = random(tavern_templates.length);
	var template = tavern_templates[templateInt];
	return template.fn();
}

function generateTavernName(num)
{
		!num ? num = 1 : Math.min(num, 100);
		
		var results = [];
		for(var i = 0;i<num;i++)
		{
			var templateInt = random(tavern_templates.length);
			var template = tavern_templates[templateInt];
			results.push(template.fn());
		}
		return results;
};

function tavernWrap(name, own)
{
	var pos = "";
	if (own)
		pos = apos();
	var type = random(3);
	if (type == 0)
		return "The " + name;
	if (type == 1)
		return "The " + name + innType(pos);
	else
		return name + pos + " " + tLookup(innTypes);
}

function the()
{
	if (randomBoolean())
		return "The ";
	return "";
}

function innType(apos)
{
	var text = "";
	if (apos)
		text = apos;
	if (randomBoolean())
		return text + " " + tLookup(innTypes);
	return "";
}

function apos()
{
	var possessive = randomBoolean();
	var apos = possessive ? "'s" : "";
	return apos;
}

function tLookup(cat)
{
	return cat[random(cat.length)];
}

function random(x, seed)
{
	return Math.floor(Math.random()*x); 
};

function randomBoolean()
{
	return random(2) - 1;
};