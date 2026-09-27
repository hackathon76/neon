const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function getHeartPosition(t) {
    const scale = Math.min(canvas.width, canvas.height) / 45;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
    return {
        x: canvas.width / 2 + x * scale,
        y: canvas.height / 2 + y * scale
    };
}

const colors = ['#ff007f', '#00f3ff', '#00ff66', '#ffaa00', '#ff00ff'];
let colorIndex = 0;

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 2.5 + 1;
        this.speedX = (Math.random() - 0.5) * 3;
        this.speedY = (Math.random() - 0.5) * 3;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.005;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= this.decay;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
    }
}

let particles = [];
let t = 0;

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const pos = getHeartPosition(t);
    const currentColor = colors[colorIndex];

    for (let i = 0; i < 5; i++) {
        particles.push(new Particle(pos.x, pos.y, currentColor));
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.shadowBlur = 20;
    ctx.shadowColor = currentColor;
    ctx.fill();
    ctx.restore();

    particles.forEach((p, index) => {
        p.update();
        p.draw();
        if (p.alpha <= 0) particles.splice(index, 1);
    });

    t += 0.03;
    if (t >= Math.PI * 2) {
        t = 0;
        colorIndex = (colorIndex + 1) % colors.length;
    }

    requestAnimationFrame(animate);
}

animate();