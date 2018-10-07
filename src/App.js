import React, { Component } from 'react';
import styles from './App.module.css';

import Game from './Models/Game';

import Menu from './Components/Menu';
import PlayersLists from './Components/PlayersLists';

const GAME_STATES = Game.states();

class App extends Component {

  createNewGame = () => {
    let { gameRunner } = this.props.gameInterface;
    gameRunner.createNewGame();
  };

  addPlayersAndStartGame = players => {
    let { gameRunner } = this.props.gameInterface;

    gameRunner.addPlayers(players);
    gameRunner.startGame();
  };

  render() {
    let contents;
    let { gameState } = this.props.gameInterface;

    if (gameState === undefined) {
      contents = <Menu newGame={ this.createNewGame }></Menu>;
    } else if (gameState === GAME_STATES.UNREADY) {
      contents = (
        <div>
          <PlayersLists
            onStartGame={ this.addPlayersAndStartGame }
          />
        </div>
      );
    } else {
      contents = 'Something went wrong! Please refresh the page.';
    }

    return (
      <div className={ styles.landing }>
        <div className={ styles.fog }>
          <div className={ styles.fogFirstLayer }></div>
          <div className={ styles.fogSecondLayer }></div>
          <div className={ styles.landingBackground }></div>
        </div>
        { contents }
      </div>
    );
  }
}

export default App;
