import React, { Component } from 'react';
import _ from 'lodash';
import styles from './BoardView.module.css';

import Board from '../Models/Board';
import Ship from '../Models/Ship';

const RESULTS = Board.results();
const { HORIZONTAL, VERTICAL } = Ship.shapes();

class BoardView extends Component {

  state = {
    activeIndex: undefined,
  };

  componentDidMount() {
    if (this.props.mode === 'setup') {
      window.document.addEventListener('keydown', this.keyDown);
    }
  }

  componentWillUnmount() {
    if (this.props.mode === 'setup') {
      window.document.removeEventListener('keydown', this.keyDown);
    }
  }

  keyDown = e => {
    if (e.key === 'r' && this.props.mode === 'setup') {
      this.props.onRotate();
    }
  };

  mouseOut = () => this.setState({ activeIndex: undefined });
  mouseMove = e => {
    let target = e.target;
    if (!target.childElementCount) {
      let parent = target.parentElement;
      this.setState({
        activeIndex: Array.from(parent.children).indexOf(target),
      });
    }
  };

  calculateStyleName(cell, index, isValidPosition, isValidShootingTarget) {
    let { mode, activeShip } = this.props;
    let { activeIndex } = this.state;
    let stylesString;
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

    if (mode === 'battle' && isValidShootingTarget && index === activeIndex) {
      return styles.validTarget;
    }

    if (mode !== 'setup' || activeIndex === undefined || !activeShip) {
      return styles[style];
    }

    let target = [activeIndex % 10, Math.floor(activeIndex / 10)];
    let [col, row] = target;
    let someCol = index % 10;
    let someRow = Math.floor(index / 10);

    if (activeIndex === index) {
      stylesString = styles.active;
    } else if (
      activeShip.shape() === HORIZONTAL &&
      row === someRow &&
      col + activeShip.size() > someCol &&
      col < someCol
    ) {
      stylesString = styles.active;
    } else if (
      activeShip.shape() === VERTICAL &&
      col === someCol &&
      row + activeShip.size() > someRow &&
      row < someRow
    ) {
      stylesString = styles.active;
    } else {
      stylesString = styles[style];
    }

    if (!isValidPosition && stylesString === styles.active) {
      stylesString = styles.invalid;
    }

    return stylesString;
  }

  launch = (isValidPosition, target) => {
    if (isValidPosition) {
      this.setState({
        activeIndex: undefined,
      });
      this.props.launch(target);
    }
  };

  fire = target => this.props.fire(target);

  render() {
    let { board, mode, activeShip } = this.props;
    let { activeIndex } = this.state;
    let dim = board.dim();
    let style;
    let target;
    let isValidPosition;
    let isValidShootingTarget;
    let boardState;

    if (mode === 'setup') {
      boardState = board.setup();
    } else if (mode === 'battle') {
      boardState = board.state();
    } else if (mode === 'view') {
      boardState = board.state();
    }

    target = [activeIndex % 10, Math.floor(activeIndex / 10)];
    isValidShootingTarget = Board.verifyShootingTarget(board, target);
    if (activeShip) {
      isValidPosition = Board.verifyShipPosition(board, target, activeShip);
    }

    let [totalCol, totalRow] = dim;
    let cells = _.flatten(boardState).map(
      (cell, index) => {
        style = this.calculateStyleName(cell, index, isValidPosition, isValidShootingTarget);

        return <div key={ index } className={ style }></div>;
      }
    );

    let onClickCallback;
    let onMoveCallback;
    let onLeaveCallback;

    if (mode === 'setup' && activeShip) {
      onClickCallback = this.launch.bind(this, isValidPosition, target);
      onMoveCallback = this.mouseMove;
      onLeaveCallback = this.mouseOut;
    } else if (mode === 'battle') {
      onClickCallback = isValidShootingTarget ? this.fire.bind(this, target) : _.noop;
      onMoveCallback = this.mouseMove;
      onLeaveCallback = this.mouseOut;
    } else {
      onClickCallback = _.noop;
      onMoveCallback = _.noop;
      onLeaveCallback = _.noop;
    }

    return (
      <div
        className={ `${styles.board} ${styles[mode]}` }
        onPointerMove={ onMoveCallback }
        onPointerLeave={ onLeaveCallback }
        onClick={ onClickCallback }
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
