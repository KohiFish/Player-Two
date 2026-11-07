// quick game of ping pong
const width = 40;
const height = 15;
const paddleLength = 10;

// players and ball
let p1 = 6;
let p2 = 6;
let ballX = 20;
let ballY = 7;
let vx = 1;
let vy = 1;

if (process.stdin.isTTY && process.stdin.setRawMode) {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf-8');
}

function handleKey(key) {
    //if (key === '\u001b[A') {
       // p1 = Math.max(0, p1 - 1);
    //} else if (key === '\u001b[B') {
        //p1 = Math.min(height - paddleLength, p1 + 1);
    //}
    if (key === 'w' || key === 'W') {
        p2 = Math.max(0, p2 - 1);
    } else if (key === 's' || key === 'S') {
        p2 = Math.min(height - paddleLength, p2 + 1);
    }
}

process.stdin.on('data', (chunk) => {
    const key = chunk.toString();

    if (key === '\u0003') {
        process.exit();
    }

    handleKey(key);
});

function update() {
    ballX += vx;
    ballY += vy;

    if (ballY <= 0 || ballY >= height - 1) {
        vy *= -1;
    }

    const leftPaddleRange = ballY >= p1 && ballY <= p1 + paddleLength;
    const rightPaddleRange = ballY >= p2 && ballY <= p2 + paddleLength;

    if (ballX <= 0) {
        if (leftPaddleRange) {
            ballX = 1;
            vx = Math.abs(vx);
        } else {
            reset();
        }
        return;
    }

    if (ballX >= width - 1) {
        if (rightPaddleRange) {
            ballX = width - 2;
            vx = -Math.abs(vx);
        } else {
            reset();
        }
    }
}

function reset() {
    ballX = Math.floor(width / 2);
    ballY = Math.floor(height / 2);
    vx *= -1;
    vy = Math.random() < 0.5 ? -1 : 1;
}

function draw() {
    console.clear();
    for (let y = 0; y < height; y++) {
        let row = '';
        for (let x = 0; x < width; x++) {
            if (x === ballX && y === ballY) {
                row += 'O';
            } else if (x === 0 && y >= p1 && y <= p1 + paddleLength) {
                row += '|';
            } else if (x === width - 1 && y >= p2 && y <= p2 + paddleLength) {
                row += '|';
            } else {
                row += '.';
            }
        }
        console.log(row);
    }
}

setInterval(() => {
    update();
    draw();
}, 100);