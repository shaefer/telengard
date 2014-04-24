$(document).ready(init);
function init() {
    console.warn('init');
    var app = new Telengard();
    app.startGame();
    app.improveWeapon();
}