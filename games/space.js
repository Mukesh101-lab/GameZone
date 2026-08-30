
const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");


// =================================
// GAME VARIABLES
// =================================

let player;

let bullets = [];

let enemies = [];

let stars = [];

let score = 0;

let lives = 3;

let gameRunning = false;

let animationId;

let frame = 0;


let highScore =
    Number(
        localStorage.getItem(
            "spaceHighScore"
        )
    ) || 0;


document.getElementById(
    "highScore"
).textContent = highScore;


// =================================
// PLAYER
// =================================

function createPlayer() {

    player = {

        x: canvas.width / 2,

        y: canvas.height - 70,

        width: 40,

        height: 40,

        speed: 9

    };

}


// =================================
// STARS
// =================================

function createStars() {

    stars = [];

    for (
        let i = 0;
        i < 80;
        i++
    ) {

        stars.push({

            x:
                Math.random() *
                canvas.width,

            y:
                Math.random() *
                canvas.height,

            size:
                Math.random() * 2 + 1,

            speed:
                Math.random() * 2 + 1

        });

    }

}


// =================================
// KEYBOARD
// =================================

let leftPressed = false;

let rightPressed = false;


document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a"
        ) {

            leftPressed = true;

        }


        if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {

            rightPressed = true;

        }


        if (
            event.code === "Space"
        ) {

            event.preventDefault();

            shoot();

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


// =================================
// START GAME
// =================================

function startGame() {

    document.getElementById(
        "startScreen"
    ).style.display = "none";


    document.getElementById(
        "gameOver"
    ).style.display = "none";


    score = 0;

    lives = 3;

    frame = 0;

    bullets = [];

    enemies = [];


    document.getElementById(
        "score"
    ).textContent = score;


    document.getElementById(
        "lives"
    ).textContent = lives;


    createPlayer();

    createStars();


    gameRunning = true;


    cancelAnimationFrame(
        animationId
    );


    gameLoop();

}


// =================================
// DRAW BACKGROUND
// =================================

function drawBackground() {

    ctx.fillStyle = "#050816";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    stars.forEach(star => {

        ctx.fillStyle = "#ffffff";

        ctx.globalAlpha =
            Math.random() * 0.7 + 0.3;

        ctx.fillRect(
            star.x,
            star.y,
            star.size,
            star.size
        );

    });


    ctx.globalAlpha = 1;

}


// =================================
// UPDATE STARS
// =================================

function updateStars() {

    stars.forEach(star => {

        star.y += star.speed;


        if (
            star.y >
            canvas.height
        ) {

            star.y = 0;

            star.x =
                Math.random() *
                canvas.width;

        }

    });

}


// =================================
// DRAW PLAYER
// =================================

function drawPlayer() {

    ctx.save();

    ctx.translate(
        player.x,
        player.y
    );


    // Ship

    ctx.fillStyle = "#8b5cf6";

    ctx.beginPath();

    ctx.moveTo(
        0,
        -25
    );

    ctx.lineTo(
        -22,
        22
    );

    ctx.lineTo(
        0,
        15
    );

    ctx.lineTo(
        22,
        22
    );

    ctx.closePath();

    ctx.fill();


    // Cockpit

    ctx.fillStyle = "#38bdf8";

    ctx.beginPath();

    ctx.arc(
        0,
        -7,
        7,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Engine

    ctx.fillStyle = "#f97316";

    ctx.beginPath();

    ctx.moveTo(
        -7,
        15
    );

    ctx.lineTo(
        0,
        30
    );

    ctx.lineTo(
        7,
        15
    );

    ctx.closePath();

    ctx.fill();


    ctx.restore();

}


// =================================
// MOVE PLAYER
// =================================

function updatePlayer() {

    if (leftPressed) {

        player.x -=
            player.speed;

    }


    if (rightPressed) {

        player.x +=
            player.speed;

    }


    // Keep inside canvas

    if (
        player.x -
        player.width / 2 < 0
    ) {

        player.x =
            player.width / 2;

    }


    if (
        player.x +
        player.width / 2 >
        canvas.width
    ) {

        player.x =
            canvas.width -
            player.width / 2;

    }

}


// =================================
// SHOOT
// =================================

function shoot() {

    if (!gameRunning) {

        return;

    }


    bullets.push({

        x: player.x,

        y: player.y - 25,

        width: 4,

        height: 14,

        speed: 12

    });

}


// =================================
// DRAW BULLETS
// =================================

function drawBullets() {

    ctx.fillStyle = "#facc15";


    bullets.forEach(
        bullet => {

            ctx.fillRect(
                bullet.x -
                bullet.width / 2,

                bullet.y,

                bullet.width,

                bullet.height
            );

        }
    );

}


// =================================
// UPDATE BULLETS
// =================================

function updateBullets() {

    bullets.forEach(
        bullet => {

            bullet.y -=
                bullet.speed;

        }
    );


    bullets =
        bullets.filter(
            bullet =>
                bullet.y > -20
        );

}


// =================================
// CREATE ENEMY
// =================================

function createEnemy() {

    enemies.push({

        x:
            Math.random() *
            (canvas.width - 50) +
            25,

        y: -30,

        width: 38,

        height: 30,

        speed:
            Math.random() *
            1.5 + 1

    });

}


// =================================
// DRAW ENEMIES
// =================================

function drawEnemies() {

    enemies.forEach(
        enemy => {

            ctx.save();

            ctx.translate(
                enemy.x,
                enemy.y
            );


            // Body

            ctx.fillStyle =
                "#ef4444";

            ctx.beginPath();

            ctx.moveTo(
                0,
                20
            );

            ctx.lineTo(
                -20,
                -10
            );

            ctx.lineTo(
                20,
                -10
            );

            ctx.closePath();

            ctx.fill();


            // Eye

            ctx.fillStyle =
                "#facc15";

            ctx.beginPath();

            ctx.arc(
                0,
                0,
                6,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.restore();

        }
    );

}


// =================================
// UPDATE ENEMIES
// =================================

function updateEnemies() {

    enemies.forEach(
        enemy => {

            enemy.y +=
                enemy.speed;

        }
    );


    // Enemy reaches bottom

    for (
        let i = enemies.length - 1;
        i >= 0;
        i--
    ) {

        if (
            enemies[i].y >
            canvas.height + 40
        ) {

            enemies.splice(
                i,
                1
            );

            loseLife();

        }

    }

}


// =================================
// COLLISION
// =================================

function collisionDetection() {

    // Bullet vs Enemy

    for (
        let i = bullets.length - 1;
        i >= 0;
        i--
    ) {

        for (
            let j = enemies.length - 1;
            j >= 0;
            j--
        ) {

            const bullet =
                bullets[i];

            const enemy =
                enemies[j];


            if (

                bullet.x >
                enemy.x -
                enemy.width / 2 &&

                bullet.x <
                enemy.x +
                enemy.width / 2 &&

                bullet.y <
                enemy.y +
                enemy.height / 2 &&

                bullet.y +
                bullet.height >
                enemy.y -
                enemy.height / 2

            ) {

                bullets.splice(
                    i,
                    1
                );

                enemies.splice(
                    j,
                    1
                );


                score++;


                document.getElementById(
                    "score"
                ).textContent = score;


                break;

            }

        }

    }


    // Enemy vs Player

    for (
        let i = enemies.length - 1;
        i >= 0;
        i--
    ) {

        const enemy =
            enemies[i];


        const distance =
            Math.hypot(
                player.x -
                enemy.x,

                player.y -
                enemy.y
            );


        if (
            distance <
            35
        ) {

            enemies.splice(
                i,
                1
            );


            loseLife();

        }

    }

}


// =================================
// LOSE LIFE
// =================================

function loseLife() {

    lives--;


    document.getElementById(
        "lives"
    ).textContent = lives;


    if (
        lives <= 0
    ) {

        endGame();

    }

}


// =================================
// GAME LOOP
// =================================

function gameLoop() {

    if (!gameRunning) {

        return;

    }


    frame++;


    drawBackground();

    updateStars();


    updatePlayer();

    drawPlayer();


    updateBullets();

    drawBullets();


    updateEnemies();

    drawEnemies();


    collisionDetection();


    // Create enemies

    if (
        frame % 60 === 0
    ) {

        createEnemy();

    }


    animationId =
        requestAnimationFrame(
            gameLoop
        );

}


// =================================
// GAME OVER
// =================================

function endGame() {

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


// =================================
// HIGH SCORE
// =================================

function saveHighScore() {

    if (
        score > highScore
    ) {

        highScore = score;


        localStorage.setItem(
            "spaceHighScore",
            highScore
        );

    }


    document.getElementById(
        "highScore"
    ).textContent =
        highScore;

}


// =================================
// MOBILE
// =================================

function movePlayer(direction) {

    if (!gameRunning) {

        return;

    }


    if (
        direction === "LEFT"
    ) {

        player.x -= 70;

    }


    if (
        direction === "RIGHT"
    ) {

        player.x += 70;

    }


    updatePlayer();

}


// =================================
// RESTART
// =================================

function restartGame() {

    startGame();

}


// =================================
// INITIALIZE
// =================================

createPlayer();

createStars();

