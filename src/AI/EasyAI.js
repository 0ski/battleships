import seedrandom from 'seedrandom';

import Player from '../Models/Player';

const PRIME = 229;

class EasyAI extends Player {

  constructor({
    seed = Math.floor(Math.random() * PRIME),
    delay = undefined,
    name = 'Easy AI',
  }={}) {
    super();
    this._random = seedrandom(seed);
    this._name = name;
    if (delay !== undefined) {
      this.delay(delay);
    }
  }

  name() {
    return this._name;
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

  async turn(opponents, prevShootState) {
    let delay = this._delay;

    if (delay === undefined) {
      return await this._turn(opponents, prevShootState);
    } else {
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve(this._turn(opponents, prevShootState)), delay);
      });
    }
  }

  _setup(ships) {
    super.setup(ships);
    let boardNeedsSetup = true;
    let board = this.board();

    while (boardNeedsSetup) {
      let seed = this.random();
      console.log('Setting up random board with seed: ', seed);

      board.clear();
      boardNeedsSetup = !board.launchRandomly(ships, { seed });
    }

    return board;
  }

  _turn(opponents, prevShootState) {
    let board = opponents[0].board();

    let available = board.unrevealedCells();
    let pos = available[this.random() % available.length];

    return {
      player: opponents[0],
      target: pos,
    };
  }
}

export default EasyAI;
