$(document).ready(init);
function init()
{
    console.warn('init');

    var width = 10;
    var height = 10;
    var maxWidthIndex = width - 1;
    var maxHeightIndex = height - 1;
    var table = $('<table>');
    table.addClass('dungeon');
    for (var y = 0; y <= maxWidthIndex;y++ )
    {
        var row = $('<tr>');
        table.append(row);
        for (var x = 0; x <= maxHeightIndex;x++ )
        {
            var cell = $('<td>');
            row.append(cell);
            cell.addClass("x" + x + "y" + y)
            var room = new Room(x, y, 0);
            console.warn(room.toString())
            console.warn(room.getNorthWall().hasWall());
            if (y == 0 || room.getNorthWall().hasWall())
                cell.addClass("northWall")
            if (x == maxWidthIndex || room.getEastWall().hasWall())
                cell.addClass("eastWall")
            if (y == maxHeightIndex || room.getSouthWall().hasWall())
                cell.addClass("southWall")
            if (x == 0 || room.getWestWall().hasWall())
                cell.addClass("westWall")
        }        
    }
    table.appendTo($('.level'))
}


        