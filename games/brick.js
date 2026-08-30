const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// =========================
// GAME VARIABLES
// =========================

let ballX;
let ballY;

let ballDX;
let ballDY;

const ballRadius = 8;

let paddleX;

const paddleWidth = 90;
const paddleHeight = 12;

const paddleSpeed = 7;

let rightPressed = false;
let leftPressed = false;

// Mobile continuous movement
let mobileDirection = null;

let score = 0;
let lives = 3;

let gameRunning = false;
let animationId;

// High Score
let highScore =
    Number(localStorage.getItem("brickHighScore")) || 0;

document.getElementById("highScore").textContent = highScore;


// =========================
// BRICKS
// =========================

const brickRowCount = 5;
const brickColumnCount = 7;

const brickWidth = 55;
const brickHeight = 20;

const brickPadding = 8;

const brickOffsetTop = 55;
const brickOffsetLeft = 25;

let bricks = [];


function createBricks() {

    bricks = [];

    for (let row = 0; row < brickRowCount; row++) {

        bricks[row] = [];

        for (let column = 0; column < brickColumnCount; column++) {

            bricks[row][column] = {
                x: 0,
                y: 0,
                visible: true
            };

        }
    }
}


// =========================
// RESET BALL
// =========================

function resetBall() {

    ballX = canvas.width / 2;
    ballY = canvas.height - 70;

    ballDX = 3;
    ballDY = -3;

    paddleX =
        (canvas.width - paddleWidth) / 2;

    // Stop mobile movement when life is lost
    mobileDirection = null;
}


// =========================
// START GAME
// =========================

function startGame() {

    document.getElementById("startScreen").style.display = "none";
    document.getElementById("gameOver").style.display = "none";
    document.getElementById("winScreen").style.display = "none";

    score = 0;
    lives = 3;

    document.getElementById("score").textContent = score;
    document.getElementById("lives").textContent = lives;

    createBricks();
    resetBall();

    gameRunning = true;

    cancelAnimationFrame(animationId);

    gameLoop();
}


// =========================
// DRAW BALL
// =========================

function drawBall() {

    ctx.beginPath();

    ctx.arc(
        ballX,
        ballY,
        ballRadius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#a78bfa";

    ctx.fill();

    ctx.closePath();
}


// =========================
// DRAW PADDLE
// =========================

function drawPaddle() {

    ctx.beginPath();

    ctx.roundRect(
        paddleX,
        canvas.height - 30,
        paddleWidth,
        paddleHeight,
        6
    );

    ctx.fillStyle = "#7c3aed";

    ctx.fill();

    ctx.closePath();
}


// =========================
// DRAW BRICKS
// =========================

function drawBricks() {

    for (let row = 0; row < brickRowCount; row++) {

        for (let column = 0; column < brickColumnCount; column++) {

            let brick = bricks[row][column];

            if (!brick.visible) {
                continue;
            }

            brick.x =
                column *
                (brickWidth + brickPadding)
                + brickOffsetLeft;

            brick.y =
                row *
                (brickHeight + brickPadding)
                + brickOffsetTop;

            ctx.beginPath();

            ctx.roundRect(
                brick.x,
                brick.y,
                brickWidth,
                brickHeight,
                4
            );

            ctx.fillStyle = "#7c3aed";

            ctx.fill();

            ctx.closePath();
        }
    }
}


// =========================
// COLLISION DETECTION
// =========================

function collisionDetection() {

    for (let row = 0; row < brickRowCount; row++) {

        for (let column = 0; column < brickColumnCount; column++) {

            let brick = bricks[row][column];

            if (!brick.visible) {
                continue;
            }

            if (
                ballX > brick.x &&
                ballX < brick.x + brickWidth &&
                ballY > brick.y &&
                ballY < brick.y + brickHeight
            ) {

                ballDY = -ballDY;

                brick.visible = false;

                score++;

                document.getElementById("score").textContent = score;

                // Win
                if (
                    score ===
                    brickRowCount * brickColumnCount
                ) {

                    winGame();

                    return;
                }
            }
        }
    }
}


// =========================
// KEYBOARD
// =========================

document.addEventListener(
    "keydown",
    keyDownHandler
);

document.addEventListener(
    "keyup",
    keyUpHandler
);


function keyDownHandler(event) {

    if (event.key === "ArrowRight") {

        rightPressed = true;

        // Keyboard use karte waqt mobile direction stop
        mobileDirection = null;

        event.preventDefault();
    }

    else if (event.key === "ArrowLeft") {

        leftPressed = true;

        mobileDirection = null;

        event.preventDefault();
    }
}


function keyUpHandler(event) {

    if (event.key === "ArrowRight") {

        rightPressed = false;
    }

    else if (event.key === "ArrowLeft") {

        leftPressed = false;
    }
}


// =========================
// MOBILE BUTTONS
// =========================

function movePaddle(direction) {

    if (!gameRunning) {
        return;
    }

    if (direction === "LEFT") {

        mobileDirection = "LEFT";

    }

    else if (direction === "RIGHT") {

        mobileDirection = "RIGHT";
    }
}


// =========================
// KEEP PADDLE INSIDE
// =========================

function keepPaddleInside() {

    if (paddleX < 0) {

        paddleX = 0;
    }

    if (
        paddleX >
        canvas.width - paddleWidth
    ) {

        paddleX =
            canvas.width - paddleWidth;
    }
}


// =========================
// GAME LOOP
// =========================

function gameLoop() {

    if (!gameRunning) {
        return;
    }

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawBricks();

    drawBall();

    drawPaddle();

    collisionDetection();


    // =========================
    // PADDLE MOVEMENT
    // =========================

    // Keyboard
    if (rightPressed) {

        paddleX += paddleSpeed;
    }

    if (leftPressed) {

        paddleX -= paddleSpeed;
    }


    // Mobile
    if (mobileDirection === "RIGHT") {

        paddleX += paddleSpeed;
    }

    if (mobileDirection === "LEFT") {

        paddleX -= paddleSpeed;
    }


    keepPaddleInside();


    // =========================
    // WALL COLLISION
    // =========================

    if (
        ballX + ballDX >
        canvas.width - ballRadius ||

        ballX + ballDX <
        ballRadius
    ) {

        ballDX = -ballDX;
    }


    // =========================
    // TOP COLLISION
    // =========================

    if (
        ballY + ballDY <
        ballRadius
    ) {

        ballDY = -ballDY;
    }


    // =========================
    // PADDLE COLLISION
    // =========================

    if (
        ballY + ballDY >
        canvas.height -
        30 -
        ballRadius
    ) {

        if (
            ballX > paddleX &&
            ballX < paddleX + paddleWidth
        ) {

            ballDY = -Math.abs(ballDY);

            // Change angle
            let hitPoint =
                ballX -
                (paddleX + paddleWidth / 2);

            ballDX =
                hitPoint * 0.08;
        }
    }


    // =========================
    // BALL MISSED
    // =========================

    if (
        ballY + ballDY >
        canvas.height
    ) {

        lives--;

        document.getElementById("lives")
            .textContent = lives;

        if (lives <= 0) {

            gameOver();

            return;
        }

        resetBall();
    }


    ballX += ballDX;
    ballY += ballDY;


    animationId =
        requestAnimationFrame(gameLoop);
}


// =========================
// GAME OVER
// =========================

function gameOver() {

    gameRunning = false;

    mobileDirection = null;

    cancelAnimationFrame(animationId);

    document.getElementById("finalScore")
        .textContent = score;

    document.getElementById("gameOver")
        .style.display = "flex";

    saveHighScore();
}


// =========================
// WIN
// =========================

function winGame() {

    gameRunning = false;

    mobileDirection = null;

    cancelAnimationFrame(animationId);

    document.getElementById("winScreen")
        .style.display = "flex";

    saveHighScore();
}


// =========================
// HIGH SCORE
// =========================

function saveHighScore() {

    if (score > highScore) {

        highScore = score;

        localStorage.setItem(
            "brickHighScore",
            highScore
        );

        document.getElementById("highScore")
            .textContent = highScore;
    }
}


// =========================
// RESTART
// =========================

function restartGame() {

    startGame();
}


// =========================
// INITIAL CANVAS
// =========================

createBricks();

resetBall();