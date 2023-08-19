const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particlesArray = [];
const numberOfParticles = 100;
const particleSize = 10;
const maxForce = 0.5;
const mouseRadius = 100;

let mouseX = -100;
let mouseY = -100;


class Particle {

    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = particleSize;
        this.speedX = Math.random() * 3 - 1;
        this.speedY = Math.random() * 3 - 1;
        this.hue = Math.random() * 360;
        
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        // if (this.size > 0.2) this.size -= 0.1;
        this.hue += 2; // This will keep changing the hue value

        // Calculate distance between mouse and particle
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouseRadius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const maxDistance = mouseRadius;
            const force = (maxDistance - distance) / maxDistance;
            const directionX = forceDirectionX * force * maxForce;
            const directionY = forceDirectionY * force * maxForce;

            this.speedX -= directionX;
            this.speedY -= directionY;
        }

        // Bounce particles off the edges
        if (this.x > canvas.width || this.x < 0) {
            this.speedX = -this.speedX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.speedY = -this.speedY;
        }

        this.draw();
    }

    draw() {
        ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`; // Use the hue value here
        ctx.strokeStyle = `hsl(${this.hue}, 100%, 50%)`;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }
}

function init() {
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

init();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    requestAnimationFrame(animate);
}

const cursorIcon = document.getElementById('cursorIcon');

document.addEventListener('mousemove', function(e) {
    cursorIcon.style.left = e.clientX + 'px';
    cursorIcon.style.top = e.clientY + 'px';
});


animate();

canvas.addEventListener('mousemove', (event) => {
    mouseX = event.x;
    mouseY = event.y;
    
});

canvas.addEventListener('mouseout', () => {
    mouseX = -100;
    mouseY = -100;
    
});
