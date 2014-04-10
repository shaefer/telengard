$(document).ready(init);
function init() {
    console.warn('init');
    var app = new Telengard();
    var start = new Date();
    app.render(app.currentPosition,app.currentLevel,app.viewRadius);
    var end = new Date();
    console.warn('Time to draw: ' + (end.getTime() - start.getTime()) + "ms");
}