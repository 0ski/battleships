import seedrandom from 'seedrandom';
import _ from 'lodash';

import Player from '../Models/Player';
import SocketAPIFactory from '../SocketIO/client';

const PRIME = 229;
const NUM = PRIME;

class LocalPlayer extends Player {

  constructor({
    seed = Math.floor(Math.random() * PRIME),
    name = 'Local Player',
    setupCallback = _.noop,
    turnCallback = _.noop,
    isOnlineGame = false,
  }={}) {
    super();
    this._random = seedrandom(seed);
    this._name = name;
    this.setupCallback = setupCallback;
    this.turnCallback = turnCallback;
    this._isOnlineGame = isOnlineGame;
    this._socket = SocketAPIFactory();
  }

  name() {
    return this._name;
  }

  random() {
    return Math.floor(this._random() * NUM);
  }

  ready() {
    return true;
  }

  async setup(ships) {
    this.ships(ships);
    await this.setupCallback(ships);

    if (this._isOnlineGame) {
      this._socket.sendSetup(this.board());
    }

    return this.board();
  }

  async turn(opponents, prevShootState) {
    let ret = await this.turnCallback();
    if (this._isOnlineGame) {
      console.log('Sending', ret.target);
      this._socket.sendTargetPos(ret.target);
    }

    return ret;
  }
}

export default LocalPlayer;
