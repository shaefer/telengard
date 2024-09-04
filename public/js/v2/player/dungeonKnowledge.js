const learnAboutTheDungeon = () => {
    //knowledge of features on the floor?
    //nearest feature? specifically inns
    discoverNearestInn();
}

const discoverNearestInn = (position) => {
    //spiral search from position? efficient
    //just get all inns positions from the floor and compare distance. 
    const rooms = gameState.dungeonStats[position.z].dungeonRooms;
    const inns = rooms.filter(x => x.inn);
    console.log("Comparing against " + position.x + "," + position.y);
    inns.forEach(i => {
        const xDistance = i.x - position.x;
        const yDistance = i.y - position.y;

        console.log("This inn is at " + i.x +","+i.y+". It is " + xDistance + " steps east/west and " + yDistance + " north/south." + "total: " + (Math.abs(xDistance) + Math.abs(yDistance)));
    });
}