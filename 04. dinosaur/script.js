// Canvas and Context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const clouds = [];
const startBanner = document.getElementById('startBanner');
const startButton = document.getElementById('startButton');
const INITIAL_OBSTACLE_SPEED = 1;
const obstacles = [];
const thresholdX = canvas.width - 50;


// updating the random obstacles

// Set initial canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight/2;

// Apply the start-banner-active class since the start banner is visible by default
document.body.classList.add('start-banner-active');

// Images
let dinoImage = new Image();
let obstacleImage = new Image();
let cloudsImage = new Image();

//scores and
let score = 0;
let gameState = "running";  // Possible values: "running", "completed", "ended"
let level =0;


dinoImage.src = 'dino_2.svg';
obstacleImage.src = 'object.svg';
cloudsImage.src = 'clouds.svg';

// Game Objects
const dino = {
    x: 30,
    y: canvas.height,
    width: 80,
    height: 80,
    jumping: false,
    velocity: 0,
    gravity: 0.5,
    jumpSpeedX: 2,
    jumpStrength: -10
};

const obstacle = {
    x: canvas.width,
    y: canvas.height,
    z: 30,
    width: 60,
    height: 60,
    speed: INITIAL_OBSTACLE_SPEED,
    passed: false
};

const obstacle_start = {
    x: 50
}


// Calculate ground level
const groundLevel = canvas.height - dino.height + 20;  // 10 is a small offset from the bottom
dino.y = groundLevel;  // Update dino's y-coordinate to ground level
obstacle.y = groundLevel+20; 

// Add the jumpStartX variable to store the x-coordinate when the jump starts
let jumpStartX = null;

// Game Functions
function jump() {
    if (!dino.jumping && dino.y === groundLevel) {
        dino.jumping = true;
        dino.velocity = dino.jumpStrength;
        jumpStartX = dino.x; // Capture the x-coordinate when the jump starts
    }
}

function updateClouds() {
    for (let i = 0; i < clouds.length; i++) {
        clouds[i].x -= clouds[i].speed;
        if (clouds[i].x < -clouds[i].width) {
            clouds.splice(i, 1);
            i--;
        }
    }
}

function generateCloud() {
    if (Math.random() < 0.02) {
        const cloud = {
            x: canvas.width+100,
            y: Math.random() * (canvas.height / 9),
            width: 100 + Math.random() * 50,
            height: 50 + Math.random() * 30,
            speed: 0.3 + Math.random() * 0.5
        };
        clouds.push(cloud);
    }
}

function drawClouds() {
    for (const cloud of clouds) {
        ctx.drawImage(cloudsImage, cloud.x, cloud.y, cloud.width, cloud.height);
    }
}

function generateObstacle() {
    // Determine a random gap between 100 and 300 pixels
    const randomGap = 150 + Math.random() * 500;

    // Check if there are no obstacles or if the last obstacle has a sufficient gap
    if (obstacles.length === 0 || (canvas.width - obstacles[obstacles.length - 1].x) >= randomGap) {
        if (Math.random() < 0.02) {  // 2% chance to generate an obstacle
            const obstacle = {
                x: canvas.width,
                y: groundLevel + 20,
                width: 60,
                height: 60,
                speed: INITIAL_OBSTACLE_SPEED,
                passed: false
            };
            obstacles.push(obstacle);
        }
    }
}

let jumpCompleted = false;
let atJumpPeak = false;

function update() {
    if (dino.jumping) {
        dino.velocity += dino.gravity;
        dino.y += dino.velocity;
        dino.x += dino.jumpSpeedX;  // Move the dino forward in x-direction when jumping
        
        if (dino.y > groundLevel) {
            dino.y = groundLevel;
            dino.jumping = false;
        }
    }
    
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= obstacles[i].speed;

        // Collision detection for each obstacle
        if (
            dino.x + dino.width - 50 > obstacles[i].x &&
            dino.x + 50 < obstacles[i].x + obstacles[i].width &&
            dino.y + dino.height - 10 > obstacles[i].y &&
            dino.y + 10 < obstacles[i].y + obstacles[i].height
        ) {
            gameState = "ended";
        }

        // Check if the dino has passed each obstacle
        if (dino.x > obstacles[i].x + obstacles[i].width && !obstacles[i].passed) {
            score += 1;
            obstacles[i].passed = true;
        }

        // Remove the obstacle if it's near the dino's spawning area
        if (obstacles[i].x < 100) { // *********** dino.x - 30
            obstacles.splice(i, 1);
            i--;
        }
    }

    if (dino.x + dino.width >= canvas.width) {
        gameState = "completed";
        level++;  // Increment the level
        document.getElementById('nextLevelButton').textContent = "Next Level: " + level;
        return;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(dinoImage, dino.x, dino.y, dino.width, dino.height);
    for (const obstacle of obstacles) {
        ctx.drawImage(obstacleImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }    drawClouds();
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, 50, 30);
}

function levelCompleted() {
    document.getElementById('levelCompletedBanner').style.display = 'block';
}

function gameLoop() {
    if (gameState !== "completed" && gameState !== "ended") {
        update();
        updateClouds();
        generateCloud();
        generateObstacle();
        draw();
    } else if (gameState === "completed") {
        levelCompleted();
    } else if (gameState === "ended") {
        endGame();
    }
    requestAnimationFrame(gameLoop);
}

function startNextLevel() {
    // Reset dino's position
    dino.x = 30;
    dino.y = groundLevel;
    obstacle.x = canvas.width;
    // Increase the speed of the obstacle for the next level
    obstacle.speed += 0.2;
    obstacle.passed = false;  // Reset the passed property
    // score = 0;  // Reset the score
}

function endGame() {
    document.getElementById('endBanner').style.display = 'block';
}

function resetGame() {
    gameState = "running";
    dino.x = 30;
    dino.y = groundLevel;
    dino.jumping = false;
    dino.velocity = 0;
    obstacle.x = canvas.width;
    obstacle.y = groundLevel + 20;
    obstacle.passed = false;  // Reset the passed property
    clouds.length = 0;
    score = 0;  // Reset the score

    // Clear obstacles and add a new one
    obstacles.length = 0;
    const newObstacle = {
        x: canvas.width,
        y: groundLevel + 20,
        width: 60,
        height: 60,
        speed: INITIAL_OBSTACLE_SPEED,
        passed: false
    };
    obstacles.push(newObstacle);
}


// Event Listeners
document.addEventListener('keydown', () => {
    jump();
});


startButton.addEventListener('click', function() {
    startBanner.style.display = 'none';  // Hide the start banner
    gameState = "running";  // Set the game state to running
    resetGame();  // Reset the game's initial state
});


document.getElementById('startButton').addEventListener('click', function() {
    document.getElementById('startBanner').style.display = 'none';
    gameState = "running";
    gameLoop();  // Start the game loop
    resetGame();
    // gameLoop();
});

document.getElementById('restartButton').addEventListener('click', function() {
    document.getElementById('endBanner').style.display = 'none';
    gameState = "running";
    resetGame();  // This will reset the game to its initial state without increasing the speed
    // gameLoop();
});

document.getElementById('nextLevelButton').addEventListener('click', function() {
    document.getElementById('levelCompletedBanner').style.display = 'none';
    gameState = "running";  // Ensure the game state is set to running
    startNextLevel();
    // gameLoop();
});

// Update canvas dimensions when the window is resized
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight/2;
    // Recalculate ground level based on new canvas height
    const groundLevel = canvas.height - dino.height + 20;
    dino.y = groundLevel;
    obstacle.y = groundLevel + 20;
});

// gameLoop();  // Start the game loop


//todo -- work on the reset speed
//todo -- add the spinner animation while waiting for the user
