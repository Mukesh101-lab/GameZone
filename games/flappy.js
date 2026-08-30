
const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");


// ===============================
// GAME VARIABLES
// ===============================

let bird;

let pipes = [];

let score = 0;

let highScore =
    Number(
        localStorage.getItem("flappyHighScore")
    ) || 0;

let gameRunning = false;

let animationId;

let frame = 0;


// ===============================
// BIRD
// ===============================

const birdSize = 28;

const gravity = 0.28;

const jumpStrength = -5.5;


function createBird() {

    bird = {

        x: 80,

        y: 280,

        velocity: -1

    };

}


// ===============================
// PIPES
// ===============================

const pipeWidth = 60;

const pipeGap = 160;

const pipeSpeed = 2.5;


function createPipe() {

    const minGapTop = 80;

    const maxGapTop =
        canvas.height -
        pipeGap -
        100;


    const gapTop =
        Math.floor(
            Math.random() *
            (maxGapTop - minGapTop)
        ) +
        minGapTop;


    pipes.push({

        x: canvas.width,

        gapTop: gapTop,

        scored: false

    });

}


// ===============================
// START GAME
// ===============================

function startGame() {

    document
        .getElementById("startScreen")
        .style.display = "none";


    document
        .getElementById("gameOver")
        .style.display = "none";


    score = 0;

    frame = 0;

    pipes = [];

    createBird();


    document
        .getElementById("score")
        .textContent = score;


    document
        .getElementById("currentScore")
        .textContent = score;


    gameRunning = true;


    cancelAnimationFrame(animationId);

    gameLoop();

}


// ===============================
// FLAP
// ===============================

function flap() {

    if (!gameRunning) {

        return;

    }


    bird.velocity =
        jumpStrength;

}


// ===============================
// KEYBOARD
// ===============================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.code === "Space" ||
            event.key === "ArrowUp"
        ) {

            event.preventDefault();

            flap();

        }

    }
);


// ===============================
// DRAW BACKGROUND
// ===============================

function drawBackground() {

    ctx.fillStyle = "#10182b";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Clouds

    ctx.fillStyle = "#1b2740";


    ctx.beginPath();

    ctx.arc(70, 100, 25, 0, Math.PI * 2);

    ctx.arc(100, 100, 35, 0, Math.PI * 2);

    ctx.arc(135, 100, 25, 0, Math.PI * 2);

    ctx.fill();


    ctx.beginPath();

    ctx.arc(270, 190, 25, 0, Math.PI * 2);

    ctx.arc(300, 190, 35, 0, Math.PI * 2);

    ctx.arc(335, 190, 25, 0, Math.PI * 2);

    ctx.fill();

}


// ===============================
// DRAW BIRD
// ===============================

function drawBird() {

    ctx.save();

    ctx.translate(
        bird.x,
        bird.y
    );


    // Body

    ctx.fillStyle = "#facc15";

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        birdSize / 2,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Eye

    ctx.fillStyle = "white";

    ctx.beginPath();

    ctx.arc(
        8,
        -7,
        6,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle = "black";

    ctx.beginPath();

    ctx.arc(
        10,
        -7,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Beak

    ctx.fillStyle = "#f97316";

    ctx.beginPath();

    ctx.moveTo(14, 0);

    ctx.lineTo(30, 6);

    ctx.lineTo(14, 10);

    ctx.closePath();

    ctx.fill();


    // Wing

    ctx.fillStyle = "#eab308";

    ctx.beginPath();

    ctx.ellipse(
        -5,
        8,
        12,
        7,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.restore();

}


// ===============================
// DRAW PIPES
// ===============================

function drawPipes() {

    pipes.forEach(pipe => {

        ctx.fillStyle = "#22c55e";


        // Top pipe

        ctx.fillRect(
            pipe.x,
            0,
            pipeWidth,
            pipe.gapTop
        );


        // Top pipe cap

        ctx.fillRect(
            pipe.x - 5,
            pipe.gapTop - 15,
            pipeWidth + 10,
            15
        );


        // Bottom pipe

        const bottomY =
            pipe.gapTop +
            pipeGap;


        ctx.fillRect(
            pipe.x,
            bottomY,
            pipeWidth,
            canvas.height - bottomY
        );


        // Bottom cap

        ctx.fillRect(
            pipe.x - 5,
            bottomY,
            pipeWidth + 10,
            15
        );

    });

}


// ===============================
// UPDATE PIPES
// ===============================

function updatePipes() {

    pipes.forEach(pipe => {

        pipe.x -= pipeSpeed;


        // Score

        if (
            !pipe.scored &&
            pipe.x + pipeWidth < bird.x
        ) {

            score++;

            pipe.scored = true;


            document
                .getElementById("score")
                .textContent = score;


            document
                .getElementById("currentScore")
                .textContent = score;

        }

    });


    // Remove old pipes

    pipes =
        pipes.filter(
            pipe =>
                pipe.x + pipeWidth > 0
        );


    // Create new pipe

    if (
        frame % 110 === 0
    ) {

        createPipe();

    }

}


// ===============================
// COLLISION
// ===============================

function checkCollision() {

    // Ground

    if (
        bird.y + birdSize / 2 >=
        canvas.height
    ) {

        return true;

    }


    // Ceiling

    if (
        bird.y - birdSize / 2 <= 0
    ) {

        return true;

    }


    // Pipes

    for (let pipe of pipes) {

        const birdLeft =
            bird.x -
            birdSize / 2;

        const birdRight =
            bird.x +
            birdSize / 2;

        const birdTop =
            bird.y -
            birdSize / 2;

        const birdBottom =
            bird.y +
            birdSize / 2;


        const pipeLeft =
            pipe.x;

        const pipeRight =
            pipe.x +
            pipeWidth;


        const hitsPipeX =
            birdRight > pipeLeft &&
            birdLeft < pipeRight;


        const hitsTopPipe =
            birdTop <
            pipe.gapTop;


        const hitsBottomPipe =
            birdBottom >
            pipe.gapTop +
            pipeGap;


        if (
            hitsPipeX &&
            (hitsTopPipe ||
             hitsBottomPipe)
        ) {

            return true;

        }

    }


    return false;

}


// ===============================
// UPDATE BIRD
// ===============================

function updateBird() {

    bird.velocity += gravity;

    bird.y += bird.velocity;

}


// ===============================
// GAME LOOP
// ===============================

function gameLoop() {

    if (!gameRunning) {

        return;

    }


    frame++;


    drawBackground();

    updateBird();

    updatePipes();

    drawPipes();

    drawBird();


    if (checkCollision()) {

        endGame();

        return;

    }


    animationId =
        requestAnimationFrame(
            gameLoop
        );

}


// ===============================
// GAME OVER
// ===============================

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


// ===============================
// HIGH SCORE
// ===============================

function saveHighScore() {

    if (score > highScore) {

        highScore = score;


        localStorage.setItem(
            "flappyHighScore",
            highScore
        );

    }


    document
        .getElementById("highScore")
        .textContent = highScore;

}


// ===============================
// RESTART
// ===============================

function restartGame() {

    startGame();

}


// ===============================
// INITIALIZE
// ===============================

createBird();

document
    .getElementById("highScore")
    .textContent = highScore;

