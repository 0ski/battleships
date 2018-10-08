import EasyAI from './EasyAI';
import Board from '../Models/Board';

const PRIME = 229;
const RESULTS = Board.results();

class MediumAI extends EasyAI {

  constructor({
    seed = Math.floor(Math.random() * PRIME),
    delay = undefined,
    name = 'Medium AI',
  }={}) {
    super({
      seed, delay, name,
    });
  }

  _turn(opponents, prevShootState) {
    let board = opponents[0].board();
    let available = board.unrevealedCells();
    let prevResult = prevShootState.result;

    if (prevResult !== RESULTS.HIT && prevResult !== RESULTS.SINK && !this.lastKnownTarget) {
      return super._turn(opponents, prevShootState);
    } else if (prevResult === RESULTS.SINK) {
      this.lastKnownTarget = undefined;
      return super._turn(opponents, prevShootState);
    } else {
      if (prevResult === RESULTS.HIT) {
        this.lastKnownTarget = prevShootState.target;
      }

      let prevPos = this.lastKnownTarget;
      available = available.filter(pos => {

        if (
          prevPos[1] === pos[1] &&
          (prevPos[0] - 1 === pos[0] || prevPos[0] + 1 === pos[0])
        ) {
          //HORIZONTAL
          return true;
        } else if (
          prevPos[0] === pos[0] &&
          (prevPos[1] - 1 === pos[1] || prevPos[1] + 1 === pos[1])
        ) {
          //VERTICAL
          return true;
        } else {
          return false;
        }
      });

      let pos = available[this.random() % available.length];

      return {
        player: opponents[0],
        target: pos,
      };
    }
  }
}

export default MediumAI;
