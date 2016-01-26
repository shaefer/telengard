function GetIdChar(rand, index) {
    return Number(rand.toString().substring(index, index + 1));
}

function GetIdCharPair(rand, index) {
    return Number(rand.toString().substring(index, index + 2));
}

Number.prototype.inRange = function(from, to) {
    return this >= from && this <= to;
}
Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
}

function isObject(object) {
    return object instanceof Object;
}

function isFunction(object) {
   return typeof(object) === 'function';
}

function isNumber(object) {
    return typeof(object) === 'number'
}

function FindRoomsWithOnLevel(level, check) {
    var dungeonLevel = new DungeonLevel(level);
    var width = dungeonLevel.width;
    var height = dungeonLevel.height;
    var counter = 0;
    var rooms = [];
    for (var w = 0;w<width;w++) {
        for (var h = 0;h<height;h++) {
            var room = new Room(w, h, level);
            if (room[check]())
            {
                console.warn(room.toString());
                counter++;
                rooms.push(room);
            }
        }
    }
    console.warn(counter + " rooms with " + check + " on level " + level);
    return rooms;
}

function FindRoomsWith(check) {
    FindRoomsWithOnLevel(0, check);
}



function toTimestamp(d) {
    var dformat = 
    //(d.getMonth()+1).padLeft(),
    //d.getDate().padLeft(),
    //d.getFullYear()].join('/')+
    //' ' +
    [d.getHours().padLeft(),
    d.getMinutes().padLeft(),
    d.getSeconds().padLeft()].join(':');
    return dformat;
}

function GetRandomItemFromArray(array) {
    Math.seedrandom();
    return array[Math.floor(Math.random() * array.length)];
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