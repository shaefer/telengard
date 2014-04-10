function PlayerCharacter() {
	Math.seedrandom(new Date().getTime());
    var rand = Math.random().toString().substring(2);
    var r = 0;
    this.id = rand;

    this.level = 1;

    this.hp = 20 + GetIdChar(rand, r++);
    this.mp = 5 + GetIdChar(rand, r++)/2;

    this.strength = 10 + GetIdChar(rand, r++)/2;
    this.intelligence = 10 + GetIdChar(rand, r++)/2;
    this.agility = 10 + GetIdChar(rand, r++)/2;

    this.luck = 0 + GetIdChar(rand, r++)/2;
    this.prowess = 0 + GetIdChar(rand, r++)/2;

	/** Half of luck plus prowess = Level 1 has: 0 - 6.75% chance of crit**/
    this.critPercent = (this.luck/2) + (this.prowess/1);

    this.exp = 0;

    this.toDisplay = function() {
    	return prettyPrint(this);
    };
}
PlayerCharacter.prototype.toString = function() {
	return "HP: " + this.hp + " STR: " + this.strength + " ID: " + this.id;
}

function prettyPrint(obj){
    var toString = Object.prototype.toString,
        newLine = "<br>", space = "&nbsp;", tab = 8,
        buffer = "",        
        //Second argument is indent
        indent = arguments[1] || 0,
        //For better performance, Cache indentStr for a given indent.
        indentStr = (function(n){
            var str = "";
            while(n--){
                str += space;
            }
            return str;
        })(indent); 
 
    if(!obj || ( typeof obj != "object" && typeof obj!= "function" )){
        //any non-object ( Boolean, String, Number), null, undefined, NaN
        buffer += obj;
    }else if(toString.call(obj) == "[object Date]"){
        buffer += "[Date] " + obj;
    }else if(toString.call(obj) == "[object RegExp"){
        buffer += "[RegExp] " + obj;
    }else if(toString.call(obj) == "[object Function]"){
        buffer += "[Function] " + obj;
    }else if(toString.call(obj) == "[object Array]"){
        var idx = 0, len = obj.length;
        buffer += "["+newLine;
        while(idx < len){
            buffer += [
                indentStr, idx, ": ", 
                prettyPrint(obj[idx], indent + tab)
            ].join("");
            buffer += "<br>";
            idx++;
        }
        buffer += indentStr + "]";
    }else { //Handle Object
        var prop;
        buffer += "{"+newLine;
        for(prop in obj){
            buffer += [
                indentStr, prop, ": ", 
                prettyPrint(obj[prop], indent + tab)
            ].join("");
            buffer += newLine;
        }
        buffer += indentStr + "}";
    }
 
    return buffer;
}