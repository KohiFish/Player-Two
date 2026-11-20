(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };

  // matrix.js
  var require_matrix = __commonJS({
    "matrix.js"(exports, module) {
      var Matrix = class _Matrix {
        constructor(rows, cols) {
          this.rows = rows;
          this.cols = cols;
          this.data = [];
          for (let i = 0; i < this.rows; i++) {
            this.data[i] = [];
            for (let j = 0; j < this.cols; j++) {
              this.data[i][j] = 0;
            }
          }
        }
        static fromArray(arr) {
          let m = new _Matrix(arr.length, 1);
          for (let i = 0; i < arr.length; i++) {
            m.data[i][0] = arr[i];
          }
          return m;
        }
        static subtract(a, b) {
          let result = new _Matrix(a.rows, a.cols);
          for (let i = 0; i < result.rows; i++) {
            for (let j = 0; j < result.cols; j++) {
              result.data[i][j] = a.data[i][j] - b.data[i][j];
            }
          }
          return result;
        }
        toArray() {
          let arr = [];
          for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
              arr.push(this.data[i][j]);
            }
          }
          return arr;
        }
        randomize() {
          for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
              this.data[i][j] = Math.random() * 2 - 1;
            }
          }
        }
        add(n) {
          if (n instanceof _Matrix) {
            for (let i = 0; i < this.rows; i++) {
              for (let j = 0; j < this.cols; j++) {
                this.data[i][j] += n.data[i][j];
              }
            }
          } else {
            for (let i = 0; i < this.rows; i++) {
              for (let j = 0; j < this.cols; j++) {
                this.data[i][j] += n;
              }
            }
          }
        }
        static transpose(matrix) {
          let result = new _Matrix(matrix.cols, matrix.rows);
          for (let i = 0; i < matrix.rows; i++) {
            for (let j = 0; j < matrix.cols; j++) {
              result.data[j][i] = matrix.data[i][j];
            }
          }
          return result;
        }
        static multiply(a, b) {
          if (a.cols !== b.rows) {
            console.log("Columns of A must match rows of B.");
            return void 0;
          }
          let result = new _Matrix(a.rows, b.cols);
          for (let i = 0; i < result.rows; i++) {
            for (let j = 0; j < result.cols; j++) {
              let sum = 0;
              for (let k = 0; k < a.cols; k++) {
                sum += a.data[i][k] * b.data[k][j];
              }
              result.data[i][j] = sum;
            }
          }
          return result;
        }
        multiply(n) {
          if (n instanceof _Matrix) {
            for (let i = 0; i < this.rows; i++) {
              for (let j = 0; j < this.cols; j++) {
                this.data[i][j] *= n.data[i][j];
              }
            }
          } else {
            for (let i = 0; i < this.rows; i++) {
              for (let j = 0; j < this.cols; j++) {
                this.data[i][j] *= n;
              }
            }
          }
        }
        map(func) {
          for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
              let val = this.data[i][j];
              this.data[i][j] = func(val);
            }
          }
        }
        static map(matrix, func) {
          let result = new _Matrix(matrix.rows, matrix.cols);
          for (let i = 0; i < matrix.rows; i++) {
            for (let j = 0; j < matrix.cols; j++) {
              let val = matrix.data[i][j];
              result.data[i][j] = func(val);
            }
          }
          return result;
        }
        print() {
          console.table(this.data);
        }
      };
      if (typeof module !== "undefined") {
        module.exports = Matrix;
      }
    }
  });

  // nn.js
  var require_nn = __commonJS({
    "nn.js"(exports, module) {
      var Matrix = require_matrix();
      function sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
      }
      function dsigmoid(y) {
        return y * (1 - y);
      }
      var NeuralNetwork3 = class {
        constructor(input_nodes, hidden_nodes, output_nodes) {
          this.input_nodes = input_nodes;
          this.hidden_nodes = hidden_nodes;
          this.output_nodes = output_nodes;
          this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
          this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
          this.weights_ih.randomize();
          this.weights_ho.randomize();
          this.bias_h = new Matrix(this.hidden_nodes, 1);
          this.bias_o = new Matrix(this.output_nodes, 1);
          this.bias_h.randomize();
          this.bias_o.randomize();
          this.learning_rate = 0.1;
        }
        feedforward(input_array) {
          let inputs = Matrix.fromArray(input_array);
          let hidden = Matrix.multiply(this.weights_ih, inputs);
          hidden.add(this.bias_h);
          hidden.map(sigmoid);
          let output = Matrix.multiply(this.weights_ho, hidden);
          output.add(this.bias_o);
          output.map(sigmoid);
          return output.toArray();
        }
        train(input_array, target_array) {
          let inputs = Matrix.fromArray(input_array);
          let hidden = Matrix.multiply(this.weights_ih, inputs);
          hidden.add(this.bias_h);
          hidden.map(sigmoid);
          let outputs = Matrix.multiply(this.weights_ho, hidden);
          outputs.add(this.bias_o);
          outputs.map(sigmoid);
          let targets = Matrix.fromArray(target_array);
          let output_errors = Matrix.subtract(targets, outputs);
          let gradients = Matrix.map(outputs, dsigmoid);
          gradients.multiply(output_errors);
          gradients.multiply(this.learning_rate);
          let hidden_T = Matrix.transpose(hidden);
          let weight_ho_deltas = Matrix.multiply(gradients, hidden_T);
          this.weights_ho.add(weight_ho_deltas);
          this.bias_o.add(gradients);
          let who_t = Matrix.transpose(this.weights_ho);
          let hidden_errors = Matrix.multiply(who_t, output_errors);
          let hidden_gradient = Matrix.map(hidden, dsigmoid);
          hidden_gradient.multiply(hidden_errors);
          hidden_gradient.multiply(this.learning_rate);
          let inputs_T = Matrix.transpose(inputs);
          let weight_ih_deltas = Matrix.multiply(hidden_gradient, inputs_T);
          this.weights_ih.add(weight_ih_deltas);
          this.bias_h.add(hidden_gradient);
        }
      };
      module.exports = NeuralNetwork3;
    }
  });

  // main.js
  var require_main = __commonJS({
    "main.js"() {
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
    }
  });

  // browser-entry.js
  var NeuralNetwork2 = require_nn();
  globalThis.NeuralNetwork = NeuralNetwork2;
  require_main();
})();
