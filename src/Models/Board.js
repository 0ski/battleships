import _ from 'lodash';
import nj from 'numjs';
nj.config.printThreshold = 10;

import Ship from './Ship';

const UNREVEALED = 0;
const WATER = 1;
const HIT = 2;
const RESULTS = { UNREVEALED, WATER, HIT };

const NUM_2_STR = {
  [UNREVEALED]: '-',
  [WATER]: '~',
  [HIT]: 'X',
};

const SHIP_SHAPES = Ship.shapes();

class Board {
  static results() {
    return RESULTS;
  }

  static verifyTarget(board, target) {
    let dim = board.dim();
    let valid = Number.isInteger(target[0]) &&
                Number.isInteger(target[1]) &&
                target[0] >= 0 && target[1] >= 0 &&
                target[0] < dim[0] && target[1] < dim[1];

    return valid;
  }

  static verifyShipPosition(board, target, ship) {
    let size = ship.size();
    let orientation = ship.shape();
    let setup = board.revealed();
    let dim = board.dim();
    let [totalCol, totalRow] = dim;
    let [targetCol, targetRow] = target;

    if (orientation === SHIP_SHAPES.HORIZONTAL) {
      if (targetCol + size > totalCol) {
        return false;
      }

      for (let i = -1; i <= (size + 1) && targetCol + i < totalCol; i++) {
        if (
          setup[Math.max(targetRow - 1, 0)][Math.max(targetCol + i, 0)] === HIT ||
          setup[targetRow][Math.max(targetCol + i, 0)] === HIT ||
          setup[Math.min(targetRow + 1, totalRow - 1)][Math.max(targetCol + i, 0)] === HIT
        ) {
          return false;
        }
      }
    } else if (orientation === SHIP_SHAPES.VERTICAL) {
      if (targetRow + size > totalRow) {
        return false;
      }

      for (let i = -1; i <= (size + 1) && targetRow + i < totalRow; i++) {
        if (
          setup[Math.max(targetRow + i, 0)][Math.max(targetCol - 1, 0)] === HIT ||
          setup[Math.max(targetRow + i, 0)][targetCol] === HIT ||
          setup[Math.max(targetRow + i, 0)][Math.min(targetCol + 1, totalCol - 1)] === HIT
        ) {
          return false;
        }
      }
    } else {
      return false;
    }

    return true;
  }

  static availableSpots(board, ship) {
    let size = ship.size();
    let orientation = ship.shape();
    let setup = board.revealed();
    let dim = board.dim();
    let [totalCol, totalRow] = dim;

    let nestedArray = setup.map(
      (row, rowId) => row.map(
        (cell, colId) => {
          if (Board.verifyShipPosition(board, [colId, rowId], ship)) {
            return [colId, rowId];
          } else {
            return null;
          }
        }
      )
    );

    return _.flatten(nestedArray).filter(item => item !== null);
  }

  constructor(dim = [10, 10]) {
    this._dim = dim; //[col, row]
    this._state = nj.ones(dim).multiply(UNREVEALED).tolist();
    this._setup = nj.ones(dim).multiply(WATER).tolist();
    this._ships = [];
  }

  dim() {
    return this._dim;
  }

  ships() {
    return this._ships;
  }

  launch(pos, ship) {
    if (!Board.verifyTarget(this, pos)) {
      return false;
    }

    if (!Board.verifyShipPosition(this, pos, ship)) {
      return false;
    }

    let [posCol, posRow] = pos;
    let orientation = ship.shape();
    let size = ship.size();

    this._ships.push({
      ship,
      pos,
    });
    this._setup[posRow][posCol] = HIT;

    if (orientation === SHIP_SHAPES.HORIZONTAL) {
      for (let i = 0; i < size; i++) {
        this._setup[posRow][posCol + i] = HIT;
      }
    } else if (orientation === SHIP_SHAPES.HORIZONTAL) {
      for (let i = 0; i < size; i++) {
        this._setup[posRow + i][posCol] = HIT;
      }
    }

    return true;
  }

  state() {
    return this._state;
  }

  revealed() {
    return this._setup;
  }

  toString() {
    let state = this.state();

    return state.map(row => '[ ' + row.map(
      cell => NUM_2_STR[cell]
    ).join(' ') + ' ]').join('\n');
  }
}

export default Board;
