import React, { Component } from 'react';
import _ from 'lodash';
import styles from './BoardView.module.css';

import Board from '../Models/Board';
const RESULTS = Board.results();

class BoardView extends Component {
  render() {
    let { dim, boardState } = this.props;
    let [totalCol, totalRow] = dim;
    let cells = _.flatten(boardState).map(
      (cell, index) => {
        let style;

        if (cell === RESULTS.HIT) {
          style = 'hit';
        } else if (cell === RESULTS.SINK) {
          style = 'sink';
        } else if (cell === RESULTS.WATER) {
          style = 'water';
        } else {
          style = 'unrevealed';
        }

        return <div key={ index } className={ styles[style] }></div>;
      }
    );

    return (
      <div
        className={ styles.board }
        style={{
          gridTemplateColumns: `repeat(${totalCol}, 1fr )`,
          gridTemplateRows: `repeat(${totalRow}, 1fr )`,
        }}
      >
        { cells }
      </div>
    );
  }
}

export default BoardView;
