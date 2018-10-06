import Player from '../Models/Player';

class EasyAI extends Player {
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
      let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve(this._setup(ships)), delay);
      });
    }
  }

  turn(opponents, prevShootState) {
    let delay = this._delay;

    if (delay === undefined) {
      return this._turn(opponents, prevShootState);
    } else {
      let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve(this._turn(opponents, prevShootState)), delay);
      });
    }
  }

  _setup(ships) {
    super.setup(ships);

    let seed = Math.floor(Math.random() * 229);
    console.log('Setting up random board with seed: ', seed);

    return this.board().launchRandomly(ships, { seed });
  }

  _turn(opponents, prevShootState) {
    let board = opponents[0].board();

    let available = board.unrevealedCells();
    let pos = available[Math.floor(random() * 229) % available.length];

    return {
      player: opponents[0],
      target: pos,
    };
  };
}
