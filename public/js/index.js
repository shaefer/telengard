$(document).ready(init);
function init()
{
    console.warn('init');
}

for (var x = 0; x <= 10;x++ )
{
    for (var y = 0; y <= 10;y++ )
    {
        console.warn(new Room(x, y, 0).toString()) 
    }        
}
        