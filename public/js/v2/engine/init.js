//display start screen
    //start game loop
    //options
    //stats

function playAudio(url) {
    new Audio(url).play();
}

function setupStartScreenEffects() {
    document.getElementById('startButton')
}

function startButtonPress() {
    playAudio('audio/v2/sword.mp3');
    const titleScreen = document.getElementById('titleScreen');
        //titleScreen.style.display="none";
        titleScreen.classList.toggle('fadeOut');
    document.getElementById('buttonScreen').style.display="none";

    startGame(); //This is from gameloop.js (Figure out better way to have the engine controls available in the right way. );
}

function optionButtonPress() {
    playAudio('audio/v2/sword.mp3');
    document.getElementById('buttonScreen').style.display="none";
    const titleScreen = document.getElementById('titleScreen');
        //titleScreen.style.display="none";
        titleScreen.classList.toggle('blur');
}



