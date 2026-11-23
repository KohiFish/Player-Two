// NEXT TO DO
// REDO gradient descent video about
// delta weight formulas, connect to "mathematics of gradient" video
// Implment gradient descent in library / with code
// Talk about different activation function
// XOR coding challenge
// MNIST coding challenge

// Other techniques for learning

const Matrix = require('./matrix.js');

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function dsigmoid(y) {
  // return sigmoid(x) * (1 - sigmoid(x));
  return y * (1 - y);
}


class NeuralNetwork {
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

    // Generating the Hidden Outputs
    let inputs = Matrix.fromArray(input_array);
    let hidden = Matrix.multiply(this.weights_ih, inputs);
    hidden.add(this.bias_h);
    // activation function!
    hidden.map(sigmoid);

    // Generating the output's output!
    let output = Matrix.multiply(this.weights_ho, hidden);
    output.add(this.bias_o);
    output.map(sigmoid);

    // Sending back to the caller!
    return output.toArray();
  }
// copilot changes
  trainQ(input_array, action, reward, next_input_array, done) {
  const inputs = Matrix.fromArray(input_array);

  // Forward pass for the current state.
  const hidden = Matrix.multiply(this.weights_ih, inputs);
  hidden.add(this.bias_h);
  hidden.map(sigmoid);

  const outputs = Matrix.multiply(this.weights_ho, hidden);
  outputs.add(this.bias_o);

  // Q-learning target: reward now + best predicted future value.
  const nextValues = this.feedforward(next_input_array);
  const nextBest = Math.max(...nextValues);
  const target = reward + (done ? 0 : 0.9 * nextBest);

  const prediction = outputs.data[action][0];
  const error = target - prediction;

  // Save old output weights for the hidden-layer error calculation.
  const oldWeightsHO = this.weights_ho.data.map(row => row.slice());

  // Update only the output for the selected action.
  const outputGradient = error * this.learning_rate;

  for (let j = 0; j < this.hidden_nodes; j++) {
    this.weights_ho.data[action][j] += outputGradient * hidden.data[j][0];
  }
  this.bias_o.data[action][0] += outputGradient;

  // Backpropagate through the hidden layer using the old output weights.
  for (let j = 0; j < this.hidden_nodes; j++) {
    const hiddenValue = hidden.data[j][0];
    const hiddenError = oldWeightsHO[action][j] * error;
    const hiddenGradient =
      hiddenError * hiddenValue * (1 - hiddenValue) * this.learning_rate;

    for (let k = 0; k < this.input_nodes; k++) {
      this.weights_ih.data[j][k] += hiddenGradient * inputs.data[k][0];
    }
    this.bias_h.data[j][0] += hiddenGradient;
  }
}

module.exports = NeuralNetwork;