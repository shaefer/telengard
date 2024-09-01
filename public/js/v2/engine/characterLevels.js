const experienceForNextLevel = (currentLevel) => {
    const scaled = ((currentLevel - 1) * 25) * currentLevel;
    return (100 * currentLevel) + scaled;  //100, 250, 450, 700, 1000
}
//100, 200, 300, 400, 500
//100, 250, 450, 700, 1000
//0,   50,  150, 300,  500