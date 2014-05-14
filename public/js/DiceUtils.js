//added dependency on seedRandom
function DiceResult(numOfDice, sidesOfDice, modifier, total, individualDice)
{
	this.numOfDice = numOfDice;
	this.sidesOfDice = sidesOfDice;
	this.modifier = modifier;
	this.total = total;
	this.individualDice = individualDice;
};
DiceResult.prototype.toString = function(){
	var modStr = "";
	var wModStr = "";
	if (this.modifier != 0)
	{
		modStr = this.modifier > 0 ? ("+" + this.modifier) : this.modifier;
		wModStr = " [" + modStr + "]";
	}
	return ("<span class='diceResultString'><span class='diceResultTotal'>" + this.total + "</span> (" + this.numOfDice + "D" + this.sidesOfDice + modStr + " -> " + this.individualDice.join(",") + ")</span>");
};
DiceUtils = {};
function diceComp (s, m, n, f, a) {
	Math.seedrandom(new Date().getTime());
    m = parseInt( m );
    if( isNaN( m ) ) m = 1;
    n = parseInt( n );
    if( isNaN( n ) ) n = 1;
    f = parseInt( f );
    a = typeof(a) == 'string' ? parseInt( a.replace(/\s/g, '') ) : 0;
    if( isNaN( a ) ) a = 0;
    var r = 0;
    var dice = [];
    for( var i=0; i<n; i++ )
    {
        var currentDie = (Math.floor( Math.random() * f ) + 1);
        dice.push(currentDie);
        r += currentDie;
    }
    return {total:r * m + a, individualDice:dice, modifier:a};
};
DiceUtils.parseDice = function( de ) {
    return diceComp.apply( this, de.match(/(?:(\d+)\s*\*\s*)?(\d*)d(\d+)(?:\s*([\+\-]\s*\d+))?/i) );
};
DiceUtils.rollDropLowest = function(numOfDice, sidesOfDice, modifier)
{
	var result = DiceUtils.roll(numOfDice, sidesOfDice, modifier);
	if (numOfDice > 3)
	{
		var diceWithOriginalOrder = result.individualDice.concat([]);
		diceWithOriginalOrder.sort(function(a,b){return b-a;});
		var diceToDrop = diceWithOriginalOrder.slice(diceWithOriginalOrder.length-(numOfDice-3));
		var totalToDrop = 0;
		for(var i = 0;i<diceToDrop.length;i++)
		{
			totalToDrop += diceToDrop[i];
		}
		result.total = result.total - totalToDrop;
		result.diceDropped = diceToDrop;
		return result;
	}
	else
		return result;
};
DiceUtils.roll = function(numOfDice, sidesOfDice, modifier)
{
	Math.seedrandom();
	if (typeof numOfDice == 'string' && numOfDice.match(/[dD]/) != null)
		return DiceUtils.parseDice(numOfDice);
	else if (typeof numOfDice == 'string')
		numOfDice = numOfDice - 0;
	var dice = [], total = 0;
	for(var i = 0;i<numOfDice;i++)
	{
		var roll = Math.floor(Math.random() * sidesOfDice) + 1;
		dice.push(roll);
		total += roll;
	}
	if (!modifier)
		modifier = 0;
	else
		modifier = modifier - 0;
	total += modifier;
	return new DiceResult(numOfDice, sidesOfDice, modifier, total, dice);
};
DiceUtils.d2 = function(modifier)
{
    return DiceUtils.roll(1, 4, modifier);
};
DiceUtils.d3 = function(modifier)
{
    return DiceUtils.roll(1, 4, modifier);
};
DiceUtils.d4 = function(modifier)
{
	return DiceUtils.roll(1, 4, modifier);
};
DiceUtils.d6 = function(modifier)
{
	return DiceUtils.roll(1, 6, modifier);
};
DiceUtils.d8 = function(modifier)
{
	return DiceUtils.roll(1, 8, modifier);
};
DiceUtils.d10 = function(modifier)
{
	return DiceUtils.roll(1, 10, modifier);
};
DiceUtils.d12 = function(modifier)
{
	return DiceUtils.roll(1, 12, modifier);
};
DiceUtils.d20 = function(modifier)
{
	return DiceUtils.roll(1, 20, modifier);
};
DiceUtils.d100 = function(modifier)
{
	return DiceUtils.roll(1, 100, modifier);
};
DiceUtils.d1000 = function(modifier)
{
	return DiceUtils.roll(1, 1000, modifier);
};
DiceUtils.d10000 = function(modifier)
{
	return DiceUtils.roll(1, 10000, modifier);
};
d00 = function() {return DiceUtils.d100().total};
d000 = function() {return DiceUtils.d1000().total};
d0000 = function() {return DiceUtils.d10000().total};
DiceUtils.rollPercentile = function()
{
	return DiceUtils.roll(1, 100);
};
//http://avianey.blogspot.fr/2012/04/jquery-dice-plugin.html