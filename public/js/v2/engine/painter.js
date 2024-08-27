const paintWalls = (dungeonRoom) => {
    const square = document.createElement('div');
    const num = ''+dungeonRoom.x+'-'+dungeonRoom.y+'-'+dungeonRoom.z;
        square.id = 'square'+num;
        square.classList.add('square');
        //square.appendChild(document.createTextNode(num))
    const dungeonLevel = document.getElementById('dungeonLevel');
    dungeonLevel.appendChild(square);
    //console.log(square);

    if (dungeonRoom.oob) {
        //paint no walls for oob rooms.
        square.style.backgroundColor = 'gray';
        return;
    }
    if (dungeonRoom.westWall.wallExists) {
        square.style.borderLeft = '1px solid red';
    }
    if (dungeonRoom.eastWall.wallExists) {
        square.style.borderRight = '1px solid red';
    }
    if (dungeonRoom.southWall.wallExists) {
        square.style.borderBottom = '1px solid red';
    }
    if (dungeonRoom.northWall.wallExists) {
        square.style.borderTop = '1px solid red';
    }
}

{/* <div class="row" style="display:none">
	<div class="column left" style="background-color:#aaa;">
		<div class="textContainer"></div>
	</div>
	<div class="column middle" style="background-color:#bbb;">
		<div class="level" id="dungeonLevel">
        </div>
	</div>
	<div class="column right playerDisplay" style="background-color:#ccc;"></div>
</div> */}

function drawDungeonAroundSquareDiv(position) {
    const dungeonLevel = document.getElementById('dungeonLevel');
    dungeonLevel.textContent = '';
    const dungeonRoomsToDraw = [];
    for(let i = 0;i<=dungeonViewSize-1;i++) {
        for(let j = 0;j<=dungeonViewSize-1;j++) {
            //find top left box and then this just works
            //top left box == current square - (dungeonViewSize - 1) / 2 for both x and y.
            const thisRoom = new DungeonRoom(
                i + position.x - ((dungeonViewSize - 1)/2), 
                j + position.y - ((dungeonViewSize - 1)/2), 
                position.z);
            //console.log(thisRoom);
            paintWalls(thisRoom);
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

