import React, { Component, createContext } from 'react';

import Game from './Models/Game';
import LocalPlayer from './LocalPlayer/LocalPlayer';

const AI_DELAY = 500;
const GAME_STATES = Game.states();
const DEFAULT_STATE = {
  localPlayer: undefined,
  gameState: undefined,
  board1: [[]],
  board2: [[]],
};
const GameContext = createContext(DEFAULT_STATE);

class GameRunner extends Component {
  state = DEFAULT_STATE;

  createNewGame = () => {
    window.game = this.game = new Game();
    this.setState({
      gameState: this.game.state(),
    });
  };

  finishLocalPlayerSetup = () => this.setupDeferred.resolve();
  startLocalPlayerSetup = async ships => {
    this.setState({
      gameState: this.game.state(),
    });

    this.setupDeferred = {};
    this.setupDeferred.promise = new Promise((res, rej) => {
      this.setupDeferred.resolve = res;
      this.setupDeferred.reject = rej;
    });

    await this.setupDeferred.promise;

    return this.getLocalPlayer().board();
  };

  finishLocalPlayerTurn = target => this.turnDeferred.resolve(
    { target, player: this.getPlayers()[1] }
  );
  startLocalPlayerTurn = async () => {
    this.setState({
      gameState: this.game.state(),
    });

    this.turnDeferred = {};
    this.turnDeferred.promise = new Promise((res, rej) => {
      this.turnDeferred.resolve = res;
      this.turnDeferred.reject = rej;
    });

    let { target, player } = await this.turnDeferred.promise;

    return {
      player,
      target,
    };
  };

  addPlayers = players => {
    let player;
    players.forEach(PlayerCls => {
      if (PlayerCls !== LocalPlayer) {
        player = new PlayerCls({
          delay: AI_DELAY,
        });
      } else {
        player = new LocalPlayer({
          setupCallback: this.startLocalPlayerSetup,
          turnCallback: this.startLocalPlayerTurn,
        });
        this.setState({ localPlayer: player });
      }

      this.game.add(player);
    });
  };

  getPlayers = () => this.game.players();
  getLocalPlayer = () => this.game.players()[0];

  updateFE = () => {
    let players = this.getPlayers();

    this.setState({
      board1: players[0].board().state(),
      board2: players[1].board().state(),
    });
  };

  startGame = async () => {
    await this.game.ready();
    await this.game.start(this.updateFE);

    this.setState({
      gameState: this.game.state(),
    });

    while (this.game.state() !== GAME_STATES.FINISHED) {
      await this.game.turn();
      this.setState({
        gameState: this.game.state(),
      });
    }
  };

  getBoardDim = () => this.game.dim();
  getBoardState = playerId => this.game.players()[playerId].board().state();
  getTurnNo = () => this.game.turnNo() + 1;
  getCurrentPlayer = () => this.game.currentPlayerNo();

  resetGame = () => {
    delete this.game;
    this.setState(DEFAULT_STATE);
  };

  winner = () => this.game.winners()[0].name();

  render() {
    return (
      <GameContext.Provider
        value={{
          gameState: this.state.gameState,
          gameRunner: {
            createNewGame: this.createNewGame,
            addPlayers: this.addPlayers,
            getPlayers: this.getPlayers,
            startGame: this.startGame,
            getBoardDim: this.getBoardDim,
            getBoardState: this.getBoardState,
            getTurnNo: this.getTurnNo,
            getCurrentPlayer: this.getCurrentPlayer,
            resetGame: this.resetGame,
            winner: this.winner,
            localPlayerSetup: this.localPlayerSetup,
            getLocalPlayer: this.getLocalPlayer,
            finishLocalPlayerSetup: this.finishLocalPlayerSetup,
            finishLocalPlayerTurn: this.finishLocalPlayerTurn,
          },
        }}
      >
        { this.props.children }
      </GameContext.Provider>
    );
  }
}

export { GameContext };
export default GameRunner;
