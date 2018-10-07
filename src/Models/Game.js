import _ from 'lodash';

import Ship from './Ship';
import Board from './Board';
import Player from './Player';

const SHIP_TYPES = Ship.types();
const { WATER, HIT } = Board.results();

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
    this._winners = [];
    this._losers = [];
    this._history = [];
    this._turn = 0;
  }

  _changeState(newState) {
    this._state = newState;
  }

  dim() {
    return this._dim;
  }

  turnNo() {
    return this._turn;
  }

  players() {
    return this._players;
  }

  currentPlayer() {
    let players = this.players();

    return players[this.turnNo() % players.length];
  }

  winners() {
    return this._winners;
  }

  losers() {
    return this._losers;
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

  history(player) {
    let history = this._history;

    if (player instanceof Player) {
      history = history.filter(entry => entry.shootingPlayer === player);
    }

    return history;
  }

  _prevShootOf(player) {
    return _.last(this.history(player)) || {};
  }

  async ready() {
    let players = this._players;
    let promises;

    if (players.length < 2) {
      return false;
    } else {
      promises = players.map(player => player.ready());
      await Promise.all(promises);
      this._changeState(READY);
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

  async start() {
    let players = this._players;

    if (this.state() !== READY) {
      return this._started = false;
    } else {
      this._changeState(SETUP);
      this._assignBoardsToPlayers();
      return await this.setup(players);
    }
  }

  _resetAttempts() {
    delete this._attempts;
  }

  _attempt(players) {
    let attempts = this._attempts;

    if (!attempts) {
      attempts = this._attempts = players.reduce((map, player) => {
        map.set(player, 1);
        return map;
      }, new Map());
    } else {
      for (let player of players) {
        attempts.set(
          player,
          attempts.get(player) + 1,
        );
      }
    }

    return attempts;
  }

  async setup(players) {
    let attempts = Array.from(this._attempt(players));

    if (_.values(attempts).some(attempt => attempt[1] > 3)) {

      let winners = attempts.filter(attempt => attempt[1] < 4)
                      .map(attempt => attempt[0]);
      let losers = attempts.filter(attempt => attempt[1] > 3)
                      .map(attempt => attempt[0]);
      this.finish(winners, losers);
      return false;
    }

    players.map(player => player.ships(this._createShips()));
    let promises = players.map(player => player.setup(player.ships()));

    await Promise.all(promises);
    let verdicts = players.map(player => this.verify(player.board()));

    if (verdicts.every(verdict => verdict)) {
      this._changeState(BATTLE);
      return this._started = true;
    } else {
      players = players.reduce((players, player, i) => {
        if (!verdicts[i]) {
          players.push(player);
        }

        return players;
      }, []);

      return this.setup(players);
    }
  }

  verify(board) {
    return Board.verifySetup(board);
  }

  _nextTurn() {
    this._turn++;
  }

  async turn() {
    let currentPlayer = this.currentPlayer();
    let opponents = this.players().filter(pl => pl !== currentPlayer);
    let attempts = 1;
    let turn = this.turnNo();
    let prevShoot = this._prevShootOf(currentPlayer);
    let { player, target } = await currentPlayer.turn(opponents, prevShoot);

    while (!Board.verifyShootingTarget(player.board(), target) && attempts < 3) {
      ({ player, target } = await currentPlayer.turn(opponents, prevShoot));
      attempts++;
    }

    if (attempts > 2) {
      this.finish(opponents, [currentPlayer]);
      return false;
    }

    let { result, sink } = player.board().shoot(target);

    this._history.push({
      shootingPlayer: currentPlayer,
      recievingPlayer: player,
      turn,
      target,
      result,
      sink,
    });

    if (result === WATER) {
      this._nextTurn();
    } else if (result === HIT) {

      if (sink && player.floatingShips().length === 0) {
        this.finish([currentPlayer], [player]);
        return;
      }

      return this.turn();
    }

    return result;
  }

  finish(winners, losers) {
    this._changeState(FINISHED);
    this._resetAttempts();
    this._winners = winners;
    this._losers = losers;

    for (let winner of winners) {
      winner.win();
    }

    for (let loser of losers) {
      loser.lose();
    }
  }
}

export default Game;
