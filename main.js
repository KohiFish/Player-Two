// quick game of ping pong
const width = 50;
const height = 10;
const paddleLength = 3; //fixed the length and size

// outputs: 0 - move up, 1 - stay, 2 - move down
const brain = new NeuralNetwork(6, 8, 3);
brain.learning_rate = 0.01;

function getState() {
  return [
    ballX / (width - 1),
    ballY / (height -1),
    p2 / (height - paddleLength),
    (vx + 1) / 2,
    (vy + 1) / 2,
    (ballY -(p2 +paddleLength / 2)) / height
  ];
}

function p2Actions() {
  const state = getState();
  const output = brain.feedforward(state);
  const action = output.indexOf(Math.max(...output));

  return action;
}

// players and ball
let p1 = 6;
let p2 = 6;
let ballX = 20;
let ballY = 7;
let vx = 1;
let vy = 1;

//scores
let scoreP1 = 0;
let scoreP2 = 0;

var previousState = null;
var previousAction = null;
var exploreChance = 1;
var gamesSeen = 0;

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    p1 = Math.max(0, p1 - 1);
  }

  if (event.key === "ArrowDown") p1 = Math.min(height - paddleLength, p1 + 1);
});

function handleKey(key) {
  if (key === "\u001b[A") {
    p1 = Math.max(0, p1 - 1);
  } else if (key === "\u001b[B") {
    p1 = Math.min(height - paddleLength, p1 + 1);
  }
  //if (key === 'w' || key === 'W') {
  //p2 = Math.max(0, p2 - 1);
  //} else if (key === 's' || key === 'S') {
  //   p2 = Math.min(height - paddleLength, p2 + 1);
  //}
}

function scoring() {
  if (ballX <= 0) {
    scoreP2++;
    if (previousState !== null) {
      brain.trainQ(previousState, previousAction, 2, getState(), true);
    }
    previousState = null;
    previousAction = null;
    reset();
    gamesSeen++;
    exploreChance = Math.max(0.03, 0.2 * Math.exp(-gamesSeen / 200));
    return;
  }
  if (ballX >= width - 1) {
    scoreP1++;
    if (previousState !== null) {
      brain.trainQ(previousState, previousAction, -2, getState(), true);
    }
    previousState = null;
    previousAction = null;
    reset();
    gamesSeen++;
    exploreChance = Math.max(0.03, 0.2 * Math.exp(-gamesSeen / 200));
    return;
  }
}
// were running low on time so this fix is made with ai
let moveDirection = 1;
let moveCounter = 0;
// icl I asked codex to explain this part to me
function p2Move() {
  const state = getState();
  if (previousState !== null) {
    brain.trainQ(previousState, previousAction, 0, state, false);
  }
  
  const output = brain.feedforward(getState());

  let action;
  if (Math.random() < exploreChance) {
    action = Math.floor(Math.random() * 3);
  } else {
    action = output.indexOf(Math.max(...output));
  }

  if (action === 0) p2 -= 1;
  if (action === 2) p2 += 1;

  p2 = Math.max(0, Math.min(height - paddleLength, p2));
  previousState = state;
  previousAction = action;
}

function reset() {
  ballX = Math.floor(width / 2);
  ballY = Math.floor(height / 2);
  vx *= -1;
  vy = Math.random() < 0.5 ? -1 : 1;
}

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function draw() {
  const scaleX = canvas.width / width;
  const scaleY = canvas.height / height;

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";

  //Ball
  ctx.fillRect(ballX * scaleX, ballY * scaleY, scaleX, scaleY);

  //controllable paddle
  ctx.fillRect(0, p1 * scaleY, scaleX, paddleLength * scaleY);

  //nn paddle
  ctx.fillRect(
    canvas.width - scaleX,
    p2 * scaleY,
    scaleX,
    paddleLength * scaleY,
  );

  ctx.font = "20px Arial";
  ctx.fillText(`PLAYER: ${scoreP1} | NN: ${scoreP2}`, 20, 30);
}

function gameLoop() {
  update();
  draw();
  setTimeout(() => requestAnimationFrame(gameLoop), 100);
}


function bouncing() {
  if (ballY <= 0) {
    ballY = 1;
    vy = Math.abs(vy);
  } else if (ballY >= height - 1) {
    ballY = height - 2;
    vy = -Math.abs(vy);
  }

  const paddleRange = (paddleY) =>
    ballY >= paddleY && ballY < paddleY + paddleLength;

  if (ballX <= 1 && vx < 0 && paddleRange(p1)) {
    ballX = 1;
    vx = Math.abs(vx);
  } else if (
    ballX >= width - 2 &&
    vx > 0 &&
    paddleRange(p2)
  ) {
    ballX = width - 2;
    vx = -Math.abs(vx);

    if (previousState !== null) {
      brain.trainQ(previousState, previousAction, 1, getState(), false);
      previousState = null;
      previousAction = null;
    }
  }
}

function update() {
  ballX += vx;
  ballY += vy;

  p2Move();
  bouncing();
  scoring();
}

gameLoop();
