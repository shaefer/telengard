const paintWallsForRow = (dungeonRoom, row, squareSize) => {
    const square = row.insertCell(-1);
    const num = ''+dungeonRoom.x+'-'+dungeonRoom.y+'-'+dungeonRoom.z;
        square.id = 'square'+num;
    const dungeonLevel = document.getElementById('dungeonLevel');
    //console.log(square);
    square.style.width = squareSize + "px";
    square.style.height = squareSize + "px";

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


    for(let i = 0;i<dungeonViewSize-1;i++) {
        const row = table.insertRow(-1);
        row.id = "row" + (position.y+i - ((dungeonViewSize - 1)/2));
        for(let j = 0;j<dungeonViewSize-1;j++) {
            //find top left box and then this just works
            //top left box == current square - (dungeonViewSize - 1) / 2 for both x and y.
            const thisRoom = new DungeonRoom(
                j + position.x - ((dungeonViewSize - 1)/2), 
                i + position.y - ((dungeonViewSize - 1)/2), 
                position.z);
            //console.log(thisRoom);
            paintWallsForRow(thisRoom, row, squareSize);
        }
    }
}

function displayPlayer(position) {
    console.log("displaying player at: " + position.x + "-" + position.y + "-" + position.z);
    const num = ''+position.x+'-'+position.y+'-'+position.z;
    const squareId = 'square'+num;
    var oImg = document.createElement("img");
        oImg.setAttribute('src', 'images/barbarian.png'); //164 x 300
        oImg.setAttribute('width', "22px");

    document.getElementById(squareId).appendChild(oImg);
}

let debouncedTableAdjust = _.debounce(function adjustTableGrid() {
    drawDungeonAroundSquare(gameState.position);
}, 500);


//adjustTableGrid();

//onload
window.addEventListener("resize", debouncedTableAdjust);