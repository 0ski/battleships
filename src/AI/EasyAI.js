import seedrandom from 'seedrandom';

import Player from '../Models/Player';

const PRIME = 229;

class EasyAI extends Player {

  constructor({
    seed = Math.floor(Math.random() * PRIME),
    delay = undefined,
  }={}) {
    super();
    this._random = seedrandom(seed);
    if (delay !== undefined) {
      this.delay(delay);
    }
  }

  random() {
    return Math.floor(this._random() * PRIME);
  }

  ready() {
    return true;
  }

  delay(delay) {
    if (typeof delay === 'number') {
      this._delay = delay;
    }

    return this._delay;
  }

  setup(ships) {
    let delay = this._delay;

    if (delay === undefined) {
      return this._setup(ships);
    } else {
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve(this._setup(ships)), delay);
      });
    }
  }

  turn(opponents, prevShootState) {
    let delay = this._delay;

    if (delay === undefined) {
      return this._turn(opponents, prevShootState);
    } else {
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve(this._turn(opponents, prevShootState)), delay);
      });
    }
  }

  _setup(ships) {
    super.setup(ships);

    let seed = this.random();
    console.log('Setting up random board with seed: ', seed);

    return this.board().launchRandomly(ships, { seed });
  }

  _turn(opponents, prevShootState) {
    let board = opponents[0].board();

    let available = board.unrevealedCells();
    let pos = available[this.random() % available.length];

    return {
      player: opponents[0],
      target: pos,
    };
  };
}

export default EasyAI;
