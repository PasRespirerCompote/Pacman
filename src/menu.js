const menu = document.getElementById("menu");
const can = document.getElementById("canvas");
const startButton = document.getElementById("startButton");

startButton.addEventListener("click", () => {
    menu.style.display = "none";
    can.style.display = "block";
    startGame();
});


const gameOverMenu = document.getElementById("game-over-menu");
const playAgainButton = document.getElementById("play-again-button");

let openGameOverMenu = () => {
    gameOverMenu.style.display = "flex";
};

let closeGameOverMenu = () => {
    gameOverMenu.style.display = "none";
};

playAgainButton.addEventListener("click", () => {
    closeGameOverMenu();
    startGame();
});