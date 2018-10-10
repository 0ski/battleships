const _ = require('lodash');
const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

const convModelCreator = require('./AIModels/ConvModel');
const denseModelCreator = require('./AIModels/DenseModel');
const trainingData = require('./static/trainingData.json');

const UNREVEALED = 0;
const WATER = 1;
const HIT = 2;
const SINK = 3;

const setup = () => {
  const LEARNING_RATE = 0.01;
  const optimizer = tf.train.adam(LEARNING_RATE);
  const model = convModelCreator();

  model.compile({
    optimizer: optimizer,
    loss: 'meanSquaredLogarithmicError',
    metrics: ['accuracy'],
  });

  return model;
};

const train = async model => {
  let { data, labels } = trainingData;
  const batchSize = 64;
  const validationSplit = 0.1;
  const trainEpochs = 25;

  data = data.map(item => item.map(cell => {
    if (cell === UNREVEALED) {
      return 5;
    } else if (cell === WATER) {
      return 0;
    } else if (cell === HIT) {
      return 1;
    } else if (cell === SINK) {
      return 0;
    }
  }));

  data = _.slice(data.map(data => _.chunk(data, 10)), 0, 128000);
  labels = _.slice(labels, 0, 128000);

  let valAcc;
  const trainingDataSize = data.length;
  const numberOfBatches = Math.floor(trainingDataSize / batchSize);
  console.log('Training data example input', JSON.stringify(data[0]));
  console.log('Training set of size', data.length);
  console.log('Number of batches', numberOfBatches);
  console.log('Number of epochs', trainEpochs);

  let trainBatchCount = 0;

  for (let i = 0; i < numberOfBatches - 1; i++) {
    let start = i * batchSize;
    let end = (i + 1) * batchSize;
    const trainingDataSize = data.length;
    const batchNo = Math.ceil(trainingDataSize / batchSize);
    let batchData = _.slice(data, start, end);
    let batchLabels = _.slice(labels, start, end);
    let model = setup(batchData, batchLabels);

    await model.fit(
      tf.tensor3d(batchData).reshape([batchSize, 10, 10, 1]),
      tf.tensor2d(batchLabels).reshape([batchSize, 100]),
      {
        batchSize,
        validationSplit,
        epochs: trainEpochs,
        onBatchEnd: async (batch, logs) => {
          trainBatchCount++;
          console.log(
              `Training... (` +
              `${(trainBatchCount / numberOfBatches * 100).toFixed(1)}%` +
              ` complete).`);
          console.log(`Batch no. ${trainBatchCount} loss: ${logs.loss} acc: ${logs.acc} (train)`);
          await tf.nextFrame();
        },

        callbacks: {
          onEpochEnd: async (epoch, logs) => {
            valAcc = logs.val_acc;

            // console.log(
            //   `Batch no. ${trainBatchCount} loss: ${logs.val_loss} acc: ${logs.val_acc} (vali)`
            // );
            await tf.nextFrame();
          },
        },
      },
    );
  }

  const testResult = model.evaluate(
    tf.tensor3d(data).reshape([trainingDataSize, 10, 10, 1]),
    tf.tensor2d(labels).reshape([trainingDataSize, 100])
  );
  const testAccPercent = testResult[1].dataSync()[0] * 100;
  const finalValAccPercent = valAcc * 100;
  console.log(`Final validation accuracy: ${finalValAccPercent.toFixed(1)}%`);
  console.log(`Final test accuracy: ${testAccPercent.toFixed(1)}%`);

  console.log('SAVING MODEL');
  await model.save(`file://${__dirname}/conv-model`);
};

train(setup()).then(() => {
  console.log('train finished');
});
