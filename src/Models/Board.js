import _ from 'lodash';
import nj from 'numjs';
import seedrandom from 'seedrandom';

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

  static verifyShootingTarget(board, target) {
    if (!Array.isArray(target)) {
      return false;
    }

    let [targetCol, targetRow] = target;
    return Board.verifyTarget(board, target) &&
            board.state()[targetRow][targetCol] === UNREVEALED;
  }

  static verifyShipPosition(board, target, ship) {
    let size = ship.size();
    let orientation = ship.shape();
    let setup = board._setup;
    let dim = board.dim();
    let [totalCol, totalRow] = dim;
    let [targetCol, targetRow] = target;

    if (orientation === SHIP_SHAPES.HORIZONTAL) {
      if (targetCol + size > totalCol) {
        return false;
      }

      for (let i = -1; i <= size && targetCol + i < totalCol; i++) {
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

      for (let i = -1; i <= size && targetRow + i < totalRow; i++) {
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

  static verifySetup(board) {
    let shipsPos;
    let dim;

    if (board instanceof Board) {
      shipsPos = board.ships();
      dim = board.dim();
    } else {
      shipsPos = board;
    }

    let tempBoard = new Board(dim);

    for (let i = 0; i < shipsPos.length; i++) {
      if (!tempBoard.launch(shipsPos[i].pos, shipsPos[i].ship)) {
        return false;
      }
    }

    return true;
  }

  static availableSpots(board, ship) {
    let size = ship.size();
    let orientation = ship.shape();
    let setup = board.setup();
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
    this._shipsBoard = nj.ones(dim).multiply(WATER).tolist();
    this._ships = [];
    this._history = [];
  }

  dim() {
    return this._dim;
  }

  // Interface for ships
  ships() {
    return this._ships;
  }

  _isShipOnBoard(ship) {
    return this._ships.find(item => item.ship === ship);
  }

  launch(pos, ship) {
    if (!Board.verifyTarget(this, pos)) {
      return false;
    }

    if (!Board.verifyShipPosition(this, pos, ship)) {
      return false;
    }

    if (this._isShipOnBoard(ship)) {
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
        this._shipsBoard[posRow][posCol + i] = ship;
      }
    } else if (orientation === SHIP_SHAPES.VERTICAL) {
      for (let i = 0; i < size; i++) {
        this._setup[posRow + i][posCol] = HIT;
        this._shipsBoard[posRow + i][posCol] = ship;
      }
    }

    return true;
  }

  remove(ship) {
    if (this._isShipOnBoard(ship)) {
      this._ships = this._ships.filter(item => item.ship !== ship);
      return ship;
    } else {
      return false;
    }
  }

  launchRandomly(ships, { seed=undefined, keepShape=false }) {
    //Cast ship board placement to array of ships
    ships = ships.map(ship => ship.ship ? ship.ship : ship);
    let dim = this.dim();
    let [totalCol, totalRow] = dim;
    let maxAttempts = 50;
    let solvable = true;

    let random = seedrandom(seed);
    let rand = () => Math.floor(random() * 229); //229 is 50th prime number

    ships.forEach(ship => {

      if (!keepShape && rand() % 2) {
        ship.rotate();
      }

      let availableSpots = Board.availableSpots(this, ship);

      if (availableSpots.length === 0) {
        solvable = false;
        return;
      }

      let spot = availableSpots[rand() % availableSpots.length];
      this.launch(spot, ship);
    });

    return solvable;
  }

  shoot(target) {
    let setup = this.setup();
    let state = this._state;
    let history = this._history;
    let [targetCol, targetRow] = target;
    let ship;
    let hitPointsLeft;
    let result;
    let sink = false;

    if (state[targetRow][targetCol] === UNREVEALED) {
      result = state[targetRow][targetCol] = setup[targetRow][targetCol];
      if (result === HIT) {
        ship = this._shipsBoard[targetRow][targetCol];
        hitPointsLeft = ship.hit();

        if (hitPointsLeft === 0) {
          this.sinkShip(ship);
          sink = true;
        }
      }
    } else {
      result = state[targetRow][targetCol];
    }

    history.push({
      target,
      result,
      sink,
      ship,
    });

    return {
      result,
      sink,
      ship,
    };
  }

  sinkShip(ship) {
    let shipsPos = this.ships();
    let dim = this.dim();
    let shipPos = shipsPos.find(shipPos => shipPos.ship === ship);

    if (!shipPos) {
      return false;
    }

    let orientation = ship.shape();
    let size = ship.size();
    let [totalCol, totalRow] = dim;
    let [targetCol, targetRow] = shipPos.pos;
    let state = this._state;

    shipPos.ship.sink();
    if (orientation === SHIP_SHAPES.HORIZONTAL) {
      for (let i = -1; i <= size && targetCol + i < totalCol; i++) {
        //row above ship
        if (targetRow !== 0 && (targetCol + i) >= 0) {
          state[targetRow - 1][targetCol + i] = WATER;
        }

        //around ship
        if (i == -1 || i == size) {
          state[targetRow][Math.max(targetCol + i, 0)] = WATER;
        } else {
          state[targetRow][Math.max(targetCol + i, 0)] = HIT;
        }

        //row below ship
        if (targetRow !== totalRow - 1 && (targetCol + i) >= 0) {
          state[targetRow + 1][targetCol + i] = WATER;
        }
      }

      return true;
    } else if (orientation === SHIP_SHAPES.VERTICAL) {
      for (let i = -1; i <= size && targetRow + i < totalRow; i++) {
        //col on the left hand side of the ship
        if (targetCol !== 0 && (targetRow + i) >= 0) {
          state[targetRow + i][targetCol - 1] = WATER;
        }

        //around ship
        if (i == -1 || i == size) {
          state[Math.max(targetRow + i, 0)][targetCol] = WATER;
        } else {
          state[Math.max(targetRow + i, 0)][targetCol] = HIT;
        }

        //col on the right hand side of the ship
        if (targetCol !== totalCol - 1 && (targetRow + i) >= 0) {
          state[targetRow + i][targetCol + 1] = WATER;
        }
      }

      return true;
    } else {
      return false;
    }
  }

  // End of interface for ships

  // Interface for setup, state and printing
  state() {
    return this._state;
  }

  setup() {
    return this._setup;
  }

  toString() {
    let state = this.state();

    return state.map(row => '[ ' + row.map(
      cell => NUM_2_STR[cell]
    ).join(' ') + ' ]').join('\n');
  }

  setupToString() {
    let setup = this.setup();

    return setup.map(row => '[ ' + row.map(
      cell => NUM_2_STR[cell]
    ).join(' ') + ' ]').join('\n');
  }

  history() {
    return this._history;
  }
}

export default Board;
