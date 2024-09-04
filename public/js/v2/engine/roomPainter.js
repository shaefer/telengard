function paintRoom(dungeonRoom, square) {
    if (dungeonRoom.oob) {
        square.classList.add('oob');
        return;
    }
    if (dungeonRoom.westWall.wallExists) {
        square.classList.add('westWall');
    }
    if (dungeonRoom.eastWall.wallExists) {
        square.classList.add('eastWall');
    }
    if (dungeonRoom.southWall.wallExists) {
        square.classList.add('southWall');
    }
    if (dungeonRoom.northWall.wallExists) {
        square.classList.add('northWall');
    }

    square.classList.add('id' + dungeonRoom.id);
    square.classList.add('fid' + dungeonRoom.featureId);

    if (gameConfig.showFeatures) {
        if (dungeonRoom.inn) {
            square.classList.add('inn');
        }
        if (dungeonRoom.throne) square.classList.add('throne');
        if (dungeonRoom.fountain) square.classList.add('fountain');
        if (dungeonRoom.current) square.classList.add('current');
        if (dungeonRoom.stairsDown) square.classList.add('stairsDown');
        if (dungeonRoom.stairsUp) square.classList.add('stairsUp');
    }
}