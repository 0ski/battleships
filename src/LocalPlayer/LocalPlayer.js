import seedrandom from 'seedrandom';
import _ from 'lodash';

import Player from '../Models/Player';

const PRIME = 229;
const NUM = PRIME;

class LocalPlayer extends Player {

  constructor({
    seed = Math.floor(Math.random() * PRIME),
    name = 'Local Player',
    setupCallback = _.noop,
    turnCallback = _.noop,
  }={}) {
    super();
    this._random = seedrandom(seed);
    this._name = name;
    this.setupCallback = setupCallback;
    this.turnCallback = turnCallback;
  }

  name() {
    return this._name;
  }

  random() {
    return Math.floor(this._random() * NUM);
  }

  ready() {
    return true;
  }

  async setup(ships) {
    this.ships(ships);
    return await this.setupCallback(ships);
  }

  async turn(opponents, prevShootState) {
    return await this.turnCallback();
  }
}

export default LocalPlayer;
