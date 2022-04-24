const getMousePos = (canvas, evt) => {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getAdjacentTiles = (x, y, tileArray) => {
    let topLeft = tileArray[x - 1][y - 1]
    let top = tileArray[x][y - 1]
    let topRight = tileArray[x + 1][y - 1]

    let midLeft = tileArray[x - 1][y]
    let midRight = tileArray[x + 1][y]

    let botLeft = tileArray[x - 1][y + 1]
    let bot = tileArray[x][y + 1]
    let botRight = tileArray[x + 1][y + 1]

    return [topLeft, top, topRight, midLeft, midRight, botLeft, bot, botRight]
}