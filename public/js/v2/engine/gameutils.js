function GetIdChar(id, index) {
    return Number(id.toString().substring(index, index + 1));
}

function GetIdCharPair(id, index) {
    return Number(id.toString().substring(index, index + 2));
}

function buildDungeonLevelStats(z) {
    const dungeonRooms = [];
    let innCount = 0;
    let fountainCount = 0;
    let throneCount = 0;
    let stairsDownCount = 0;
    let stairsUpCount = 0;

    const dungeonLevel = new DungeonLevel(z);
    for(let i = 0;i<=dungeonLevel.floorWidth-1;i++) {
        for(let j = 0;j<=dungeonLevel.floorHeight-1;j++) {
            const thisRoom = new DungeonRoom(i, j, z);
            dungeonRooms.push(thisRoom);
            if (thisRoom.inn) innCount++;
            if (thisRoom.fountain) fountainCount++;
            if (thisRoom.throne) throneCount++;
            if (thisRoom.stairsDown) stairsDownCount++;
            if (thisRoom.stairsUp) stairsUpCount++;
        }
    }
    return {dungeonRooms, innCount, fountainCount, throneCount, stairsDownCount, stairsUpCount};
}