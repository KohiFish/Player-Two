(() => {
  // main.js
  var width = 50;
  var height = 10;
  var paddleLength = 3;
  var brain = new NeuralNetwork(5, 5, 3);
  function getState() {
    return [
      ballX / width,
      ballY / height,
      p2 / (height - paddleLength),
      (vx + 1) / 2,
      (vy + 1) / 2
    ];
  }
  var p1 = 6;
  var p2 = 6;
  var ballX = 20;
  var ballY = 7;
  var vx = 1;
  var vy = 1;
  var scoreP1 = 0;
  var scoreP2 = 0;
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      p1 = Math.max(0, p1 - 1);
    }
    if (event.key === "ArrowDown") p1 = Math.min(height - paddleLength, p1 + 1);
  });
  function update() {
    ballX += vx;
    ballY += vy;
    p2Move();
    if (ballY <= 0 || ballY >= height - 1) {
      vy *= -1;
    }
    const leftPaddleRange = ballY >= p1 && ballY <= p1 + paddleLength;
    const rightPaddleRange = ballY >= p2 && ballY <= p2 + paddleLength;
    if (ballX <= 0 && leftPaddleRange) {
      ballX = 1;
      vx = Math.abs(vx);
    }
    if (ballX >= width - 1 && rightPaddleRange) {
      ballX = width - 2;
      vx = -Math.abs(vx);
    }
    scoring();
  }
  function scoring() {
    if (ballX <= 0) {
      scoreP2++;
      reset();
      return;
    }
    if (ballX >= width - 1) {
      scoreP1++;
      reset();
      return;
    }
  }
  var moveDirection = 1;
  function p2Move() {
    const state = getState();
    const output = brain.feedforward(state);
    if (Math.random() < 0.3) {
      const action = output.indexOf(Math.max(...output));
      if (action === 0) moveDirection = -1;
      if (action === 2) moveDirection = 1;
    }
    p2 += moveDirection;
    if (p2 <= 0) {
      p2 = 0;
      moveDirection = 1;
    }
    if (p2 >= height - paddleLength) {
      p2 = height - paddleLength;
      moveDirection = -1;
    }
  }
  function reset() {
    ballX = Math.floor(width / 2);
    ballY = Math.floor(height / 2);
    vx *= -1;
    vy = Math.random() < 0.5 ? -1 : 1;
  }
  var canvas = document.getElementById("gameCanvas");
  var ctx = canvas.getContext("2d");
  function draw() {
    const scaleX = canvas.width / width;
    const scaleY = canvas.height / height;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(ballX * scaleX, ballY * scaleY, scaleX, scaleY);
    ctx.fillRect(0, p1 * scaleY, scaleX, paddleLength * scaleY);
    ctx.fillRect(
      canvas.width - scaleX,
      p2 * scaleY,
      scaleX,
      paddleLength * scaleY
    );
    ctx.font = "20px Arial";
    ctx.fillText(`PLAYER: ${scoreP1} | NN: ${scoreP2}`, 20, 30);
  }
  function gameLoop() {
    update();
    draw();
    setTimeout(() => requestAnimationFrame(gameLoop), 100);
  }
  gameLoop();
})();
