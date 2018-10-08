import EasyAI from './EasyAI';
import Board from '../Models/Board';
import Ship from '../Models/Ship';

const PRIME = 229;
const RESULTS = Board.results();
const { HORIZONTAL, VERTICAL } = Ship.shapes();

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

  _availableSpotsAround(opponents, target, orientation=true) {
    let board = opponents[0].board();
    let available = board.unrevealedCells();

    return available.filter(pos => {
      if (
        target[1] === pos[1] &&
        (target[0] - 1 === pos[0] || target[0] + 1 === pos[0]) &&
        (orientation === true || orientation === HORIZONTAL)
      ) {
        //HORIZONTAL
        return true;
      } else if (
        target[0] === pos[0] &&
        (target[1] - 1 === pos[1] || target[1] + 1 === pos[1]) &&
        (orientation === true || orientation === VERTICAL)
      ) {
        //VERTICAL
        return true;
      } else {
        return false;
      }
    });
  }

  _turn(opponents, prevShootState) {
    let prevResult = prevShootState.result;
    let { firstCellHit, orientationOfHuntedShip, lastCellHit } = this;
    let available = [];
    let lastHITSpots = [];
    let firstHITSpots = [];

    //It's not a HIT and we didn't HIT anything previously
    if (prevResult !== RESULTS.HIT && prevResult !== RESULTS.SINK && !firstCellHit) {
      return super._turn(opponents, prevShootState);
    } else if (prevResult === RESULTS.SINK) { //Ship is already sunken
      this.firstCellHit = undefined;
      this.orientationOfHuntedShip = undefined;
      this.lastCellHit = undefined;
      return super._turn(opponents, prevShootState);
    } else {
      if (!firstCellHit) { //Previous HIT was the first one
        this.firstCellHit = prevShootState.target;
        firstHITSpots = this._availableSpotsAround(opponents, prevShootState.target);
      } else if (firstCellHit && prevResult === RESULTS.WATER) { //Previous attempt was WATER
        firstHITSpots = this._availableSpotsAround(opponents, firstCellHit);
        if (lastCellHit) { //But the other end was targeted
          lastHITSpots = this._availableSpotsAround(
            opponents, lastCellHit, orientationOfHuntedShip
          );
        }
      } else if (firstCellHit && prevResult === RESULTS.HIT) { //Previous attempt was HIT
        if (orientationOfHuntedShip === undefined) { //And we didn't know orientation
          if (firstCellHit[0] === prevShootState.target[0]) {
            orientationOfHuntedShip = VERTICAL;
          } else if (firstCellHit[1] === prevShootState.target[1]) {
            orientationOfHuntedShip = HORIZONTAL;
          }
        }

        this.lastCellHit = prevShootState.target;

        lastHITSpots = this._availableSpotsAround(
          opponents, prevShootState.target, orientationOfHuntedShip
        );
        firstHITSpots = this._availableSpotsAround(
          opponents, firstCellHit, orientationOfHuntedShip
        );
      }

      available = firstHITSpots.concat(lastHITSpots);

      if (available.length) {
        return {
          player: opponents[0],
          target: available[this.random() % available.length],
        };
      } else { //Fallback to random shooting
        this.firstCellHit = undefined;
        this.orientationOfHuntedShip = undefined;
        this.lastCellHit = undefined;
        return super._turn(opponents, prevShootState);
      }
    }
  }
}

export default MediumAI;
