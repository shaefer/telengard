

function updateGameAndDisplay(newPosition) {
    drawDungeonAroundSquare(newPosition);
    drawRoomObjects(newPosition);
    displayPlayer(newPosition);
    gameState.position = newPosition;
}
//TODO: Handle swiping: https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
//TODO: if processing or its too soon to process a nothing happening. If the last action was less than 10 seconds ago then we don't have a "no-action" event occur. 
function nextTickOrAction(action) {
    if (!processing) {
        processing = action;
        console.log('Something happens');
        if (!action) {
            const now = new Date();
            const secondsSinceLastAction = (now - lastActionCompleted)/1000; 
            console.log('nothing was done so time continues on regardless. It has been ' + secondsSinceLastAction + ' seconds since the last action.');
            if (secondsSinceLastAction > (tickSeconds - 0.5)) {
                console.log("Random event might happen due to inactivity");
            }
        } else {
            console.log('processing action: ' + action);
            if (action == 'ArrowRight') {
                const newPosition = {x:gameState.position.x + 1, y:gameState.position.y, z:gameState.position.z};
                const currentRoom = new DungeonRoom(gameState.position.x, gameState.position.y, gameState.position.z);
                if (!currentRoom.eastWall.wallExists) {
                    updateGameAndDisplay(newPosition);
                } else {
                    console.log("Can't walk through walls.");
                }
               
            }
            if (action == 'ArrowLeft') {
                const newPosition = {x:gameState.position.x-1, y:gameState.position.y, z:gameState.position.z};
                const currentRoom = new DungeonRoom(gameState.position.x, gameState.position.y, gameState.position.z);
                if (!currentRoom.westWall.wallExists) {
                    updateGameAndDisplay(newPosition);
                } else {
                    console.log("Can't walk through walls.");
                }
            }
            if (action == 'ArrowUp') {
                const newPosition = {x:gameState.position.x, y:gameState.position.y-1, z:gameState.position.z};
                const currentRoom = new DungeonRoom(gameState.position.x, gameState.position.y, gameState.position.z);
                if (!currentRoom.northWall.wallExists) {
                    updateGameAndDisplay(newPosition);
                } else {
                    console.log("Can't walk through walls.");
                }
            }
            if (action == 'ArrowDown') {
                const newPosition = {x:gameState.position.x, y:gameState.position.y+1, z:gameState.position.z};
                const currentRoom = new DungeonRoom(gameState.position.x, gameState.position.y, gameState.position.z);
                if (!currentRoom.southWall.wallExists) {
                    updateGameAndDisplay(newPosition);
                } else {
                    console.log("Can't walk through walls.");
                }
            }
        }

        //processing everything can take as long as we like before setting up the next tick 
        processing = false;
        lastActionCompleted = new Date();
        //setTimeout(function() {nextTickOrAction(false)}, 10000); //TODO: maybe before running the gameloop we do a bit in this function to display the countdown to the next Tick. https://www.w3schools.com/howto/howto_js_countdown.asp
    } else {
        console.log('tick skipped as we are still processing an action.');
    }
}

function startGame() {
    //TODO: Determine the proper starting square based on options/config.
    const startPosition = {x:3,y:3,z:0};
    updateGameAndDisplay(startPosition);
    //start game loop
    setInterval(function() {nextTickOrAction(false)}, tickSeconds * 1000);
    nextTickOrAction("Entering the Dungeon");
    listenForInput(); //from playerActionListener.js
}
