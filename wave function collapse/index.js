const WIDTH = 1800;
const HEIGHT = 900;
const TILESIZE = 30;

class Sprite {
    constructor(imgPath, width, height) {
        let img = document.createElement("img");
        img.setAttribute("src", imgPath);
        this.img = img;
        this.WIDTH = width;
        this.HEIGHT = height;
    }
}

const tiles = {
    "grass": new Sprite("/tiles/grass.png", TILESIZE, TILESIZE),
    "sand": new Sprite("/tiles/sand.png", TILESIZE, TILESIZE),
    "cactus": new Sprite("/tiles/cactus.png", TILESIZE, TILESIZE),
    "water": new Sprite("/tiles/water.png", TILESIZE, TILESIZE),
    "tree": new Sprite("/tiles/tree.png", TILESIZE, TILESIZE),
    "air": new Sprite("/tiles/air.png", TILESIZE, TILESIZE)
};

const RULES = {
    "tree": [
        "grass",
        "tree"
    ],
    "grass": [
        "grass",
        "tree",
        "sand"
    ],
    "sand": [
        "sand",
        "water",
        "grass",
        "cactus"
    ],
    "cactus": [
        "cactus",
        "sand",
    ],
    "water": [
        "sand",
        "water"
    ]
}

class Tile {
    constructor(x, y, W, H, sprite) {
        this.x = x
        this.y = y
        this.WIDTH = W;
        this.HEIGHT = H;
        this.sprite = sprite;
        this.type = sprite.img.getAttribute("src").split("/")[2].split(".")[0]
    }

    updateSprite(sprite) {
        this.sprite = sprite;
        this.type = sprite.img.getAttribute("src").split("/")[2].split(".")[0];
    }

    drawTile(ctx) {
        // ctx.beginPath();
        // ctx.strokeRect(this.x, this.y, this.WIDTH, this.HEIGHT)
        // ctx.fillStyle = this.color;
        // ctx.fillRect(this.x, this.y, this.WIDTH, this.HEIGHT)
        // ctx.stroke();
        this.type = this.sprite.img.getAttribute("src").split("/")[2].split(".")[0]
        ctx.drawImage(this.sprite.img, this.x, this.y, this.sprite.WIDTH, this.sprite.HEIGHT);
    }
}

class Stage {
    constructor() {
        this.TILESIZE = TILESIZE;
        this.map = [];

        // Make the map
        for (let i = 0; i < WIDTH / this.TILESIZE; i++) {
            this.map.push([]);
            for (let j = 0; j < HEIGHT / this.TILESIZE; j++) {
                this.map[i].push(new Tile(i * this.TILESIZE, j * this.TILESIZE, this.TILESIZE, this.TILESIZE, tiles["air"]));
            }
        }
    }

    // Draw function for drawing the tiles
    draw(ctx) {
        this.map.forEach(x => {
            x.forEach(y => {
                y.drawTile(ctx)
            });
        });
    }
}

class App {
    constructor(W, H, bgColor) {
        this.WIDTH = W;
        this.HEIGHT = H;
        this.bgColor = bgColor;

        let canvas = document.createElement("canvas");
        this.stage = new Stage();
        canvas.width = this.WIDTH;
        canvas.height = this.HEIGHT;
        canvas.style = "background-color: " + this.bgColor + ";"
        document.querySelector("div").appendChild(canvas)
        this.ctx = canvas.getContext("2d");
        this.stage.draw(this.ctx);
    }
}

// Instantiates the app
var app = new App(WIDTH, HEIGHT, "white");

window.addEventListener('contextmenu', (event) => {
    event.preventDefault()
});

document.querySelector("canvas").addEventListener("mousedown", (evt) => {
    let pos = getMousePos(document.querySelector("canvas"), evt);

    // Code Galore... this finds what tile the mouse is over and toggle it on and off
    let [x, y] = [Math.round((pos.x - app.stage.TILESIZE / 2) / app.stage.TILESIZE), Math.round((pos.y - app.stage.TILESIZE / 2) / app.stage.TILESIZE)];
    let clickedTileSprite = app.stage.map[x][y].sprite;
});

window.addEventListener("DOMContentLoaded", () => {
    let [X, Y] = [8, 4];

    app.stage.map[X][Y].updateSprite(tiles["grass"]);

    let checkedTiles = [app.stage.map[X][Y]]

    const recursion = (x, y, checkedTiles) => {
        getAdjacentTiles(x, y, app.stage.map).filter(x => x != null).forEach(x => {
            if (checkedTiles.includes(x)) return;
            try {
                var randomTile = getRandomTile(x.x / TILESIZE, x.y / TILESIZE, app.stage.map).sprite;
                x.updateSprite(randomTile);
                checkedTiles.push(x)
                if (checkedTiles.length >= app.stage.map.flat().length) {
                    return
                } else {
                    recursion(x.x / TILESIZE, x.y / TILESIZE, checkedTiles)
                }
            } catch (error) {
                checkedTiles = [app.stage.map[X][Y]]
                recursion(X, Y, checkedTiles);
            }
        });
    }

    recursion(X, Y, checkedTiles)
});

setInterval(() => { app.stage.draw(app.ctx) }, 50);