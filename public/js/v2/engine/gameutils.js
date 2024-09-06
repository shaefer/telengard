function GetIdChar(id, index) {
    return Number(id.toString().substring(index, index + 1));
}

function GetIdCharPair(id, index) {
    return Number(id.toString().substring(index, index + 2));
}