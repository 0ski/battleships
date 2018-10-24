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
    touch: false,
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

  getIndexOfCell(target) {
    let parent = target.parentElement;
    return Array.from(parent.children).indexOf(target);
  }

  keyDown = e => {
    if (e.key === 'r' && this.props.mode === 'setup') {
      this.props.onRotate();
    }
  };

  mouseUp = (isValidPosition, boardTarget, e) => {
    if (this.state.touch) {
      this.touch(isValidPosition, boardTarget, e);
    } else {
      this.launch(isValidPosition, boardTarget);
    }

    this.setState({ touch: false });
  };

  touchStart = () => {
    this.setState({ touch: true });
  };

  touch = (isValidPosition, boardTarget, e) => {
    let DOMTarget = e.target;
    if (!DOMTarget.childElementCount) {
      let { board, activeShip } = this.props;
      let activeIndex = this.state.activeIndex;
      let index = this.getIndexOfCell(DOMTarget);
      console.log(activeIndex, index);
      if (activeIndex === index) {
        this.launch(
          isValidPosition,
          boardTarget
        );
      } else {
        this.setState({
          activeIndex: index,
        });
        console.log(this.state, index);
      }
    }
  };

  mouseOut = () => {
    if (!this.state.touch) {
      this.setState({ activeIndex: undefined });
    }
  };

  mouseMove = e => {
    let target = e.target;
    if (!target.childElementCount) {
      this.setState({
        activeIndex: this.getIndexOfCell(target),
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
    console.log('launch');
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
    let boardTarget;
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

    boardTarget = [activeIndex % 10, Math.floor(activeIndex / 10)];
    isValidShootingTarget = Board.verifyShootingTarget(board, boardTarget);
    if (activeShip) {
      isValidPosition = Board.verifyShipPosition(board, boardTarget, activeShip);
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
    let onTouch;

    if (mode === 'setup' && activeShip) {
      onClickCallback = this.mouseUp.bind(this, isValidPosition, boardTarget);
      onMoveCallback = this.mouseMove;
      onLeaveCallback = this.mouseOut;
      onTouch = this.touchStart;
    } else if (mode === 'battle') {
      onClickCallback = isValidShootingTarget ? this.fire.bind(this, boardTarget) : _.noop;
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
        onMouseUp={ onClickCallback }
        onTouchStart={ onTouch }
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
