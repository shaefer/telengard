//display start screen
    //start game loop
    //options
    //stats

function setupStartScreenEffects() {
    document.getElementById('startButton')
}

function startButtonPress() {
    playSwordSound();
    const titleScreen = document.getElementById('titleScreen');
        //titleScreen.style.display="none";
        titleScreen.classList.toggle('fadeOut');
    document.getElementById('buttonScreen').style.display="none";

    startGame(); //This is from gameloop.js (Figure out better way to have the engine controls available in the right way. );
}

function optionButtonPress() {
    playSwordSound();
    document.getElementById('buttonScreen').style.display="none";
    const titleScreen = document.getElementById('titleScreen');
        //titleScreen.style.display="none";
        titleScreen.classList.toggle('blur');
}



