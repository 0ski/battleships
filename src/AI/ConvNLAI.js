import * as tf from '@tensorflow/tfjs';
import _ from 'lodash';

import Board from '../Models/Board';
import MediumAI from './MediumAI';

const { UNREVEALED, WATER, HIT, SINK } = Board.results();
const PRIME = 229;

class ConvNLAI extends MediumAI {
  constructor({
    seed = Math.floor(Math.random() * PRIME),
    delay = undefined,
    name = 'Neural Network AI',
  }={}) {
    super({
      seed, delay, name,
    });
  }

  async ready() {
    this.model = await tf.loadModel(`${window.location.href}conv-model/model.json`);
    return true;
  }

  async _turn(opponents, prevShootState) {
    let boardState = opponents[0].board().state();
    let modelFeed = boardState.map(row => row.map(cell => {
      if (cell === UNREVEALED) {
        return 5;
      } else if (cell === WATER) {
        return 0;
      } else if (cell === HIT) {
        return 1;
      } else if (cell === SINK) {
        return 0;
      }

      return 0;
    }));

    let prob = await this.model.predict(tf.tensor2d(modelFeed).reshape([1, 10, 10, 1])).data();
    prob = _.flatten(boardState).map((state, index) => state === UNREVEALED ? prob[index] : 0);
    let { index } = prob.reduce((acc, curr, currIndex) => {
      if (curr > acc.max) {
        return { index: currIndex, max: curr };
      } else {
        return acc;
      }
    }, { index: -1, max: 0 });

    let col = index % 10;
    let row = Math.floor(index / 10);

    //fallback to standard MediumAI
    if (prevShootState.result === HIT || this.firstCellHit) {
      return await super._turn(opponents, prevShootState);
    }

    return {
      player: opponents[0],
      target: [col, row],
    };
  }
}

export default ConvNLAI;
