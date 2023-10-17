const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");

const pacmanFrames = document.getElementById("animations");
const ghostFrames = document.getElementById("ghosts");

let createRect = (x, y, width, height, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
};

let pacman;

// 0 = empty
// 1 = wall
// 2 = food
let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

let highscores = [];

let fps = 30;
let gameInterval;

// Sizes
let blockSize = 20;
let wallSpaceWidth = blockSize / 1.5;
let wallOffset = (blockSize - wallSpaceWidth) / 2;

// Colors
let wallColor = "#0000BB";
let wallInnerColor = "black";
let foodColor = "#FEB897";

let foodCount = 219;

// Directions
const DIR_BOTTOM = 1
const DIR_LEFT = 2
const DIR_UP = 3
const DIR_RIGHT = 4

let lives = 3;
let score = 0;

let ghostCount = 4;
let ghosts;
let ghostsLocations = [
    {x: 0, y: 0},
    {x: 176, y: 0},
    {x: 0, y: 121},
    {x: 176, y: 121}
];

let randomGhostTargets = [
    {x: blockSize, y:blockSize },
    {x: blockSize, y: (map.length - 2) * blockSize},
    {x: (map[0].length - 2) * blockSize, y: blockSize},
    {x: (map[0].length - 2) * blockSize, y: (map.length - 2) * blockSize}
];


let startGame = () => {
    map = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
        [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
        [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
        [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
        [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
        [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
        [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
        [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];
    drawFood();

    lives = 3;
    score = 0;

    pacman = createNewPacman();
    createGhosts();

    let gameLoop = () => {
        update();
    };

    gameInterval = setInterval(gameLoop, 1000 / fps);
};


let update = () => {
    draw();
    pacman.moveProcess();
    pacman.eat();

    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].moveProcess();
    }

    if (pacman.checkGhostCollision()) {
        restartGame();
    }

    if (score >= foodCount)
        drawWin();
};


let restartGame = () => {
    pacman = createNewPacman();
    ghosts = createGhosts();

    lives--;

    if (lives <= 0)
        gameOver();
};


let gameOver = () => {
    clearInterval(gameInterval);
    drawLives();
    openGameOverMenu();
};


let draw = () => {
    // createRect(0,0, canvas.width, canvas.height, "black");
    canvasContext.fillStyle = "rgba(0, 0, 0, 0)";
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    drawWalls();
    drawFood();
    pacman.draw();
    drawScore();
    drawLives();
    drawGhosts();
};


let drawWalls = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] === 1) {
                createRect(
                    j * blockSize,
                    i * blockSize,
                    blockSize,
                    blockSize,
                    wallColor
                );

                if (j > 0 && map[i][j - 1] === 1) {
                    createRect(
                        j * blockSize,
                        i * blockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }

                if (j < map[0].length - 1 && map[i][j + 1] === 1) {
                    createRect(
                        j * blockSize + wallOffset,
                        i * blockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }


                if (i > 0 && map[i - 1][j] === 1) {
                    createRect(
                        j * blockSize + wallOffset,
                        i * blockSize,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor
                    );
                }

                if (i < map.length - 1 && map[i + 1][j] === 1) {
                    createRect(
                        j * blockSize + wallOffset,
                        i * blockSize + wallOffset,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor
                    );
                }
            }
        }
    }
};


let drawFood = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] === 2) {
                createRect(
                    j * blockSize + blockSize / 3,
                    i * blockSize + blockSize / 3,
                    blockSize / 3,
                    blockSize / 3,
                    foodColor
                );
            }
        }
    }
};


let drawScore = () => {
    canvasContext.font = "30px Emu-logic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Score: " + score, 0, blockSize * (map.length + 1) + 10);
};


let drawGhosts = () => {
    for (let i = 0; i < ghosts.length; i++)
        ghosts[i].draw();
};


let drawLives = () => {
    for (let i = 0; i < lives; i++)
        canvasContext.drawImage(
            pacmanFrames,
            2 * blockSize,
            0,
            blockSize,
            blockSize,
            350 + i * blockSize,
            blockSize * map.length + 10,
            blockSize,
            blockSize
        );
};


let drawWin = () => {
    canvasContext.font = "60px Emu-logic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("You win!!!", 100, 200);
}


let createNewPacman = () => {
    return new Pacman(
        blockSize,
        blockSize,
        blockSize,
        blockSize,
        blockSize / 5
    );
};


let createGhosts = () => {
    ghosts = [];
    for (let i = 0; i < ghostCount; i++) {
        ghosts.push(new Ghost(
            9 * blockSize + (i % 2 === 0 ? 0 : 1) * blockSize,
            10 * blockSize + (i % 2 === 0 ? 0 : 1) * blockSize,
            blockSize,
            blockSize,
            pacman.speed / 2,
            ghostsLocations[i % 4].x,
            ghostsLocations[i % 4].y,
            124,
            116,
            6 + i
        ));
    }

    return ghosts;
};

/*
let toggleMenu = (show) => {
    const menu = document.getElementById("menu");
    if (show) {
        menu.style.display = "block";
        document.removeEventListener("keydown", handleKeyPressed);
    }
    else {
        menu.style.display = "none";
        document.addEventListener("keydown", handleKeyPressed);
    }
};
*/

window.addEventListener("keydown", (event) => {
    let k = event.key;
    setTimeout(() => {
        switch (k) {
            case "ArrowLeft":
            case "A":
            case "a": // Left
                pacman.nextDirection = DIR_LEFT;
                break;
            case "ArrowUp":
            case "W":
            case "w": // Up
                pacman.nextDirection = DIR_UP;
                break;
            case "ArrowRight":
            case "D":
            case "d": // Right
                pacman.nextDirection = DIR_RIGHT;
                break;
            case "ArrowDown":
            case "S":
            case "s": // Bottom
                pacman.nextDirection = DIR_BOTTOM;
                break;
        }
    }, 1);
});


window.addEventListener("load", () => {
    const menu = document.getElementById("pacman-menu");
    menu.style.display = "block";
});

pacman = createNewPacman();
createGhosts();
//gameLoop();
