const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");


// =========================
// GAME VARIABLES
// =========================

let gameRunning = false;

let animationId;

let score = 0;

let lives = 3;

let frame = 0;

let roadOffset = 0;


// =========================
// HIGH SCORE
// =========================

let highScore =
    Number(
        localStorage.getItem(
            "racingHighScore"
        )
    ) || 0;


document.getElementById(
    "highScore"
).textContent = highScore;


// =========================
// PLAYER CAR
// =========================

const player = {

    width: 45,

    height: 75,

    x: 177,

    y: 540,

    speed: 7

};


let leftPressed = false;

let rightPressed = false;


// =========================
// ROAD
// =========================

const roadLeft = 50;

const roadRight = 350;

const roadWidth =
    roadRight - roadLeft;


// =========================
// ENEMY CARS
// =========================

let enemies = [];

const enemyWidth = 45;

const enemyHeight = 75;

let enemySpeed = 4;


// =========================
// CREATE ENEMY
// =========================

function createEnemy() {

    const lanes = [
        80,
        177,
        274
    ];


    const lane =
        lanes[
            Math.floor(
                Math.random() *
                lanes.length
            )
        ];


    // Avoid creating enemy
    // too close to another car

    const tooClose =
        enemies.some(enemy =>
            enemy.x === lane &&
            enemy.y < 150
        );


    if (tooClose) {
        return;
    }


    enemies.push({

        x: lane,

        y: -enemyHeight,

        width: enemyWidth,

        height: enemyHeight,

        speed:
            enemySpeed +
            Math.random() * 1.5

    });

}


// =========================
// START GAME
// =========================

function startGame() {

    document.getElementById(
        "startScreen"
    ).style.display = "none";


    document.getElementById(
        "gameOver"
    ).style.display = "none";


    document.getElementById(
        "winScreen"
    ).style.display = "none";


    score = 0;

    lives = 3;

    frame = 0;

    roadOffset = 0;

    enemies = [];

    enemySpeed = 4;


    player.x = 177;


    updateUI();


    gameRunning = true;


    cancelAnimationFrame(
        animationId
    );


    gameLoop();

}


// =========================
// UPDATE UI
// =========================

function updateUI() {

    document.getElementById(
        "score"
    ).textContent = score;


    document.getElementById(
        "lives"
    ).textContent = lives;


    document.getElementById(
        "speed"
    ).textContent =
        Math.floor(
            enemySpeed / 2
        ) + 1;

}


// =========================
// DRAW ROAD
// =========================

function drawRoad() {

    // Grass

    ctx.fillStyle = "#166534";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Road

    ctx.fillStyle = "#27272a";

    ctx.fillRect(
        roadLeft,
        0,
        roadWidth,
        canvas.height
    );


    // Road edges

    ctx.fillStyle = "#f8fafc";

    ctx.fillRect(
        roadLeft,
        0,
        5,
        canvas.height
    );


    ctx.fillRect(
        roadRight - 5,
        0,
        5,
        canvas.height
    );


    // Lane markings

    ctx.fillStyle = "#facc15";


    const lane1 =
        roadLeft +
        roadWidth / 3;


    const lane2 =
        roadLeft +
        roadWidth * 2 / 3;


    for (
        let y = -80 + roadOffset;
        y < canvas.height;
        y += 100
    ) {

        ctx.fillRect(
            lane1 - 3,
            y,
            6,
            55
        );


        ctx.fillRect(
            lane2 - 3,
            y,
            6,
            55
        );

    }


    roadOffset += enemySpeed;


    if (roadOffset >= 100) {
        roadOffset = 0;
    }

}


// =========================
// DRAW PLAYER CAR
// =========================

function drawPlayer() {

    const x = player.x;

    const y = player.y;


    // Shadow

    ctx.fillStyle =
        "rgba(0,0,0,0.3)";

    ctx.fillRect(
        x - 3,
        y + 5,
        player.width + 6,
        player.height
    );


    // Main body

    ctx.fillStyle = "#ef4444";

    ctx.beginPath();

    ctx.roundRect(
        x,
        y,
        player.width,
        player.height,
        10
    );

    ctx.fill();


    // Windshield

    ctx.fillStyle = "#38bdf8";

    ctx.beginPath();

    ctx.roundRect(
        x + 8,
        y + 10,
        player.width - 16,
        22,
        5
    );

    ctx.fill();


    // Front glass

    ctx.fillStyle = "#0ea5e9";

    ctx.beginPath();

    ctx.roundRect(
        x + 8,
        y + 40,
        player.width - 16,
        17,
        5
    );

    ctx.fill();


    // Wheels

    ctx.fillStyle = "#111827";


    ctx.fillRect(
        x - 5,
        y + 10,
        7,
        20
    );


    ctx.fillRect(
        x + player.width - 2,
        y + 10,
        7,
        20
    );


    ctx.fillRect(
        x - 5,
        y + 48,
        7,
        20
    );


    ctx.fillRect(
        x + player.width - 2,
        y + 48,
        7,
        20
    );


    // Lights

    ctx.fillStyle = "#fef08a";

    ctx.fillRect(
        x + 6,
        y + 3,
        9,
        5
    );


    ctx.fillRect(
        x + player.width - 15,
        y + 3,
        9,
        5
    );

}


// =========================
// DRAW ENEMY CAR
// =========================

function drawEnemy(enemy) {

    const x = enemy.x;

    const y = enemy.y;


    // Body

    ctx.fillStyle = "#3b82f6";

    ctx.beginPath();

    ctx.roundRect(
        x,
        y,
        enemy.width,
        enemy.height,
        10
    );

    ctx.fill();


    // Windshield

    ctx.fillStyle = "#bae6fd";

    ctx.beginPath();

    ctx.roundRect(
        x + 8,
        y + 10,
        enemy.width - 16,
        22,
        5
    );

    ctx.fill();


    // Window

    ctx.fillStyle = "#0284c7";

    ctx.beginPath();

    ctx.roundRect(
        x + 8,
        y + 40,
        enemy.width - 16,
        17,
        5
    );

    ctx.fill();


    // Wheels

    ctx.fillStyle = "#111827";


    ctx.fillRect(
        x - 5,
        y + 10,
        7,
        20
    );


    ctx.fillRect(
        x + enemy.width - 2,
        y + 10,
        7,
        20
    );


    ctx.fillRect(
        x - 5,
        y + 48,
        7,
        20
    );


    ctx.fillRect(
        x + enemy.width - 2,
        y + 48,
        7,
        20
    );


    // Rear lights

    ctx.fillStyle = "#ef4444";


    ctx.fillRect(
        x + 6,
        y + enemy.height - 8,
        9,
        5
    );


    ctx.fillRect(
        x + enemy.width - 15,
        y + enemy.height - 8,
        9,
        5
    );

}


// =========================
// UPDATE ENEMIES
// =========================

function updateEnemies() {

    enemies.forEach(enemy => {

        enemy.y += enemy.speed;

    });


    // Remove cars that passed

    enemies =
        enemies.filter(enemy => {

            if (
                enemy.y >
                canvas.height
            ) {

                score++;

                updateUI();

                return false;

            }

            return true;

        });


    // Increase difficulty

    if (
        score > 0 &&
        score % 10 === 0
    ) {

        enemySpeed =
            Math.min(
                10,
                4 + score / 10
            );

    }


    // Spawn enemies

    const spawnRate =
        Math.max(
            35,
            80 - score
        );


    if (
        frame % spawnRate === 0
    ) {

        createEnemy();

    }

}


// =========================
// COLLISION
// =========================

function checkCollision() {

    for (
        let i = enemies.length - 1;
        i >= 0;
        i--
    ) {

        const enemy =
            enemies[i];


        const padding = 6;


        if (

            player.x + padding <
                enemy.x + enemy.width - padding &&

            player.x + player.width - padding >
                enemy.x + padding &&

            player.y + padding <
                enemy.y + enemy.height - padding &&

            player.y + player.height - padding >
                enemy.y + padding

        ) {

            enemies.splice(i, 1);

            lives--;

            updateUI();


            if (lives <= 0) {

                gameOver();

            }

            else {

                player.x = 177;

            }


            return;

        }

    }

}


// =========================
// PLAYER MOVEMENT
// =========================

function updatePlayer() {

    if (leftPressed) {

        player.x -= player.speed;

    }


    if (rightPressed) {

        player.x += player.speed;

    }


    // Keep car inside road

    if (
        player.x < roadLeft + 10
    ) {

        player.x =
            roadLeft + 10;

    }


    if (
        player.x + player.width >
        roadRight - 10
    ) {

        player.x =
            roadRight -
            10 -
            player.width;

    }

}


// =========================
// KEYBOARD
// =========================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a"
        ) {

            event.preventDefault();

            leftPressed = true;

        }


        if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {

            event.preventDefault();

            rightPressed = true;

        }

    }
);


document.addEventListener(
    "keyup",
    function(event) {

        if (
            event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a"
        ) {

            leftPressed = false;

        }


        if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {

            rightPressed = false;

        }

    }
);


// =========================
// MOBILE CONTROL
// =========================

function moveCar(direction) {

    if (!gameRunning) {
        return;
    }


    const moveAmount = 45;


    if (direction === "LEFT") {

        player.x -= moveAmount;

    }


    else if (
        direction === "RIGHT"
    ) {

        player.x += moveAmount;

    }


    keepPlayerInside();

}


function keepPlayerInside() {

    if (
        player.x < roadLeft + 10
    ) {

        player.x =
            roadLeft + 10;

    }


    if (
        player.x + player.width >
        roadRight - 10
    ) {

        player.x =
            roadRight -
            10 -
            player.width;

    }

}


// =========================
// GAME LOOP
// =========================

function gameLoop() {

    if (!gameRunning) {
        return;
    }


    frame++;


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    drawRoad();


    updatePlayer();

    updateEnemies();


    enemies.forEach(
        drawEnemy
    );


    drawPlayer();


    checkCollision();


    animationId =
        requestAnimationFrame(
            gameLoop
        );

}


// =========================
// GAME OVER
// =========================

function gameOver() {

    gameRunning = false;


    cancelAnimationFrame(
        animationId
    );


    document.getElementById(
        "finalScore"
    ).textContent = score;


    document.getElementById(
        "gameOver"
    ).style.display = "flex";


    saveHighScore();

}


// =========================
// HIGH SCORE
// =========================

function saveHighScore() {

    if (
        score > highScore
    ) {

        highScore = score;


        localStorage.setItem(
            "racingHighScore",
            highScore
        );

    }


    document.getElementById(
        "highScore"
    ).textContent =
        highScore;

}


// =========================
// RESTART
// =========================

function restartGame() {

    startGame();

}


// =========================
// INITIALIZE
// =========================

updateUI();

drawRoad();

drawPlayer();