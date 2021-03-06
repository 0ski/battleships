import _ from 'lodash';

import Ship from './Ship';
import Board from './Board';
import Player from './Player';

import RemotePlayer from '../RemotePlayer/RemotePlayer';

const SHIP_TYPES = Ship.types();
const { WATER, HIT, SINK, ERROR } = Board.results();

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

  static defaultShipTypesList() {
    return [
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
    ];
  }

  static defaultDim() {
    return [10, 10];
  }

  //Standard BATTLESHIPS rules:
  //10x10 board for following ships:
  //four one-sized
  //three two-sized
  //two three-sized
  //one four-sized
  constructor({
    dim=Game.defaultDim(),
    shipTypes=Game.defaultShipTypesList(),
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
    return this.players()[this.currentPlayerNo()];
  }

  currentPlayerNo() {
    return this.turnNo() % this.players().length;
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

  async start(cb = _.noop) {
    this._cb = cb;
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

    let remotePlayerIndex = players.findIndex(pl => pl instanceof RemotePlayer);
    let localPlayerIndex = (remotePlayerIndex + 1) % 2;
    let promises = players.map(player => player.setup(player.ships()));

    // if (remotePlayerIndex !== -1) {
    //   console.log(remotePlayerIndex, localPlayerIndex);
    //   let whoIsFirst;
    //   await promises[remotePlayerIndex].then(() => {
    //     if (whoIsFirst === undefined) {
    //       whoIsFirst = remotePlayerIndex;
    //     }
    //   });
    //   await promises[localPlayerIndex].then(() => {
    //     if (whoIsFirst === undefined) {
    //       whoIsFirst = localPlayerIndex;
    //     }
    //   });
    //   console.log('after', remotePlayerIndex, localPlayerIndex, whoIsFirst);
    //   if (whoIsFirst === remotePlayerIndex) {
    //     this._turn++;
    //   }
    // }

    let val = await Promise.race(promises);

    if (val === players[remotePlayerIndex].board()) {
      this._turn++;
    }

    await Promise.all(promises);
    console.log('All players setup their boards');
    let verdicts = players.map(player => this.verify(player.board(), player.ships()));
    console.log('Players verdicts', verdicts);

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
    if (this._shipTypes.length !== board.ships().length) {
      return false;
    }

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
    let shootState = {
      shootingPlayer: currentPlayer,
      recievingPlayer: player,
      turn,
      target,
    };

    while (!Board.verifyShootingTarget(player.board(), target) && attempts < 3) {
      shootState.result = ERROR;
      this._history.push(shootState);
      ({ player, target } = await currentPlayer.turn(opponents, prevShoot));
      attempts++;
    }

    if (attempts > 2) {
      shootState.result = ERROR;
      this._history.push(shootState);
      this.finish(opponents, [currentPlayer]);
      return false;
    }

    let { result } = player.board().shoot(target);
    shootState.result = result;
    this._history.push(shootState);
    await this._cb(shootState);

    if (result === WATER) {
      this._nextTurn();
    } else if (result === HIT) {
      return this.turn();
    } else if (result === SINK) {
      if (player.floatingShips().length === 0) {
        this.finish([currentPlayer], [player]);
        return;
      } else {
        return this.turn();
      }
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
