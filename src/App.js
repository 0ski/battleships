import React, { Component } from 'react';
import styles from './App.module.css';

import Game from './Models/Game';

import Menu from './Components/Menu';
import PlayersLists from './Components/PlayersLists';
import Battlefield from './Components/Battlefield';
import ConclusionScreen from './Components/ConclusionScreen';
import SetupBoard from './LocalPlayer/SetupBoard';

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

  mainMenu = () => {
    let { gameRunner } = this.props.gameInterface;

    gameRunner.resetGame();
  };

  render() {
    let contents;
    let afterGame;
    let { gameState, gameRunner } = this.props.gameInterface;

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
    } else if (gameState === GAME_STATES.SETUP) {
      contents = (
        <SetupBoard
          player = { gameRunner.getLocalPlayer() }
          start = { gameRunner.finishLocalPlayerSetup }
        />
      );
    } else if (gameState === GAME_STATES.BATTLE || gameState === GAME_STATES.FINISHED) {
      contents = (
        <Battlefield
          gameInterface = { this.props.gameInterface }
        />
      );
    } else {
      contents = 'Something went wrong! Please refresh the page.';
    }

    if (gameState === GAME_STATES.FINISHED) {
      afterGame = (
        <div>
          <ConclusionScreen
            player={ this.props.gameInterface.gameRunner.winner() }
            hidden={ gameState !== GAME_STATES.FINISHED }
          />
          <button
            className={ styles.returnToMainMenu }
            onClick={ this.mainMenu }
          >Return to main menu</button>
        </div>
      );
    }

    return (
      <div className={ styles.landing }>
        <div className={ styles.fog }>
          <div className={ styles.fogFirstLayer }></div>
          <div className={ styles.fogSecondLayer }></div>
          <div className={ styles.landingBackground }></div>
        </div>
        { contents }
        { afterGame }
      </div>
    );
  }
}

export default App;
