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

  startGame = async () => {
    await this.game.ready();
    await this.game.start();
    this.setState({
      gameState: this.game.state(),
    });
  };

  render() {
    return (
      <GameContext.Provider
        value={{
          gameState: this.state.gameState,
          gameRunner: {
            createNewGame: this.createNewGame,
            addPlayers: this.addPlayers,
            startGame: this.startGame,
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
