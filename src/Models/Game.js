const UNREADY = -1;
const READY = 0;
const PLACEMENT = 1;
const BATTLE = 2;
const FINISHED = 3;

const STATE_ENUMS = {
  UNREADY,
  READY,
  PLACEMENT,
  BATTLE,
  FINISHED,
};

class Game {
  static states() {
    return STATE_ENUMS;
  }

  constructor() {
    this._players = [];
    this._state = STATE_ENUMS.UNREADY;
    this._started = false;
  }

  _updateState(state) {
    if (state !== undefined) {
      this._state = state;
    } else if (this.players().length > 1) {
      this._state = STATE_ENUMS.READY;
    } else {
      this._state = STATE_ENUMS.UNREADY;
    }
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
      this._updateState();
      player.enter(this);
    }
  }

  remove(player) {
    if (this.isPlayerIn(player)) {
      this._players = this._players.filter(_player => _player !== player);
      this._updateState();
      player.leave();
    }
  }

  state() {
    return this._state;
  }

  start() {
    if (this.state() === STATE_ENUMS.READY) {
      this._updateState(STATE_ENUMS.PLACEMENT);
      return this._started = true;
    } else {
      return this._started = false;
    }
  }
}

export default Game;
