
// ===============================
// VARIABLES
// ===============================

const cells =
    document.querySelectorAll(".cell");


let board = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
];


let currentPlayer = "X";

let gameActive = true;

let gameMode = "twoPlayer";


// ===============================
// SCORE
// ===============================

let xScore = 0;

let oScore = 0;

let drawScore = 0;

let gamesPlayed = 0;


// ===============================
// WINNING COMBINATIONS
// ===============================

const winningPatterns = [

    [0, 1, 2],

    [3, 4, 5],

    [6, 7, 8],

    [0, 3, 6],

    [1, 4, 7],

    [2, 5, 8],

    [0, 4, 8],

    [2, 4, 6]

];


// ===============================
// CELL CLICK
// ===============================

cells.forEach(cell => {

    cell.addEventListener(
        "click",
        handleCellClick
    );

});


function handleCellClick(event) {

    const index =
        Number(
            event.target.dataset.index
        );


    if (
        board[index] !== "" ||
        !gameActive
    ) {

        return;

    }


    // Computer mode
    if (
        gameMode === "computer" &&
        currentPlayer === "O"
    ) {

        return;

    }


    makeMove(index, currentPlayer);


    const result =
        checkWinner();


    if (!gameActive) {

        return;

    }


    // Computer turn

    if (
        gameMode === "computer" &&
        currentPlayer === "O"
    ) {

        document.getElementById(
            "turnText"
        ).textContent =
            "Computer is thinking...";


        setTimeout(
            computerMove,
            400
        );

    }

}


// ===============================
// MAKE MOVE
// ===============================

function makeMove(
    index,
    player
) {

    board[index] = player;


    cells[index].textContent =
        player;


    cells[index].classList.add(
        player.toLowerCase()
    );


    currentPlayer =
        player === "X"
            ? "O"
            : "X";


    updateTurn();

}


// ===============================
// CHECK WINNER
// ===============================

function checkWinner() {

    for (
        let pattern of winningPatterns
    ) {

        const [a, b, c] =
            pattern;


        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            endGame(
                board[a],
                pattern
            );

            return true;

        }

    }


    // Draw

    if (
        board.every(
            cell => cell !== ""
        )
    ) {

        endGame("DRAW");

        return true;

    }


    return false;

}


// ===============================
// END GAME
// ===============================

function endGame(
    winner,
    winningPattern = []
) {

    gameActive = false;

    gamesPlayed++;


    // Highlight winning cells

    winningPattern.forEach(
        index => {

            cells[index]
                .classList.add(
                    "winner"
                );

        }
    );


    if (winner === "X") {

        xScore++;


        document.getElementById(
            "resultTitle"
        ).textContent =
            "Player X Wins! 🎉";

    }

    else if (winner === "O") {

        oScore++;


        if (
            gameMode === "computer"
        ) {

            document.getElementById(
                "resultTitle"
            ).textContent =
                "Computer Wins! 🤖";

        }

        else {

            document.getElementById(
                "resultTitle"
            ).textContent =
                "Player O Wins! 🎉";

        }

    }

    else {

        drawScore++;


        document.getElementById(
            "resultTitle"
        ).textContent =
            "It's a Draw! 🤝";

    }


    updateScores();


    document.getElementById(
        "gamesPlayed"
    ).textContent =
        gamesPlayed;


    document.getElementById(
        "result"
    ).style.display =
        "block";

}


// ===============================
// COMPUTER AI
// ===============================

function computerMove() {

    if (!gameActive) {

        return;

    }


    // 1. Try to win

    let move =
        findBestMove("O");


    // 2. Block player

    if (move === -1) {

        move =
            findBestMove("X");

    }


    // 3. Center

    if (
        move === -1 &&
        board[4] === ""
    ) {

        move = 4;

    }


    // 4. Random empty cell

    if (move === -1) {

        const emptyCells = [];


        board.forEach(
            (value, index) => {

                if (value === "") {

                    emptyCells.push(index);

                }

            }
        );


        if (
            emptyCells.length > 0
        ) {

            move =
                emptyCells[
                    Math.floor(
                        Math.random() *
                        emptyCells.length
                    )
                ];

        }

    }


    if (move !== -1) {

        makeMove(move, "O");

        checkWinner();

    }

}


// ===============================
// FIND BEST MOVE
// ===============================

function findBestMove(
    player
) {

    for (
        let pattern of winningPatterns
    ) {

        const [a, b, c] =
            pattern;


        const values = [
            board[a],
            board[b],
            board[c]
        ];


        const playerCount =
            values.filter(
                value =>
                    value === player
            ).length;


        const emptyCount =
            values.filter(
                value =>
                    value === ""
            ).length;


        if (
            playerCount === 2 &&
            emptyCount === 1
        ) {

            if (
                board[a] === ""
            ) {

                return a;

            }


            if (
                board[b] === ""
            ) {

                return b;

            }


            if (
                board[c] === ""
            ) {

                return c;

            }

        }

    }


    return -1;

}


// ===============================
// UPDATE TURN
// ===============================

function updateTurn() {

    if (!gameActive) {

        return;

    }


    if (
        gameMode === "computer"
    ) {

        if (
            currentPlayer === "X"
        ) {

            document.getElementById(
                "turnText"
            ).textContent =
                "Your Turn ❌";

        }
        else {

            document.getElementById(
                "turnText"
            ).textContent =
                "Computer's Turn ⭕";

        }

    }

    else {

        document.getElementById(
            "turnText"
        ).textContent =
            `Player ${currentPlayer}'s Turn`;

    }

}


// ===============================
// UPDATE SCORES
// ===============================

function updateScores() {

    document.getElementById(
        "xScore"
    ).textContent =
        xScore;


    document.getElementById(
        "oScore"
    ).textContent =
        oScore;


    document.getElementById(
        "drawScore"
    ).textContent =
        drawScore;

}


// ===============================
// NEW GAME
// ===============================

function newGame() {

    board = [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
    ];


    currentPlayer = "X";

    gameActive = true;


    cells.forEach(
        cell => {

            cell.textContent = "";

            cell.classList.remove(
                "x",
                "o",
                "winner"
            );

        }
    );


    document.getElementById(
        "result"
    ).style.display =
        "none";


    updateTurn();

}


// ===============================
// CHANGE MODE
// ===============================

function setMode(mode) {

    gameMode = mode;


    document.getElementById(
        "twoPlayerBtn"
    ).classList.remove("active");


    document.getElementById(
        "computerBtn"
    ).classList.remove("active");


    if (
        mode === "twoPlayer"
    ) {

        document.getElementById(
            "twoPlayerBtn"
        ).classList.add("active");

    }

    else {

        document.getElementById(
            "computerBtn"
        ).classList.add("active");

    }


    newGame();

}


// ===============================
// START
// ===============================

updateScores();

updateTurn();

