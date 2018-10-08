import React, { Component } from 'react';
import styles from './Battlefield.module.css';

import ShipList from './ShipList';
import BoardView from './BoardView';

class Battlefield extends Component {

  render() {
    let { gameRunner } = this.props.gameInterface;
    let players = gameRunner.getPlayers();

    return (
      <div className={ styles.battlefield }>
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
            side={ 'right' }
          ></ShipList>
        </div>
      </div>
    );
  }
}

export default Battlefield;
