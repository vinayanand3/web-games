const box = document.getElementById('box');
const scoreDisplay = document.getElementById('score');
const startBtn = document.getElementById('startBtn');
let score = 0;

function randomPosition() {
    const x = Math.random() * (500 - 50); // game-area width - box width
    const y = Math.random() * (500 - 50); // game-area height - box height
    box.style.left = x + 'px';
    box.style.top = y + 'px';
}

box.addEventListener('click', () => {
    score++;
    scoreDisplay.textContent = "Score: " + score;
    randomPosition();
});

startBtn.addEventListener('click', () => {
    score = 0;
    scoreDisplay.textContent = "Score: 0";
    randomPosition();
    box.style.display = 'block';
});

box.style.display = 'none';
