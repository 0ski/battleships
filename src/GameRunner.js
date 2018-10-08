import React, { Component, createContext } from 'react';
import Game from './Models/Game';

const AI_DELAY = 500;
const GAME_STATES = Game.states();
const DEFAULT_STATE = {
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

  addPlayers = players => {
    players.map(PlayerCls =>
      this.game.add(
        new PlayerCls({
          delay: AI_DELAY,
        })
      )
    );
  };

  getPlayers = () => this.game.players();

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
