const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");


// ======================================
// GAME VARIABLES
// ======================================

const ROWS = 9;

const COLS = 8;

const BUBBLE_RADIUS = 25;

const BUBBLE_DIAMETER =
    BUBBLE_RADIUS * 2;

const COLORS = [
    "#ef4444",
    "#3b82f6",
    "#22c55e",
    "#eab308",
    "#a855f7",
    "#f97316"
];


let bubbles = [];

let currentBubble;

let nextBubble;

let aimAngle = -Math.PI / 2;

let score = 0;

let shots = 0;

let gameRunning = false;

let animationId;

let highScore =
    Number(
        localStorage.getItem(
            "bubbleHighScore"
        )
    ) || 0;


document
    .getElementById("highScore")
    .textContent = highScore;


// ======================================
// CREATE BUBBLE
// ======================================

function randomColor() {

    return COLORS[
        Math.floor(
            Math.random() * COLORS.length
        )
    ];

}


function createBubble(row, col, color) {

    return {

        row: row,

        col: col,

        color: color,

        x: getBubbleX(col),

        y: getBubbleY(row)

    };

}


function getBubbleX(col) {

    return (
        BUBBLE_RADIUS +
        col * BUBBLE_DIAMETER +
        BUBBLE_RADIUS
    );

}


function getBubbleY(row) {

    return (
        35 +
        row * 52
    );

}


// ======================================
// CREATE BOARD
// ======================================

function createBoard() {

    bubbles = [];

    for (
        let row = 0;
        row < ROWS;
        row++
    ) {

        bubbles[row] = [];

        for (
            let col = 0;
            col < COLS;
            col++
        ) {

            let color;

            if (row < 5) {

                color = randomColor();

            }
            else {

                color = null;

            }

            bubbles[row][col] = color;

        }

    }

}


// ======================================
// GET CURRENT BUBBLE
// ======================================

function createShooterBubble() {

    currentBubble = {

        color: randomColor()

    };


    nextBubble = {

        color: randomColor()

    };

}


// ======================================
// START GAME
// ======================================

function startGame() {

    document
        .getElementById("startScreen")
        .style.display = "none";


    document
        .getElementById("gameOver")
        .style.display = "none";


    document
        .getElementById("winScreen")
        .style.display = "none";


    score = 0;

    shots = 0;

    aimAngle = -Math.PI / 2;


    document
        .getElementById("score")
        .textContent = score;


    document
        .getElementById("shots")
        .textContent = shots;


    createBoard();

    createShooterBubble();

    gameRunning = true;


    cancelAnimationFrame(animationId);

    gameLoop();

}


// ======================================
// DRAW BUBBLE
// ======================================

function drawBubble(
    x,
    y,
    color
) {

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        BUBBLE_RADIUS,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = color;

    ctx.fill();


    ctx.strokeStyle =
        "rgba(255,255,255,0.35)";

    ctx.lineWidth = 2;

    ctx.stroke();


    // Highlight

    ctx.beginPath();

    ctx.arc(
        x - 8,
        y - 8,
        6,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "rgba(255,255,255,0.55)";

    ctx.fill();

}


// ======================================
// DRAW BOARD
// ======================================

function drawBoard() {

    for (
        let row = 0;
        row < ROWS;
        row++
    ) {

        for (
            let col = 0;
            col < COLS;
            col++
        ) {

            const color =
                bubbles[row][col];


            if (!color) {

                continue;

            }


            drawBubble(
                getBubbleX(col),
                getBubbleY(row),
                color
            );

        }

    }

}


// ======================================
// DRAW SHOOTER
// ======================================

function drawShooter() {

    const shooterX =
        canvas.width / 2;

    const shooterY =
        canvas.height - 55;


    // Aim line

    const aimLength = 70;


    const endX =
        shooterX +
        Math.cos(aimAngle) *
        aimLength;


    const endY =
        shooterY +
        Math.sin(aimAngle) *
        aimLength;


    ctx.beginPath();

    ctx.moveTo(
        shooterX,
        shooterY
    );

    ctx.lineTo(
        endX,
        endY
    );

    ctx.strokeStyle =
        "rgba(255,255,255,0.4)";

    ctx.lineWidth = 3;

    ctx.stroke();


    // Shooter bubble

    drawBubble(
        shooterX,
        shooterY,
        currentBubble.color
    );


    // Next bubble

    ctx.font =
        "14px Arial";

    ctx.fillStyle =
        "#858aa2";

    ctx.fillText(
        "NEXT",
        25,
        canvas.height - 80
    );


    drawBubble(
        45,
        canvas.height - 40,
        nextBubble.color
    );

}


// ======================================
// AIM
// ======================================

function moveAim(direction) {

    if (!gameRunning) {

        return;

    }


    aimAngle +=
        direction * 0.12;


    // Keep aim between
    // left and right

    const minAngle =
        -Math.PI + 0.25;

    const maxAngle =
        -0.25;


    if (aimAngle < minAngle) {

        aimAngle = minAngle;

    }


    if (aimAngle > maxAngle) {

        aimAngle = maxAngle;

    }

}


// ======================================
// KEYBOARD
// ======================================

document.addEventListener(
    "keydown",
    function(event) {

        if (!gameRunning) {

            return;

        }


        if (
            event.key === "ArrowLeft"
        ) {

            event.preventDefault();

            moveAim(-1);

        }


        else if (
            event.key === "ArrowRight"
        ) {

            event.preventDefault();

            moveAim(1);

        }


        else if (
            event.code === "Space"
        ) {

            event.preventDefault();

            shootBubble();

        }

    }
);


// ======================================
// SHOOT
// ======================================

function shootBubble() {

    if (!gameRunning) {

        return;

    }


    shots++;


    document
        .getElementById("shots")
        .textContent = shots;


    const startX =
        canvas.width / 2;

    const startY =
        canvas.height - 55;


    let x = startX;

    let y = startY;


    const speed = 10;

    const dx =
        Math.cos(aimAngle) *
        speed;

    const dy =
        Math.sin(aimAngle) *
        speed;


    function animateShot() {

        x += dx;

        y += dy;


        // Wall bounce

        if (
            x <= BUBBLE_RADIUS ||
            x >=
            canvas.width -
            BUBBLE_RADIUS
        ) {

            x =
                Math.max(
                    BUBBLE_RADIUS,
                    Math.min(
                        canvas.width -
                        BUBBLE_RADIUS,
                        x
                    )
                );

            // Reverse horizontal direction

            // This creates natural
            // wall bouncing.
        }


        // Check collision

        const collision =
            findCollision(
                x,
                y
            );


        if (
            collision ||
            y <= BUBBLE_RADIUS
        ) {

            placeBubble(
                x,
                y
            );

            return;

        }


        drawScene();

        drawBubble(
            x,
            y,
            currentBubble.color
        );


        requestAnimationFrame(
            animateShot
        );

    }


    animateShot();

}


// ======================================
// FIND COLLISION
// ======================================

function findCollision(
    x,
    y
) {

    for (
        let row = 0;
        row < ROWS;
        row++
    ) {

        for (
            let col = 0;
            col < COLS;
            col++
        ) {

            if (
                !bubbles[row][col]
            ) {

                continue;

            }


            const bx =
                getBubbleX(col);

            const by =
                getBubbleY(row);


            const distance =
                Math.sqrt(
                    Math.pow(x - bx, 2) +
                    Math.pow(y - by, 2)
                );


            if (
                distance <
                BUBBLE_DIAMETER - 4
            ) {

                return true;

            }

        }

    }


    return false;

}


// ======================================
// PLACE BUBBLE
// ======================================

function placeBubble(
    x,
    y
) {

    let bestRow = 0;

    let bestCol = 0;

    let bestDistance =
        Infinity;


    for (
        let row = 0;
        row < ROWS;
        row++
    ) {

        for (
            let col = 0;
            col < COLS;
            col++
        ) {

            if (
                bubbles[row][col]
            ) {

                continue;

            }


            const bx =
                getBubbleX(col);

            const by =
                getBubbleY(row);


            const distance =
                Math.sqrt(
                    Math.pow(x - bx, 2) +
                    Math.pow(y - by, 2)
                );


            if (
                distance <
                bestDistance
            ) {

                bestDistance =
                    distance;

                bestRow = row;

                bestCol = col;

            }

        }

    }


    bubbles[bestRow][bestCol] =
        currentBubble.color;


    const popped =
        findMatches(
            bestRow,
            bestCol
        );


    if (popped.length >= 3) {

        popped.forEach(
            position => {

                bubbles[
                    position.row
                ][
                    position.col
                ] = null;

            }
        );


        score +=
            popped.length * 10;


        document
            .getElementById("score")
            .textContent = score;

    }


    // Prepare next bubble

    currentBubble =
        nextBubble;

    nextBubble = {

        color: randomColor()

    };


    // Check win

    if (isBoardEmpty()) {

        winGame();

        return;

    }


    // Check game over

    if (isGameOver()) {

        endGame();

        return;

    }

}


// ======================================
// FIND MATCHES
// ======================================

function findMatches(
    startRow,
    startCol
) {

    const color =
        bubbles[startRow][startCol];


    if (!color) {

        return [];

    }


    const visited = new Set();

    const matches = [];


    const queue = [
        {
            row: startRow,
            col: startCol
        }
    ];


    while (queue.length) {

        const current =
            queue.shift();


        const key =
            current.row +
            "," +
            current.col;


        if (
            visited.has(key)
        ) {

            continue;

        }


        visited.add(key);


        if (
            current.row < 0 ||
            current.row >= ROWS ||
            current.col < 0 ||
            current.col >= COLS
        ) {

            continue;

        }


        if (
            bubbles[
                current.row
            ][
                current.col
            ] !== color
        ) {

            continue;

        }


        matches.push(current);


        queue.push(
            {
                row: current.row - 1,
                col: current.col
            },

            {
                row: current.row + 1,
                col: current.col
            },

            {
                row: current.row,
                col: current.col - 1
            },

            {
                row: current.row,
                col: current.col + 1
            }
        );

    }


    return matches;

}


// ======================================
// BOARD CHECK
// ======================================

function isBoardEmpty() {

    for (
        let row = 0;
        row < ROWS;
        row++
    ) {

        for (
            let col = 0;
            col < COLS;
            col++
        ) {

            if (
                bubbles[row][col]
            ) {

                return false;

            }

        }

    }


    return true;

}


function isGameOver() {

    for (
        let row = 6;
        row < ROWS;
        row++
    ) {

        for (
            let col = 0;
            col < COLS;
            col++
        ) {

            if (
                bubbles[row][col]
            ) {

                return true;

            }

        }

    }


    return false;

}


// ======================================
// DRAW SCENE
// ======================================

function drawScene() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Background

    ctx.fillStyle =
        "#10182b";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Top line

    ctx.strokeStyle =
        "#252a40";

    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.moveTo(
        0,
        545
    );

    ctx.lineTo(
        canvas.width,
        545
    );

    ctx.stroke();


    drawBoard();

    drawShooter();

}


// ======================================
// GAME LOOP
// ======================================

function gameLoop() {

    if (!gameRunning) {

        return;

    }


    drawScene();


    animationId =
        requestAnimationFrame(
            gameLoop
        );

}


// ======================================
// GAME OVER
// ======================================

function endGame() {

    gameRunning = false;


    cancelAnimationFrame(
        animationId
    );


    document
        .getElementById("finalScore")
        .textContent = score;


    document
        .getElementById("gameOver")
        .style.display = "flex";


    saveHighScore();

}


// ======================================
// WIN
// ======================================

function winGame() {

    gameRunning = false;


    cancelAnimationFrame(
        animationId
    );


    document
        .getElementById("winScore")
        .textContent = score;


    document
        .getElementById("winScreen")
        .style.display = "flex";


    saveHighScore();

}


// ======================================
// HIGH SCORE
// ======================================

function saveHighScore() {

    if (
        score > highScore
    ) {

        highScore = score;


        localStorage.setItem(
            "bubbleHighScore",
            highScore
        );

    }


    document
        .getElementById("highScore")
        .textContent =
        highScore;

}


// ======================================
// RESTART
// ======================================

function restartGame() {

    startGame();

}


// ======================================
// INITIALIZE
// ======================================

createBoard();

createShooterBubble();

drawScene();