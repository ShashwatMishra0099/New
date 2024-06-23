const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreElement = document.getElementById('finalScore');
const playAgainButton = document.getElementById('playAgainButton');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const bird = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 20,
    height: 20,
    gravity: 0.1,
    lift: -4.5,
    velocity: 0,
};

let pipes = [];
const pipeWidth = 50;
const pipeGap = 200;
let frameCount = 0;
let score = 0;
let gameStarted = false;
let gameOver = false;

document.addEventListener('click', startGame);
playAgainButton.addEventListener('click', resetGame);

function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        requestAnimationFrame(update);
    } else {
        bird.velocity = bird.lift;
    }
}

function resetGame() {
    gameOver = false;
    gameStarted = false;
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    gameOverScreen.style.display = 'none';
    scoreElement.innerText = score;
}

function createPipe() {
    const topHeight = Math.random() * (canvas.height - pipeGap - 100) + 50;
    pipes.push({
        x: canvas.width,
        topHeight,
        bottomHeight: canvas.height - topHeight - pipeGap,
        passed: false // Add a flag to indicate if the bird has passed the pipe
    });
}

function update() {
    if (!gameStarted) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        endGame();
    }

    if (frameCount % 250 === 0) {
        createPipe();
    }

    pipes.forEach((pipe, index) => {
        pipe.x -= 2;
        if (pipe.x + pipeWidth < 0) {
            pipes.splice(index, 1);
        }

        // Check if the bird has passed the pipe
        if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
            pipe.passed = true;
            score++;
            scoreElement.innerText = score;
        }

        if (
            bird.x < pipe.x + pipeWidth &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.topHeight || bird.y + bird.height > canvas.height - pipe.bottomHeight)
        ) {
            endGame();
        }

        ctx.fillStyle = 'green';
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottomHeight, pipeWidth, pipe.bottomHeight);
    });

    ctx.fillStyle = 'yellow';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    frameCount++;
    if (!gameOver) {
        requestAnimationFrame(update);
    }
}

function endGame() {
    gameOver = true;
    gameOverScreen.style.display = 'flex';
    finalScoreElement.innerText = `Score: ${score}`;
}