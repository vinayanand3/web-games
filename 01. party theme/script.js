const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let backgroundImage = null;

function setBackground() {
    const fileInput = document.getElementById('imageUpload');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                backgroundImage = img;
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(file);
    }
}


class Line {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.alpha = 500;
        this.dx = (Math.random() - 0.5) * 5; // Random horizontal speed
        this.dy = (Math.random() - 0.5) * 5; // Random vertical speed
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.dx * 10, this.y + this.dy * 10); // Multiplied by 10 to make the line longer
        ctx.strokeStyle = `hsla(${Math.random() * 360}, 100%, 50%, ${this.alpha})`;
        ctx.lineWidth = 10; // Thickness of the line
        ctx.stroke();
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
        this.alpha -= 0.03;
        this.draw();
    }
}

let lines = [];

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the background image if available
    if (backgroundImage) {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }

    for (let i = 0; i < lines.length; i++) {
        lines[i].update();
        if (lines[i].alpha <= 0) {
            lines.splice(i, 1);
            i--;
        }
    }
}


canvas.addEventListener('mousemove', (event) => {
    const x = event.clientX;
    const y = event.clientY;
    for (let i = 0; i < 3; i++) { // Create 3 lines for every mouse move for a more intense effect
        lines.push(new Line(x, y));
    }
});

animate();
