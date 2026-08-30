
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


// ======================================
// GAME VARIABLES
// ======================================

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const BUBBLE_RADIUS = 17;
const ROW_HEIGHT = 31;

const COLORS = [
    "#ef4444",
    "#facc15",
    "#22c55e",
    "#3b82f6",
    "#a855f7",
    "#ec4899"
];

let bubbles = [];

let shooter = null;
let nextColor = null;

let score = 0;
let shots = 0;

let highScore =
    Number(localStorage.getItem("bubbleHighScore")) || 0;

let gameRunning = false;

let animationId;

let aimX = WIDTH / 2;
let aimY = 300;

let shooting = false;


// ======================================
// UI
// ======================================

document.getElementById("highScore").textContent =
    highScore;


// ======================================
// CREATE BOARD
// ======================================

function createBoard() {

    bubbles = [];

    const rows = 7;
    const columns = 13;

    for (let row = 0; row < rows; row++) {

        for (let column = 0; column < columns; column++) {

            let x =
                column * (BUBBLE_RADIUS * 2);

            if (row % 2 === 1) {
                x += BUBBLE_RADIUS;
            }

            x += BUBBLE_RADIUS;

            let y =
                row * ROW_HEIGHT +
                BUBBLE_RADIUS +
                10;

            if (x + BUBBLE_RADIUS > WIDTH) {
                continue;
            }

            bubbles.push({

                x: x,

                y: y,

                color:
                    randomColor(),

                row: row,

                column: column

            });

        }

    }

}


// ======================================
// RANDOM COLOR
// ======================================

function randomColor() {

    return COLORS[
        Math.floor(
            Math.random() * COLORS.length
        )
    ];

}


// ======================================
// CREATE SHOOTER
// ======================================

function createShooter() {

    shooter = {

        x: WIDTH / 2,

        y: HEIGHT - 45,

        color: nextColor || randomColor(),

        vx: 0,

        vy: 0,

        moving: false

    };

    nextColor = randomColor();

    updateNextBubble();

}


// ======================================
// NEXT BUBBLE
// ======================================

function updateNextBubble() {

    const element =
        document.getElementById("nextBubble");

    const index =
        COLORS.indexOf(nextColor);

    const emoji = [
        "🔴",
        "🟡",
        "🟢",
        "🔵",
        "🟣",
        "🩷"
    ];

    element.textContent =
        emoji[index] || "🟣";

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

    document
        .getElementById("score")
        .textContent = score;

    document
        .getElementById("shots")
        .textContent = shots;


    createBoard();

    nextColor = randomColor();

    createShooter();

    gameRunning = true;

    cancelAnimationFrame(animationId);

    gameLoop();

}


// ======================================
// DRAW BACKGROUND
// ======================================

function drawBackground() {

    ctx.fillStyle = "#10182b";

    ctx.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );


    // Background glow

    const gradient =
        ctx.createRadialGradient(
            WIDTH / 2,
            HEIGHT - 100,
            20,
            WIDTH / 2,
            HEIGHT - 100,
            400
        );

    gradient.addColorStop(
        0,
        "#25134a"
    );

    gradient.addColorStop(
        1,
        "#10182b"
    );

    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );


    // Small stars

    ctx.fillStyle = "#ffffff18";

    for (let i = 0; i < 35; i++) {

        let x = (i * 97) % WIDTH;
        let y = (i * 53) % HEIGHT;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            1.5,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

}


// ======================================
// DRAW BUBBLE
// ======================================

function drawBubble(x, y, color, radius) {

    // Glow

    ctx.shadowBlur = 12;
    ctx.shadowColor = color;

    const gradient =
        ctx.createRadialGradient(
            x - 6,
            y - 7,
            2,
            x,
            y,
            radius
        );

    gradient.addColorStop(
        0,
        "#ffffff"
    );

    gradient.addColorStop(
        0.18,
        color
    );

    gradient.addColorStop(
        1,
        color
    );

    ctx.fillStyle = gradient;

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.shadowBlur = 0;


    // Highlight

    ctx.fillStyle = "#ffffff80";

    ctx.beginPath();

    ctx.arc(
        x - 6,
        y - 7,
        4,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Border

    ctx.strokeStyle = "#ffffff30";

    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
    );

    ctx.stroke();

}


// ======================================
// DRAW BOARD
// ======================================

function drawBoard() {

    bubbles.forEach(bubble => {

        drawBubble(
            bubble.x,
            bubble.y,
            bubble.color,
            BUBBLE_RADIUS
        );

    });

}


// ======================================
// DRAW SHOOTER
// ======================================

function drawShooter() {

    if (!shooter) {
        return;
    }


    drawBubble(
        shooter.x,
        shooter.y,
        shooter.color,
        BUBBLE_RADIUS
    );


    // Shooter base

    ctx.fillStyle = "#7c3aed";

    ctx.beginPath();

    ctx.roundRect(
        WIDTH / 2 - 35,
        HEIGHT - 20,
        70,
        12,
        6
    );

    ctx.fill();

}


// ======================================
// DRAW AIM LINE
// ======================================

function drawAimLine() {

    if (!gameRunning || shooter.moving) {
        return;
    }


    const dx =
        aimX - shooter.x;

    const dy =
        aimY - shooter.y;

    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    if (distance === 0) {
        return;
    }


    const dirX =
        dx / distance;

    const dirY =
        dy / distance;


    // Don't aim downward

    if (dirY > -0.1) {
        return;
    }


    ctx.setLineDash([
        7,
        8
    ]);

    ctx.strokeStyle =
        "#ffffff55";

    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.moveTo(
        shooter.x,
        shooter.y
    );

    ctx.lineTo(
        shooter.x +
        dirX * 180,

        shooter.y +
        dirY * 180
    );

    ctx.stroke();

    ctx.setLineDash([]);

}


// ======================================
// SHOOT
// ======================================

function shoot() {

    if (!gameRunning) {
        return;
    }

    if (shooter.moving) {
        return;
    }


    const dx =
        aimX - shooter.x;

    const dy =
        aimY - shooter.y;


    if (dy >= -20) {
        return;
    }


    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    shooter.vx =
        (dx / distance) * 9;

    shooter.vy =
        (dy / distance) * 9;

    shooter.moving = true;

    shooting = true;

    shots++;

    document
        .getElementById("shots")
        .textContent = shots;

}


// ======================================
// UPDATE SHOOTER
// ======================================

function updateShooter() {

    if (!shooter || !shooter.moving) {
        return;
    }


    shooter.x += shooter.vx;

    shooter.y += shooter.vy;


    // Wall bounce

    if (
        shooter.x -
        BUBBLE_RADIUS <= 0
    ) {

        shooter.x =
            BUBBLE_RADIUS;

        shooter.vx =
            Math.abs(shooter.vx);

    }


    if (
        shooter.x +
        BUBBLE_RADIUS >= WIDTH
    ) {

        shooter.x =
            WIDTH -
            BUBBLE_RADIUS;

        shooter.vx =
            -Math.abs(shooter.vx);

    }


    // Ceiling

    if (
        shooter.y -
        BUBBLE_RADIUS <= 0
    ) {

        attachShooter();

        return;

    }


    // Bubble collision

    for (let bubble of bubbles) {

        const dx =
            shooter.x -
            bubble.x;

        const dy =
            shooter.y -
            bubble.y;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            distance <
            BUBBLE_RADIUS * 2 - 2
        ) {

            attachShooter();

            return;

        }

    }

}


// ======================================
// ATTACH SHOOTER
// ======================================

function attachShooter() {

    shooter.moving = false;


    // Find closest position

    let bestX =
        shooter.x;

    let bestY =
        shooter.y;


    // Snap to bubble grid

    let row =
        Math.max(
            0,
            Math.round(
                (shooter.y - BUBBLE_RADIUS - 10)
                / ROW_HEIGHT
            )
        );


    let offset =
        row % 2 === 1
            ? BUBBLE_RADIUS
            : 0;


    let column =
        Math.round(
            (shooter.x -
                BUBBLE_RADIUS -
                offset)
            / (BUBBLE_RADIUS * 2)
        );


    bestX =
        column *
        BUBBLE_RADIUS *
        2 +
        BUBBLE_RADIUS +
        offset;


    bestY =
        row *
        ROW_HEIGHT +
        BUBBLE_RADIUS +
        10;


    // Keep inside board

    bestX =
        Math.max(
            BUBBLE_RADIUS,
            Math.min(
                WIDTH -
                BUBBLE_RADIUS,
                bestX
            )
        );


    bestY =
        Math.max(
            BUBBLE_RADIUS + 10,
            bestY
        );


    const newBubble = {

        x: bestX,

        y: bestY,

        color: shooter.color,

        row: row,

        column: column

    };


    bubbles.push(newBubble);


    // Find matching group

    const group =
        findConnectedSameColor(
            newBubble
        );


    if (group.length >= 3) {

        removeBubbles(group);

    }


    // New shooter

    createShooter();


    // Check win

    if (bubbles.length === 0) {

        winGame();

        return;

    }


    // Too low

    for (let bubble of bubbles) {

        if (
            bubble.y >
            HEIGHT - 120
        ) {

            endGame();

            return;

        }

    }

}


// ======================================
// FIND MATCHES
// ======================================

function findConnectedSameColor(start) {

    const visited =
        new Set();

    const group = [];

    const queue = [start];


    while (queue.length > 0) {

        const current =
            queue.shift();


        if (
            visited.has(current)
        ) {
            continue;
        }


        visited.add(current);


        if (
            current.color !==
            start.color
        ) {
            continue;
        }


        group.push(current);


        for (let bubble of bubbles) {

            if (
                visited.has(bubble)
            ) {
                continue;
            }


            const dx =
                current.x -
                bubble.x;

            const dy =
                current.y -
                bubble.y;

            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (
                distance <
                BUBBLE_RADIUS * 2.3
            ) {

                queue.push(bubble);

            }

        }

    }


    return group;

}


// ======================================
// REMOVE BUBBLES
// ======================================

function removeBubbles(group) {

    const removeSet =
        new Set(group);


    bubbles =
        bubbles.filter(
            bubble =>
                !removeSet.has(bubble)
        );


    score +=
        group.length * 10;


    document
        .getElementById("score")
        .textContent = score;

}


// ======================================
// TOUCH CONTROLS
// ======================================

function updateAim(clientX, clientY) {

    const rect =
        canvas.getBoundingClientRect();


    const scaleX =
        WIDTH /
        rect.width;

    const scaleY =
        HEIGHT /
        rect.height;


    aimX =
        (clientX -
            rect.left) *
        scaleX;


    aimY =
        (clientY -
            rect.top) *
        scaleY;


    // Prevent aiming downward

    if (
        aimY >
        shooter.y - 20
    ) {

        aimY =
            shooter.y - 20;

    }

}


// Touch start

canvas.addEventListener(
    "touchstart",
    function(event) {

        if (!gameRunning) {
            return;
        }

        event.preventDefault();

        const touch =
            event.touches[0];

        updateAim(
            touch.clientX,
            touch.clientY
        );

    },
    {
        passive: false
    }
);


// Drag finger

canvas.addEventListener(
    "touchmove",
    function(event) {

        if (!gameRunning) {
            return;
        }

        event.preventDefault();

        const touch =
            event.touches[0];

        updateAim(
            touch.clientX,
            touch.clientY
        );

    },
    {
        passive: false
    }
);


// Release finger = SHOOT

canvas.addEventListener(
    "touchend",
    function(event) {

        if (!gameRunning) {
            return;
        }

        event.preventDefault();

        shoot();

    },
    {
        passive: false
    }
);


// ======================================
// MOUSE SUPPORT
// ======================================

canvas.addEventListener(
    "mousemove",
    function(event) {

        if (!gameRunning) {
            return;
        }

        updateAim(
            event.clientX,
            event.clientY
        );

    }
);


canvas.addEventListener(
    "click",
    function() {

        if (!gameRunning) {
            return;
        }

        shoot();

    }
);


// ======================================
// KEYBOARD
// ======================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.code === "Space" ||
            event.code === "Enter"
        ) {

            event.preventDefault();

            shoot();

        }

    }
);


// ======================================
// GAME LOOP
// ======================================

function gameLoop() {

    if (!gameRunning) {
        return;
    }


    ctx.clearRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );


    drawBackground();

    drawAimLine();

    drawBoard();

    updateShooter();

    drawShooter();


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

    if (score > highScore) {

        highScore = score;

        localStorage.setItem(
            "bubbleHighScore",
            highScore
        );

    }


    document
        .getElementById("highScore")
        .textContent = highScore;

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

createShooter();

document
    .getElementById("startScreen")
    .style.display = "flex";

