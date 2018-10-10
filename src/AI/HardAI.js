import nj from 'numjs';

import MediumAI from './MediumAI';
import * as data from '../static/229-data.json';

const DATA = nj.array(data.default).reshape(100);
const PRIME = 229;

class HardAI extends MediumAI {
  constructor({
    seed = Math.floor(Math.random() * PRIME),
    delay = undefined,
    name = 'Hard AI',
  }={}) {
    super({
      seed, delay, name,
    });
  }

  async _turn(opponents, prevShootState) {
    let proposition = await super._turn(opponents, prevShootState);

    if (this.firstCellHit === undefined) {
      let state = opponents[0].board().state().map(row => row.map(cell => cell === 0 ? 1 : 0));
      state = nj.array(state).reshape(100);
      let data = DATA.multiply(state);
      let max = data.max();
      data = data.subtract(max);
      let prob = nj.softmax(data);
      max = prob.max();
      let index = prob.tolist().indexOf(max);
      proposition.target = [index % 10, Math.floor(index / 10)];
      return proposition;
    } else {
      return proposition;
    }
  }
}

export default HardAI;
