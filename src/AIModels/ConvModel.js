const tf = require('@tensorflow/tfjs');

module.exports = (ROW=10, COL=10, BIGGEST_SHIP_SIZE=4, NO_OF_SHIPS=10) => {
  const model = tf.sequential();
  model.add(tf.layers.conv2d({
    inputShape: [ROW, COL, 1],
    kernelSize: BIGGEST_SHIP_SIZE,
    filters: NO_OF_SHIPS, //filters size of our no of ships
    strides: 1,
    activation: 'relu',
    kernelInitializer: 'VarianceScaling',
  }));

  model.add(tf.layers.maxPooling2d({
    poolSize: [2, 2],
    strides: [2, 2],
  }));

  model.add(tf.layers.conv2d({
    kernelSize: 2,
    filters: NO_OF_SHIPS * 2,
    strides: 1,
    activation: 'relu',
    kernelInitializer: 'VarianceScaling',
  }));

  model.add(tf.layers.maxPooling2d({
    poolSize: [2, 2],
    strides: [2, 2],
  }));

  model.add(tf.layers.flatten());

  model.add(tf.layers.dense({
    units: 100,
    kernelInitializer: 'VarianceScaling',
    activation: 'softmax',
  }));

  return model;
};
