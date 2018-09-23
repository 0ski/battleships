import Board from './Board';

class Player {
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

  setup(ships) {
    if (Array.isArray(ships)) {
      this._ships = ships;
    }

    return false;
  }

  turn(opponentsBoardState) {
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
