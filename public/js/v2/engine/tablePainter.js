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
    const responsiveTableGrid = document.createElement('div');
    responsiveTableGrid.classList.add('responsiveTableGrid');
    const tableGridContainer = document.createElement('div');
    tableGridContainer.classList.add('tableGridContainer');
    const gridTable = document.createElement('table');
    gridTable.id = 'gridTable';
    responsiveTableGrid.appendChild(tableGridContainer);
    tableGridContainer.appendChild(gridTable);
    document.getElementById('mainArea').appendChild(responsiveTableGrid);
    return {tableGridContainer, gridTable};
}

function drawDungeonAroundSquare(position) {
    
    const dungeonLevel = document.getElementById('mainArea');
    dungeonLevel.textContent = '';

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
            oImg.setAttribute('src', 'images/opengameart/mermaid_pool_animation.gif');
        oImg.style.position = 'absolute';
        oImg.style.top = '-50%';
        oImg.style.left = '-50%';
        oImg.setAttribute('width', (square.style.width + 'px')); //size has to be variable since the whole grid is responsive.

    square.appendChild(oImg);
}

function displayPlayer(position) {
    console.log("displaying player at: " + position.x + "-" + position.y + "-" + position.z);
    const num = ''+position.x+'-'+position.y+'-'+position.z;
    const squareId = 'square'+num;
    const square = document.getElementById(squareId);
    var oImg = document.createElement("img");
        oImg.setAttribute('src', 'images/barbarian.png'); //164 x 300
        oImg.setAttribute('width', parseInt(square.style.width, 10) * 164 / 300) + 'px'; //size has to be variable since the whole grid is responsive.

    square.appendChild(oImg);
}

let debouncedTableAdjust = _.debounce(function adjustTableGrid() {
    drawDungeonAroundSquare(gameState.position);
    displayPlayer(gameState.position);
}, 500);


//adjustTableGrid();

//onload
window.addEventListener("resize", debouncedTableAdjust);