const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    width: 20,
    height: 20,
    color: '#0f0',
    dx: 0,
    acceleration: 0.5,
    friction: 0.9,
    maxSpeed: 5,
    bullets: []
};

const invaders = [];
const maxInvaders = 20; // Å‘å“G”
const invaderWidth = 20;
const invaderHeight = 20;
const invaderColor = '#f00';
const invaderSpeed = 1; // “G‚ÌˆÚ“®‘¬“x
const bulletSpeed = 5; // ’e‚Ì‘¬“x
const invaderSpawnInterval = 1000; // “G‚ÌoŒ»ŠÔŠuiƒ~ƒŠ•bj

let score = 0;
let isGameOver = false;
let lastSpawnTime = 0;
let keys = {};

function createInvader() {
    const x = Math.random() * (canvas.width - invaderWidth);
    const y = invaderHeight;
    invaders.push({
        x: x,
        y: y,
        width: invaderWidth,
        height: invaderHeight,
        color: invaderColor,
        bullets: []
    });
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawInvaders() {
    invaders.forEach(invader => {
        ctx.fillStyle = invader.color;
        ctx.beginPath();
        ctx.moveTo(invader.x + invader.width / 2, invader.y);
        ctx.lineTo(invader.x, invader.y + invader.height);
        ctx.lineTo(invader.x + invader.width, invader.y + invader.height);
        ctx.closePath();
        ctx.fill();
    });
}

function updateInvaders() {
    const currentTime = Date.now();
    if (currentTime - lastSpawnTime > invaderSpawnInterval && invaders.length < maxInvaders) {
        createInvader();
        lastSpawnTime = currentTime;
    }
    invaders.forEach(invader => {
        invader.y += invaderSpeed; // “G‚ð‰º•ûŒü‚ÉˆÚ“®
        if (Math.random() < 0.01) { // ˆê’è‚ÌŠm—¦‚Å’e‚ð”­ŽË
            invader.bullets.push({
                x: invader.x + invader.width / 2,
                y: invader.y + invader.height,
                color: invader.color
            });
        }
    });
}

function drawBullets(bullets, color) {
    bullets.forEach(bullet => {
        ctx.fillStyle = color;
        ctx.fillRect(bullet.x, bullet.y, 2, 10);
    });
}

function updateBullets(bullets, speed) {
    bullets.forEach((bullet, index) => {
        bullet.y += speed;
        if (bullet.y > canvas.height || bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });
}

function drawScore() {
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

function checkCollisions() {
    player.bullets.forEach((bullet, bulletIndex) => {
        invaders.forEach((invader, invaderIndex) => {
            if (bullet.x >= invader.x && bullet.x <= invader.x + invader.width &&
                bullet.y >= invader.y && bullet.y <= invader.y + invader.height) {
                player.bullets.splice(bulletIndex, 1);
                invaders.splice(invaderIndex, 1);
                score += 1;
            }
        });
    });
}

function checkGameOver() {
    invaders.forEach(invader => {
        invader.bullets.forEach(bullet => {
            if (bullet.x >= player.x && bullet.x <= player.x + player.width &&
                bullet.y >= player.y && bullet.y <= player.y + player.height) {
                isGameOver = true;
            }
        });
    });
}

function updatePlayer() {
    if (keys['ArrowLeft']) {
        player.dx -= player.acceleration;
    }
    if (keys['ArrowRight']) {
        player.dx += player.acceleration;
    }
    player.dx *= player.friction;
    player.dx = Math.max(-player.maxSpeed, Math.min(player.dx, player.maxSpeed));
    player.x += player.dx;
    if (player.x < 0) {
        player.x = 0;
        player.dx = 0;
    } else if (player.x > canvas.width - player.width) {
        player.x = canvas.width - player.width;
        player.dx = 0;
    }
}

function update() {
    if (isGameOver) {
        ctx.fillStyle = '#fff';
        ctx.font = '40px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
        ctx.fillText('Score: ' + score, canvas.width / 2 - 70, canvas.height / 2 + 50);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawInvaders();
    drawBullets(player.bullets, player.color);
    invaders.forEach(invader => drawBullets(invader.bullets, invader.color));
    drawScore();
    updateInvaders();
    updateBullets(player.bullets, -bulletSpeed); // ƒvƒŒƒCƒ„[‚Ì’e‚Íã•ûŒü‚É
    invaders.forEach(invader => updateBullets(invader.bullets, bulletSpeed));
    checkCollisions();
    checkGameOver();
    updatePlayer();
    requestAnimationFrame(update);
}

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ') { // ƒXƒy[ƒXƒL[‚Å’e‚ð”­ŽË
        player.bullets.push({
            x: player.x + player.width / 2,
            y: player.y,
            color: player.color
        });
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

update();