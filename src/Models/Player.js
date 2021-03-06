import Board from './Board';

class Player {
  name() {
    return this._name;
  }

  enter(game) {
    this._game = game;
  }

  leave() {
    this._game = undefined;
  }

  isInGame() {
    return this._game !== undefined;
  }

  ready() {
    return false;
  }

  board(board) {
    if (board instanceof Board) {
      this._board = board;
    }

    return this._board;
  }

  ships(ships) {
    if (Array.isArray(ships)) {
      this._ships = ships;
    }

    return this._ships;
  }

  floatingShips() {
    return this._ships.filter(ship => ship.hitpoints() > 0);
  }

  setup(ships) {
    if (Array.isArray(ships)) {
      this._ships = ships;
    }

    return false;
  }

  turn(opponents, prevShootState) {
    return [0, 0];
  }

  win() {
    return;
  }

  lose() {
    return;
  }
}

export default Player;
