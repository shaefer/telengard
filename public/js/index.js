$(document).ready(init);
function init() {
    console.warn('init');
    var app = new Telengard();
    var start = new Date();
    app.render(app.currentPosition,app.currentLevel,app.viewRadius);
    var end = new Date();
    console.warn('Time to draw: ' + (end.getTime() - start.getTime()) + "ms");
}

function GetIdChar(rand, index) {
    console.warn("Index for GetIdChar: " + index);
    return Number(rand.toString().substring(index, index + 1));
}

Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
}

function toTimestamp(d) {
    var dformat = [
    (d.getMonth()+1).padLeft(),
    d.getDate().padLeft(),
    d.getFullYear()].join('/')+
    ' ' +
    [d.getHours().padLeft(),
    d.getMinutes().padLeft(),
    d.getSeconds().padLeft()].join(':');
    return dformat;
}

