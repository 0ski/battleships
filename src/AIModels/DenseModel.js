const tf = require('@tensorflow/tfjs');

module.exports = (ROW=10, COL=10, BIGGEST_SHIP_SIZE=4, NO_OF_SHIPS=10) => {
  const model = tf.sequential();
  model.add(tf.layers.flatten({
    inputShape: [ROW, COL, 1],
  }));

  model.add(tf.layers.dense({
    units: 40,
    kernelInitializer: 'VarianceScaling',
    activation: 'relu',
  }));

  model.add(tf.layers.dense({
    units: 20,
    kernelInitializer: 'VarianceScaling',
    activation: 'softmax',
  }));

  model.add(tf.layers.dense({
    units: 40,
    kernelInitializer: 'VarianceScaling',
    activation: 'relu',
  }));

  model.add(tf.layers.dense({
    units: 100,
    kernelInitializer: 'VarianceScaling',
    activation: 'softmax',
  }));

  return model;
};
