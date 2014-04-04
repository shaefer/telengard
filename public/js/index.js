$(document).ready(init);
function init()
{
    console.warn('init');

    draw(2,2,0, 2)
}

function draw(x,y,z,radius)
{
    if (!radius)
    {
        console.warn('no radius was specified')
        radius = 5;
    }

    var width = 10;
    var height = 10;
    var maxWidthIndex = width - 1;
    var maxHeightIndex = height - 1;

    var cx = x - radius > 0 ? x - radius : 0;
    var cy = y - radius > 0 ? x - radius : 0;
    var mx = x + radius < maxHeightIndex ? x + radius : maxHeightIndex;
    var my = y + radius < maxWidthIndex ? y + radius : maxWidthIndex;
    var cz = z;

    var table = $('<table>');
    table.addClass('dungeon');
    for (var y = cy; y <= my;y++ )
    {
        var row = $('<tr>');
        table.append(row);
        for (var x = cx; x <= mx;x++ )
        {
            var cell = $('<td>');
            row.append(cell);
            cell.addClass("x" + x + "y" + y)
            var room = new Room(x, y, cz);
            console.warn(room.toString())
            console.warn(room.getNorthWall().hasWall());
            if (y == 0 || room.getNorthWall().hasWall())
                cell.addClass("northWall")
            if (x == my || room.getEastWall().hasWall())
                cell.addClass("eastWall")
            if (y == mx || room.getSouthWall().hasWall())
                cell.addClass("southWall")
            if (x == 0 || room.getWestWall().hasWall())
                cell.addClass("westWall")
        }        
    }
    table.appendTo($('.level'))
}


        