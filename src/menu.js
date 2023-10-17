// ----------------------------------------- Start Menu
const menu = document.getElementById("pacman-menu");
const can = document.getElementById("canvas");

// New Game
const startButton = document.getElementById("startButton");

startButton.addEventListener("click", () => {
    menu.style.display = "none";
    can.style.display = "block";
    startGame();
});



// -------------------------------------- Game Over Menu
const gameOverMenu = document.getElementById("game-over-menu");

// Play again
const playAgainButton = document.getElementById("play-again-button");
const saveScoreButton = document.getElementById("save-score-button");

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


// Save Score
const highScoresMenu = document.getElementById("high-scores-menu");
const highScoresList = document.getElementById("high-scores-list");
const highScoresButton = document.getElementById("highscoresButton");

let displayHighScores = () => {
    highScoresList.innerHTML = "";
    highscores.sort((a, b) => b.score - a.score);

    highscores.forEach((score, index) => {
        const listItem = document.createElement("li");
        listItem.innerText = `${score.name}: ${score.score}`;
        highScoresList.appendChild(listItem);
    });

    highScoresMenu.style.display = "block";
};


let closeHighScores = () => {
    highScoresMenu.style.display = "none";
};


let saveScore = () => {
    const playerName = prompt("Enter your name:");
    if (playerName) {
        const newScore = {name: playerName, score: score};
        highscores.push(newScore);
        displayHighScores();
    }
};

highScoresButton.addEventListener("click", () => {
    menu.style.display = "none";
    displayHighScores();
});

saveScoreButton.addEventListener("click", () => {
    closeGameOverMenu();
    saveScore();
});


// Main Menu Button
const mainMenuButtons = document.querySelectorAll('.main-menu-button');
mainMenuButtons.forEach((mainMenuButton) => {
    mainMenuButton.addEventListener("click", () => {
        closeGameOverMenu();
        closeHighScores()
        can.style.display = "none";
        menu.style.display = "block";
    });
});