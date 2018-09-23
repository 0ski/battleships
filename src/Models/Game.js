import Ship from './Ship';
import Board from './Board';

const SHIP_TYPES = Ship.types();

const UNREADY = -1;
const READY = 0;
const SETUP = 1;
const BATTLE = 2;
const FINISHED = 3;

const STATE_ENUMS = {
  UNREADY,
  READY,
  SETUP,
  BATTLE,
  FINISHED,
};

class Game {
  static states() {
    return STATE_ENUMS;
  }

  //Standard BATTLESHIPS rules:
  //10x10 board for following ships:
  //four one-sized
  //three two-sized
  //two three-sized
  //one four-sized
  constructor({
    dim=[10, 10],
    shipTypes=[
      SHIP_TYPES[0],
      SHIP_TYPES[0],
      SHIP_TYPES[0],
      SHIP_TYPES[0],
      SHIP_TYPES[1],
      SHIP_TYPES[1],
      SHIP_TYPES[1],
      SHIP_TYPES[2],
      SHIP_TYPES[2],
      SHIP_TYPES[3],
    ],
  } = {}) {
    this._dim = dim;
    this._shipTypes = shipTypes;
    this._players = [];
    this._state = UNREADY;
    this._started = false;
  }

  _changeState(newState) {
    this._state = newState;
  }

  dim() {
    return this._dim;
  }

  players() {
    return this._players;
  }

  isPlayerIn(player) {
    return this._players.indexOf(player) !== -1;
  }

  add(player) {
    if (!this.isPlayerIn(player)) {
      this._players.push(player);
      player.enter(this);
    }
  }

  remove(player) {
    if (this.isPlayerIn(player)) {
      this._players = this._players.filter(_player => _player !== player);
      player.leave();
    }
  }

  state() {
    return this._state;
  }

  ready() {
    let players = this._players;
    let promises;

    if (players.length < 2) {
      return false;
    } else {
      promises = players.map(player => player.ready());
      return Promise.all(promises).then(() => {
        this._changeState(READY);
      });
    }
  }

  _assignBoardsToPlayers() {
    this._boards = this._players.map(player => {
      let board = new Board(this.dim());
      player.board(board);
      return board;
    });
  }

  _createShips() {
    return this._shipTypes.map(type => new Ship(type));
  }

  start() {
    let players = this._players;
    let boards;
    let promises;

    if (this.state() !== READY) {
      return this._started = false;
    } else {
      this._changeState(SETUP);
      this._assignBoardsToPlayers();
      promises = players.map(player => player.setup(this._createShips()));
      return Promise.all(promises).then(() => {
        this._changeState(BATTLE);
        return this._started = true;
      });
    }
  }

  verify() {
    return;
  }
}

export default Game;
