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
          if (a.rows !== b.rows || a.cols !== b.cols) {
            throw new RangeError("Matrix dimensions must match");
          }
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
            if (this.rows !== n.rows || this.cols !== n.cols) {
              throw new RangeError("Matrix dimensions must match");
            }
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
            throw new RangeError("Columns of A must match rows of B");
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
          if (input_array.length !== this.input_nodes) {
            throw new RangeError(`Expected ${this.input_nodes} input values`);
          }
          let inputs = Matrix.fromArray(input_array);
          let hidden = Matrix.multiply(this.weights_ih, inputs);
          hidden.add(this.bias_h);
          hidden.map(sigmoid);
          let output = Matrix.multiply(this.weights_ho, hidden);
          output.add(this.bias_o);
          return output.toArray();
        }
        // copilot changes
        trainQ(input_array, action, reward, next_input_array, done) {
          if (!Number.isInteger(action) || action < 0 || action >= this.output_nodes) {
            throw new RangeError(`Invalid action: ${action}`);
          }
          if (input_array.length !== this.input_nodes) {
            throw new RangeError(`Expected ${this.input_nodes} input values`);
          }
          if (next_input_array.length !== this.input_nodes) {
            throw new RangeError(`Expected ${this.input_nodes} next input values`);
          }
          const inputs = Matrix.fromArray(input_array);
          const hidden = Matrix.multiply(this.weights_ih, inputs);
          hidden.add(this.bias_h);
          hidden.map(sigmoid);
          const outputs = Matrix.multiply(this.weights_ho, hidden);
          outputs.add(this.bias_o);
          const nextValues = this.feedforward(next_input_array);
          const nextBest = Math.max(...nextValues);
          const target = reward + (done ? 0 : 0.9 * nextBest);
          const prediction = outputs.data[action][0];
          const error = target - prediction;
          const oldWeightsHO = this.weights_ho.data.map((row) => row.slice());
          const outputGradient = error * this.learning_rate;
          for (let j = 0; j < this.hidden_nodes; j++) {
            this.weights_ho.data[action][j] += outputGradient * hidden.data[j][0];
          }
          this.bias_o.data[action][0] += outputGradient;
          for (let j = 0; j < this.hidden_nodes; j++) {
            const hiddenValue = hidden.data[j][0];
            const hiddenError = oldWeightsHO[action][j] * error;
            const hiddenGradient = hiddenError * hiddenValue * (1 - hiddenValue) * this.learning_rate;
            for (let k = 0; k < this.input_nodes; k++) {
              this.weights_ih.data[j][k] += hiddenGradient * inputs.data[k][0];
            }
            this.bias_h.data[j][0] += hiddenGradient;
          }
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
      var brain = new NeuralNetwork(6, 8, 3);
      brain.learning_rate = 0.01;
      function getState() {
        return [
          ballX / (width - 1),
          ballY / (height - 1),
          p2 / (height - paddleLength),
          (vx + 1) / 2,
          (vy + 1) / 2,
          (ballY - (p2 + paddleLength / 2)) / height
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
      function bouncing() {
        if (ballY <= 0) {
          ballY = 0;
          vy = Math.abs(vy);
        } else if (ballY >= height - 1) {
          ballY = height - 1;
          vy = -Math.abs(vy);
        }
        const paddleRange = (paddleY) => ballY >= paddleY && ballY < paddleY + paddleLength;
        if (ballX <= 1 && vx < 0 && paddleRange(p1)) {
          ballX = 1;
          vx = Math.abs(vx);
        } else if (ballX >= width - 2 && vx > 0 && paddleRange(p2)) {
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
    }
  });

  // browser-entry.js
  var NeuralNetwork2 = require_nn();
  globalThis.NeuralNetwork = NeuralNetwork2;
  require_main();
})();
