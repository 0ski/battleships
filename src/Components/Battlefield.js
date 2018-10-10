import React, { Component } from 'react';
import styles from './Battlefield.module.css';

import ShipList from './ShipList';
import BoardView from './BoardView';
import LocalPlayer from '../LocalPlayer/LocalPlayer';

class Battlefield extends Component {

  render() {
    let { gameRunner } = this.props.gameInterface;
    let players = gameRunner.getPlayers();

    let boardOneMode = players[1] instanceof LocalPlayer ? 'battle' : 'view';
    let boardTwoMode = players[0] instanceof LocalPlayer ? 'battle' : 'view';

    if (players[0] instanceof LocalPlayer) {
      if (gameRunner.getCurrentPlayer() === 0) {
        boardTwoMode = 'battle';
      } else {
        boardTwoMode = 'view';
      }
    } else if (players[1] instanceof LocalPlayer) {
      if (gameRunner.getCurrentPlayer() === 0) {
        boardOneMode = 'battle';
      } else {
        boardOneMode = 'view';
      }
    }

    return (
      <div className={ styles.battlefield }>
        <div className={ styles.leftShipList }>
          <div className={ styles.fleetName }>
            { `${players[0].name()} fleet:` }
          </div>
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
            { players[0].name() }
          </div>
          <div className={ styles.turn } >
            { gameRunner.getTurnNo() }
          </div>
          <div
            className={
              gameRunner.getCurrentPlayer() === 1 ? styles.currentPlayer : styles.player
            }
          >
            { players[1].name() }
          </div>
          <BoardView
            board={ players[0].board() }
            mode={ boardOneMode }
            fire={ gameRunner.finishLocalPlayerTurn }
          />
          <div className={ styles.gap }></div>
          <BoardView
            board={ players[1].board() }
            mode={ boardTwoMode }
            fire={ gameRunner.finishLocalPlayerTurn }
          />
        </div>
        <div className={ styles.rightShipList }>
          <div className={ styles.fleetName }>
            { `${players[1].name()} fleet:` }
          </div>
          <ShipList
            ships={ players[1].ships() }
            side={ 'right' }
          ></ShipList>
        </div>
      </div>
    );
  }
}

export default Battlefield;
