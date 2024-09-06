const paintWallsForRow = (dungeonRoom, row, squareSize) => {
    const square = row.insertCell(-1);
    const num = ''+dungeonRoom.x+'-'+dungeonRoom.y+'-'+dungeonRoom.z;
        square.id = 'square'+num;
    const dungeonLevel = document.getElementById('dungeonLevel');
    //console.log(square);
    square.style.width = squareSize + "px";
    square.style.height = squareSize + "px";
    square.style.position = 'relative'; //setup for other images to get positioned relative to this square.

    paintRoom(dungeonRoom, square);
}

{/* <div class="responsiveTableGrid">
    <div class="tableGridContainer">
        <table id="gridTable">
            <tbody>
                <tr>
                    <td>SOME TABULAR DATA</td>
                </tr>
            </tbody>
        </table>
    </div>
</div> */}

function createBaseTable() {
    const tableGridContainer = document.getElementById('tableGridContainer');
    //tableGridContainer.textContent = ''; //erases table content
    const origTable = document.getElementById('gridTable');
    if (origTable)
        tableGridContainer.removeChild(origTable);
    const gridTable = document.createElement('table');
    gridTable.id = 'gridTable';

    tableGridContainer.insertBefore(gridTable, tableGridContainer.childNodes[1]);

    return {tableGridContainer, gridTable};
}

function drawDungeonAroundSquare(position) {
    const {tableGridContainer:tableContainer, gridTable:table} = createBaseTable();

    const width = tableContainer.offsetWidth;
    const height = tableContainer.offsetHeight;

    console.log("container w:" + width + " h:" + height);
    const smallerDimension = (width < height) ? width : height;
    const squareSize = (smallerDimension / dungeonViewSize) - (dungeonViewSize * 2);

    table.style.maxWidth = smallerDimension+"px";


    for(let i = 0;i<=dungeonViewSize-1;i++) {
        const row = table.insertRow(-1);
        row.id = "row" + (position.y+i - ((dungeonViewSize - 1)/2));
        for(let j = 0;j<=dungeonViewSize-1;j++) {
            //find top left box and then this just works
            //top left box == current square - (dungeonViewSize - 1) / 2 for both x and y.
            const thisRoom = new DungeonRoom(
                j + position.x - ((dungeonViewSize - 1)/2), 
                i + position.y - ((dungeonViewSize - 1)/2), 
                position.z);

            if (thisRoom.x == position.x && thisRoom.y == position.y && thisRoom.z == position.z) {
                thisRoom.current = true;
            }
            //console.log(thisRoom);
            paintWallsForRow(thisRoom, row, squareSize);
            // if (RoomKey(thisRoom.x,thisRoom.y,thisRoom.z) in gameState.roomsVisited) {
            //     drawRoomObjects({x:thisRoom.x, y:thisRoom.y, z:thisRoom.z});
            // }
        }
    }
}

function drawRoomObjects(position) {
    const num = ''+position.x+'-'+position.y+'-'+position.z;
    const squareId = 'square'+num;
    const square = document.getElementById(squareId);
    const room = new DungeonRoom(position.x, position.y, position.z);
    var oImg = document.createElement("img");
        if (room.inn)
            oImg.setAttribute('src', 'images/v2/inn.png'); 
        else if (room.throne)
            oImg.setAttribute('src', 'images/v2/throne2.png')
        else if (room.fountain)
            oImg.setAttribute('src', 'images/v2/fountain.png');
        else if (room.stairsDown)
            oImg.setAttribute('src', 'images/v2/stairsdown.png');
        else if (room.stairsUp)
            oImg.setAttribute('src', 'images/v2/stairsup.png');
        else if (room.huntersGuild)
            oImg.setAttribute('src', 'images/v2/huntersguild.png');
        oImg.style.position = 'absolute';
        oImg.style.top = '-50%';
        oImg.style.left = '-50%';
        oImg.setAttribute('width', (square.style.width + 'px')); //size has to be variable since the whole grid is responsive.

    square.appendChild(oImg);
}

function drawEnemy(position, enemy) {
    const num = ''+position.x+'-'+position.y+'-'+position.z;
    const squareId = 'square'+num;
    const square = document.getElementById(squareId);

    var oImg = document.createElement("img");
        oImg.setAttribute('src', enemy.imgSrc); 
        oImg.style.position = 'absolute';
        oImg.style.top = '-50%';
        oImg.style.left = '-50%';
        const size = new Number(square.offsetWidth) * enemy.size;
        console.log("MONSTER SIZE: " + size);
        console.log(square.offsetWidth, enemy.size)

        oImg.setAttribute('width', (size + 'px')); //size has to be variable since the whole grid is responsive.

    square.appendChild(oImg);
}

function drawOptions(position, options = gameState.options) {
    const num = ''+position.x+'-'+position.y+'-'+position.z;
    const squareId = 'square'+num;
    const square = document.getElementById(squareId);
    const playerOptions = document.getElementById('playerOptions');
    if (playerOptions) {
        playerOptions.parentNode.removeChild(playerOptions);
    }

    if (options) {
        var oImg = document.createElement("div");
            oImg.id = 'playerOptions'
            oImg.style.position = 'absolute';
            oImg.style.bottom = '-25%';
            oImg.style.left = '-50%';
            oImg.style.padding = '5px';
            oImg.style.backgroundColor = 'white';
            oImg.style.color = 'black';
            oImg.style.width = '200%'; //size has to be variable since the whole grid is responsive.
            const span = document.createElement('span');
            span.innerHTML = options || '';
            oImg.appendChild(span);

        square.appendChild(oImg);
    }
}

function displayLog() {
    console.log("displaying logs");
    const logContainer = document.getElementById('log');
    logContainer.textContent = '';
    //const last10Logs = gameState.log.reverse().slice(0, 10); 
    //console.log(gameState.log)
    gameState.log.slice().reverse().forEach(x => {
        const div = document.createElement('div');
        const formattedDate = x.time.toLocaleString('en-US', { timeZoneName: 'short' });
        const span = document.createElement('span');
        span.innerHTML = (x.message + " [<span class='logType'>" + x.type + "</span>](<span class='logDate'>" +formattedDate+"</span>)");
        div.appendChild(span);
        logContainer.appendChild(div);
    })
}

function statDisplay(label, data) {
    const floorDiv = document.createElement('div');
    floorDiv.innerHTML = "<span>"+label+": </span><span>" + data + "</span>";
    return floorDiv;
}

function displayPlayerStats() {
    const playerInfo = document.getElementById('playerInfo');
    playerInfo.textContent = '';

    playerInfo.appendChild(statDisplay("LEVEL", gameState.level + " " + gameState.class));

    playerInfo.appendChild(statDisplay("HP", gameState.hp + "/" + gameState.maxHp));

    playerInfo.appendChild(statDisplay("EXP", gameState.exp + "/" + experienceForNextLevel(gameState.level)));

    playerInfo.appendChild(statDisplay("FIRE RESIST", gameState.fireResist));

    const bonusStr = (gameState.strBonus) ? "(" + (gameState.strBonus + gameState.str) + ")" : "";
    playerInfo.appendChild(statDisplay("STR", gameState.str + " " + bonusStr));

    playerInfo.appendChild(statDisplay("FLOOR", gameState.position.z));

    playerInfo.appendChild(statDisplay("GOLD", gameState.gold));

    if (gameState.dungeonKnowledge[gameState.position.z]) {
        playerInfo.appendChild(statDisplay("STAIRS DOWN", gameState.dungeonStats[gameState.position.z].stairsDownCount));
        playerInfo.appendChild(statDisplay("STAIRS UP", gameState.dungeonStats[gameState.position.z].stairsUpCount));
        playerInfo.appendChild(statDisplay("INNS", gameState.dungeonStats[gameState.position.z].innCount));
        playerInfo.appendChild(statDisplay("FOUNTAINS", gameState.dungeonStats[gameState.position.z].fountainCount));
        playerInfo.appendChild(statDisplay("THRONES", gameState.dungeonStats[gameState.position.z].throneCount));
        playerInfo.appendChild(statDisplay("HUNTERSGUILD", gameState.dungeonStats[gameState.position.z].huntersGuildCount));
    }


    playerInfo.appendChild(statDisplay("EVENT", gameState.currentEvent || ''));
}

function displayPlayer(position) {
    console.log("displaying player at: " + position.x + "-" + position.y + "-" + position.z);
    const num = ''+position.x+'-'+position.y+'-'+position.z;
    const squareId = 'square'+num;
    const square = document.getElementById(squareId);
    var oImg = document.createElement("img");
    if (gameState.gender == 'm')
        oImg.setAttribute('src', 'images/v2/characters/barbarian_m.png'); //164 x 300
    if (gameState.gender == 'f')
        oImg.setAttribute('src', 'images/v2/characters/barbarian_f.png')
        oImg.style.width = (parseInt(square.style.width, 10) * 164 / 300) * 1.33 + 'px'; //size has to be variable since the whole grid is responsive.

    square.appendChild(oImg);

    displayPlayerStats();
}

function drawSpecialEventAndFade(eventImg, eventTime) {
    const specialEventDiv = document.getElementById('specialEvent');
    specialEventDiv.textContent = '';
    specialEventDiv.classList.add("specialEvent")

    const oImg = document.createElement("img");
    oImg.setAttribute('src', eventImg);
    oImg.setAttribute('width', '75%');

    specialEventDiv.appendChild(oImg);
    setTimeout(function() {
        specialEventDiv.textContent = '';
    }, eventTime);
}

function displayCharacterMenu(maintainVisibility = false) {
    const characterOptions = document.getElementById('characterOptions');
    characterOptions.textContent = '';

    const labelDiv = document.createElement('div');
    labelDiv.classList.add('windowTitle');
    labelDiv.innerHTML = '<span>Character Options</span>';
    characterOptions.appendChild(labelDiv);

    const beSafeDiv = document.createElement('div');
    if (gameState.beSafe) {
        beSafeDiv.innerHTML = "[<span class='logOption'>B</span>]e Risky: You are currently being <span class='logPlayerGood'>safe</span>."
    } else {
        beSafeDiv.innerHTML = "[<span class='logOption'>B</span>]e Safe: You are currently being <span class='logPlayerBad'>risky</span>."
    }
    characterOptions.appendChild(beSafeDiv);

    console.log(gameState.skills)
    console.log(gameState.skills.find(x => x.name == 'Stealth'))
    if (gameState.skills.find(x => x.name == 'Stealth')) {
        const stealthDiv = document.createElement('div');
        //TODO: Add style for when the answer is true vs. false. 
        stealthDiv.innerHTML = "[<span class='logOption'>S</span>]tealth active: " + gameState.stealth;
        characterOptions.appendChild(stealthDiv);
    }

    if (gameState.skills.find(x => x.name == 'Big Game Hunter')) {
        const hunterDiv = document.createElement('div');
        hunterDiv.innerHTML = "[<span class='logOption'>H</span>]unt a creature: " + gameState.bigGameHunter;
        //TODO: add selection from defeated monsters.
        characterOptions.appendChild(hunterDiv);
    }
    
    
    if (!maintainVisibility) characterOptions.style.display = 'inherit';
}

function hideCharacterMenu() {
    const characterOptions = document.getElementById('characterOptions');
    characterOptions.style.display = 'none';
}