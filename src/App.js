import React, { Component } from 'react';
import styles from './App.module.css';

import Game from './Models/Game';

import Menu from './Components/Menu';
import PlayersLists from './Components/PlayersLists';
import ShipList from './Components/ShipList';
import BoardView from './Components/BoardView';

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
    } else if (gameState === GAME_STATES.BATTLE) {
      let players = gameRunner.getPlayers();
      contents = (
        <div className={ styles.battleground }>
          <div className={ styles.leftShipList }>
            <ShipList
              ships={ players[0].ships() }
            ></ShipList>
          </div>
          <div className={ styles.boards }>
            <div
              className={
                gameRunner.getCurrentPlayer() === 0 ? styles.currentPlayer : styles.player
              }
            >
              Player 1
            </div>
            <div className={ styles.turn } >
              { gameRunner.getTurnNo() }
            </div>
            <div
              className={
                gameRunner.getCurrentPlayer() === 1 ? styles.currentPlayer : styles.player
              }
            >
              Player 2
            </div>
            <BoardView
              boardState={ gameRunner.getBoardState(0) }
              dim={ gameRunner.getBoardDim() }
            />
            <div className={ styles.gap }></div>
            <BoardView
              boardState={ gameRunner.getBoardState(1) }
              dim={ gameRunner.getBoardDim() }
            />
          </div>
          <div className={ styles.rightShipList }>
            <ShipList
              ships={ players[1].ships() }
            ></ShipList>
          </div>
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
