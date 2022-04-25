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

const getCommonElements = (arrays) => {//Assumes that we are dealing with an array of arrays of integers
    var currentValues = {};
    var commonValues = {};
    for (var i = arrays[0].length - 1; i >= 0; i--) {//Iterating backwards for efficiency
        currentValues[arrays[0][i]] = 1; //Doesn't really matter what we set it to
    }
    for (var i = arrays.length - 1; i > 0; i--) {
        var currentArray = arrays[i];
        for (var j = currentArray.length - 1; j >= 0; j--) {
            if (currentArray[j] in currentValues) {
                commonValues[currentArray[j]] = 1; //Once again, the `1` doesn't matter
            }
        }
        currentValues = commonValues;
        commonValues = {};
    }
    return Object.keys(currentValues).map(function (value) {
        return value;
    });
}

const getRandomTile = (x, y, tileArray) => {
    // LOOKING FOR WHAT ADJACENT TILES CAN TOUCH AND SEEING IF THEY HAVE A COMMON THING IF IT'S ONE OR MORE THEN RANDOMIZE IT
    let aTiles = getAdjacentTiles(x, y, tileArray).filter(x => x != null && x.type != "air");

    if (aTiles.length <= 0) return tileArray[x][y];

    let rules = Array.from(aTiles, x => RULES[x.type]);
    let commonElements = getCommonElements(rules);

    return (commonElements.length != 0) ? new Tile(x, y, TILESIZE, TILESIZE, tiles[commonElements[getRandomInt(0, commonElements.length - 1)]]) : []
}

const getAdjacentTiles = (x, y, tileArray) => {
    let top = (y - 1 < 0) ? null : tileArray[x][y - 1]

    let midLeft = (x - 1 < 0) ? null : tileArray[x - 1][y]
    let midRight = (x + 1 > WIDTH / TILESIZE - 1) ? null : tileArray[x + 1][y]

    let bot = (y + 1 > HEIGHT / TILESIZE - 1) ? null : tileArray[x][y + 1]

    return [top, midLeft, midRight, bot]
}