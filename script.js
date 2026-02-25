let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let difficulty = "easy";

const boardElement = document.getElementById("board");

function setDifficulty(level) {
    difficulty = level;
    restartGame();
}

function createBoard() {
    boardElement.innerHTML = "";
    board.forEach((cell, index) => {
        const div = document.createElement("div");
        div.classList.add("cell");
        div.innerText = cell;
        div.addEventListener("click", () => playerMove(index));
        boardElement.appendChild(div);
    });
}

function playerMove(index) {
    if (board[index] !== "" || !gameActive) return;

    board[index] = "X";
    createBoard();

    if (checkWinner("X")) {
        alert("You Win!");
        gameActive = false;
        return;
    }

    if (!board.includes("")) {
        alert("Draw!");
        gameActive = false;
        return;
    }

    setTimeout(aiMove, 400);
}

function aiMove() {
    if (!gameActive) return;

    let move;

    if (difficulty === "easy") {
        move = randomMove();
    } 
    else if (difficulty === "medium") {
        move = Math.random() < 0.5 ? randomMove() : bestMove();
    } 
    else {
        move = bestMove();
    }

    board[move] = "O";
    createBoard();

    if (checkWinner("O")) {
        alert("Computer Wins!");
        gameActive = false;
        return;
    }

    if (!board.includes("")) {
        alert("Draw!");
        gameActive = false;
    }
}

function randomMove() {
    let available = board
        .map((val, idx) => val === "" ? idx : null)
        .filter(v => v !== null);
    return available[Math.floor(Math.random() * available.length)];
}

function bestMove() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = "O";
            let score = minimax(board, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, isMaximizing) {
    if (checkWinner("O")) return 1;
    if (checkWinner("X")) return -1;
    if (!board.includes("")) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "O";
                let score = minimax(board, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "X";
                let score = minimax(board, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner(player) {
    const wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    return wins.some(combo =>
        combo.every(index => board[index] === player)
    );
}

function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    createBoard();
}

createBoard();
