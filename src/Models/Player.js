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
}

export default Player;
