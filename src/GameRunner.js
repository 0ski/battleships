import React, { Component, createContext } from 'react';
import Game from './Models/Game';

const DEFAULT_STATE = {
  gameState: undefined,
};
const GameContext = createContext(DEFAULT_STATE);

class GameRunner extends Component {
  state = DEFAULT_STATE;

  createNewGame = () => {
    this.game = new Game();
    this.setState({
      gameState: this.game.state(),
    });
  };

  addPlayers = players => {
    players.map(PlayerCls =>
      this.game.add(
        new PlayerCls({
          delay: 1000,
        })
      )
    );
  };

  getPlayers = () => this.game.players();

  startGame = async () => {
    await this.game.ready();
    await this.game.start();
    this.setState({
      gameState: this.game.state(),
    });
  };

  getBoardDim = () => this.game.dim();
  getBoardState = playerId => this.game.players()[playerId].board().state();
  getTurnNo = () => this.game.turnNo() + 1;
  getCurrentPlayer = () => this.game.currentPlayerNo();

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
