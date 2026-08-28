
// =====================================
// GAME VARIABLES
// =====================================

const gameBoard =
    document.getElementById("gameBoard");


const movesElement =
    document.getElementById("moves");


const matchesElement =
    document.getElementById("matches");


const timerElement =
    document.getElementById("timer");


const bestScoreElement =
    document.getElementById("bestScore");


const result =
    document.getElementById("result");


const finalMoves =
    document.getElementById("finalMoves");


const finalTime =
    document.getElementById("finalTime");


// =====================================
// CARD EMOJIS
// =====================================

const symbols = [

    "🍎",
    "🍌",
    "🍇",
    "🍉",
    "🍓",
    "🍍",
    "🥝",
    "🍒"

];


// =====================================
// VARIABLES
// =====================================

let cards = [];

let firstCard = null;

let secondCard = null;

let lockBoard = false;

let moves = 0;

let matches = 0;

let seconds = 0;

let timerInterval = null;

let gameStarted = false;


// =====================================
// BEST SCORE
// =====================================

let bestScore =
    Number(
        localStorage.getItem(
            "memoryBestScore"
        )
    ) || 0;


if (bestScore > 0) {

    bestScoreElement.textContent =
        bestScore;

}


// =====================================
// SHUFFLE
// =====================================

function shuffle(array) {

    const shuffled =
        [...array];


    for (
        let i = shuffled.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            shuffled[i],
            shuffled[j]
        ] =
        [
            shuffled[j],
            shuffled[i]
        ];

    }


    return shuffled;

}


// =====================================
// START GAME
// =====================================

function startGame() {

    clearInterval(timerInterval);


    firstCard = null;

    secondCard = null;

    lockBoard = false;

    moves = 0;

    matches = 0;

    seconds = 0;

    gameStarted = false;


    movesElement.textContent =
        "0";


    matchesElement.textContent =
        "0 / 8";


    timerElement.textContent =
        "0s";


    result.style.display =
        "none";


    // Create pairs

    cards =
        shuffle([
            ...symbols,
            ...symbols
        ]);


    gameBoard.innerHTML =
        "";


    cards.forEach(
        (symbol, index) => {

            createCard(
                symbol,
                index
            );

        }
    );

}


// =====================================
// CREATE CARD
// =====================================

function createCard(
    symbol,
    index
) {

    const card =
        document.createElement(
            "button"
        );


    card.className =
        "card";


    card.dataset.symbol =
        symbol;


    card.dataset.index =
        index;


    card.innerHTML = `

        <div class="card-inner">

            <div class="card-front">
                ❓
            </div>

            <div class="card-back">
                ${symbol}
            </div>

        </div>

    `;


    card.addEventListener(
        "click",
        flipCard
    );


    gameBoard.appendChild(
        card
    );

}


// =====================================
// FLIP CARD
// =====================================

function flipCard() {

    if (
        lockBoard ||
        this === firstCard ||
        this.classList.contains(
            "matched"
        )
    ) {

        return;

    }


    // Start timer

    if (!gameStarted) {

        gameStarted = true;

        startTimer();

    }


    this.classList.add(
        "flipped"
    );


    if (!firstCard) {

        firstCard = this;

        return;

    }


    secondCard = this;

    moves++;


    movesElement.textContent =
        moves;


    checkMatch();

}


// =====================================
// CHECK MATCH
// =====================================

function checkMatch() {

    const isMatch =
        firstCard.dataset.symbol ===
        secondCard.dataset.symbol;


    if (isMatch) {

        disableCards();

    }

    else {

        unflipCards();

    }

}


// =====================================
// MATCH FOUND
// =====================================

function disableCards() {

    firstCard.classList.add(
        "matched"
    );


    secondCard.classList.add(
        "matched"
    );


    matches++;


    matchesElement.textContent =
        `${matches} / 8`;


    resetBoard();


    if (matches === 8) {

        endGame();

    }

}


// =====================================
// WRONG CARDS
// =====================================

function unflipCards() {

    lockBoard = true;


    setTimeout(
        () => {

            firstCard.classList.remove(
                "flipped"
            );


            secondCard.classList.remove(
                "flipped"
            );


            resetBoard();

        },
        800
    );

}


// =====================================
// RESET BOARD
// =====================================

function resetBoard() {

    [
        firstCard,
        secondCard
    ] = [
        null,
        null
    ];


    lockBoard = false;

}


// =====================================
// TIMER
// =====================================

function startTimer() {

    timerInterval =
        setInterval(
            () => {

                seconds++;


                timerElement.textContent =
                    `${seconds}s`;

            },
            1000
        );

}


// =====================================
// END GAME
// =====================================

function endGame() {

    clearInterval(
        timerInterval
    );


    finalMoves.textContent =
        moves;


    finalTime.textContent =
        `${seconds}s`;


    result.style.display =
        "block";


    saveBestScore();

}


// =====================================
// SAVE BEST SCORE
// =====================================

function saveBestScore() {

    if (
        bestScore === 0 ||
        moves < bestScore
    ) {

        bestScore = moves;


        localStorage.setItem(
            "memoryBestScore",
            bestScore
        );


        bestScoreElement.textContent =
            bestScore;

    }

}


// =====================================
// START FIRST GAME
// =====================================

startGame();

