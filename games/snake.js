
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;

let snake;
let food;

let direction;
let nextDirection;

let score = 0;
let highScore = localStorage.getItem("snakeHighScore") || 0;

let gameLoop;


document.getElementById("highScore").textContent = highScore;


// Start Game
function startGame() {

    // Google Analytics - Track game start
    if (typeof gtag === "function") {

        gtag("event", "game_start", {
            game_name: "Snake"
        });

    }


    snake = [
        {
            x: 200,
            y: 200
        },
        {
            x: 180,
            y: 200
        },
        {
            x: 160,
            y: 200
        }
    ];

    direction = "RIGHT";
    nextDirection = "RIGHT";

    score = 0;

    updateScore();

    createFood();

    clearInterval(gameLoop);

    gameLoop = setInterval(drawGame, 170);
}


// Create Food
function createFood() {

    food = {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };


    // Food should not appear inside snake
    for (let part of snake) {

        if (
            part.x === food.x &&
            part.y === food.y
        ) {
            createFood();
            return;
        }
    }
}


// Change Direction
function changeDirection(newDirection) {

    const opposite = {
        UP: "DOWN",
        DOWN: "UP",
        LEFT: "RIGHT",
        RIGHT: "LEFT"
    };

    if (newDirection !== opposite[direction]) {
        nextDirection = newDirection;
    }
}


// Keyboard Controls
document.addEventListener("keydown", function(event) {

    if (event.key === "ArrowUp") {
        changeDirection("UP");
    }

    if (event.key === "ArrowDown") {
        changeDirection("DOWN");
    }

    if (event.key === "ArrowLeft") {
        changeDirection("LEFT");
    }

    if (event.key === "ArrowRight") {
        changeDirection("RIGHT");
    }
});


// Draw Game
function drawGame() {

    direction = nextDirection;


    // Background
    ctx.fillStyle = "#0f1323";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Draw grid
    ctx.strokeStyle = "#171b2d";

    for (let x = 0; x <= canvas.width; x += box) {

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (let y = 0; y <= canvas.height; y += box) {

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }


    // Draw food
    ctx.fillStyle = "#ef4444";

    ctx.beginPath();

    ctx.arc(
        food.x + box / 2,
        food.y + box / 2,
        box / 2 - 2,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Snake head
    let head = {
        x: snake[0].x,
        y: snake[0].y
    };


    if (direction === "UP") {
        head.y -= box;
    }

    if (direction === "DOWN") {
        head.y += box;
    }

    if (direction === "LEFT") {
        head.x -= box;
    }

    if (direction === "RIGHT") {
        head.x += box;
    }


    // Collision with wall
    if (
        head.x < 0 ||
        head.x >= canvas.width ||
        head.y < 0 ||
        head.y >= canvas.height
    ) {

        endGame();
        return;
    }


    // Collision with itself
    for (let part of snake) {

        if (
            head.x === part.x &&
            head.y === part.y
        ) {

            endGame();
            return;
        }
    }


    snake.unshift(head);


    // Eat food
    if (
        head.x === food.x &&
        head.y === food.y
    ) {

        score++;

        updateScore();

        createFood();

    } else {

        snake.pop();

    }


    // Draw snake
    snake.forEach((part, index) => {

        ctx.fillStyle =
            index === 0
                ? "#a78bfa"
                : "#7c3aed";

        ctx.fillRect(
            part.x + 2,
            part.y + 2,
            box - 4,
            box - 4
        );

    });
}


// Update Score
function updateScore() {

    document.getElementById("score").textContent = score;

    document.getElementById("mobileScore").textContent = score;

    document.getElementById("highScore").textContent = highScore;
}


// Game Over
function endGame() {

    clearInterval(gameLoop);

    document.getElementById("finalScore").textContent = score;

    document.getElementById("gameOver").style.display = "flex";


    if (score > highScore) {

        highScore = score;

        localStorage.setItem(
            "snakeHighScore",
            highScore
        );

        document.getElementById("highScore").textContent = highScore;
    }
}


// Restart
function restartGame() {

    document.getElementById("gameOver").style.display = "none";

    startGame();
}


// Start automatically
startGame();

