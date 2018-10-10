import React, { Component } from 'react';
import _ from 'lodash';
import styles from './SetupBoard.module.css';

import BoardView from '../Components/BoardView';
import ShipList from '../Components/ShipList';

class SetupBoard extends Component {

  player = this.props.player;
  ships = this.props.player.ships();
  board = this.player.board();
  state = {
    activeShip: undefined,
    ships: _.clone(this.ships),
    ready: false,
  };

  takeShip = ship => {
    this.setState({ activeShip: ship });
  };

  rotate = () => {
    this.state.activeShip.rotate();
    this.setState({ activeShip: this.state.activeShip });
  };

  launch = pos => {
    let ship = this.state.activeShip;
    let ships = this.state.ships;
    this.board.launch(pos, ship);
    ships = ships.filter(listedShip => listedShip !== ship);
    let ready = !ships.length;
    this.setState({ activeShip: undefined, ships, ready });
  };

  reset = () => {
    this.board.clear();
    this.setState({
      activeShip: undefined,
      ships: _.clone(this.ships),
      ready: false,
    });
  };

  rnd = () => {
    let ships = this.state.ships;
    let wasSuccess = this.board.launchRandomly(ships);
    let attempts = 1000;

    while (!wasSuccess) {
      wasSuccess = this.board.launchRandomly(ships);
      attempts--;
      if (!attempts) {
        throw new Error('Could not setup board randomly'); //Need a better error handling here
      }
    }

    this.setState({
      activeShip: undefined,
      ships: [],
      ready: true,
    });
  };

  start = () => this.props.start();

  render() {
    return (
      <div className={ styles.setup }>
        <ShipList
          mode={ 'setup' }
          ships={ this.state.ships }
          activeShip={ this.state.activeShip }
          onClick={ this.takeShip }
        />
        <div className={ styles.boardSetup }>
          <BoardView
            mode={ 'setup' }
            board={ this.board }
            activeShip={ this.state.activeShip }
            launch={ this.launch }
            onRotate={ this.rotate }
          />
        </div>
        <div className={ styles.controls }>
          <div className={ styles.info }>
            Click on a ship from your fleet to place it on the board,
            <br/>
            when ship is active press 'r' to rotate
          </div>
          <button
            onClick={ this.reset }
            className={ styles.reset }
          >Reset board</button>
          <button
            onClick={ this.rnd }
            className={ this.state.ships.length ? styles.rnd : styles.disabled }
            disabled={ !this.state.ships.length }
          >Randomly setup board</button>
          <button
            onClick={ this.start }
            className={ this.state.ready ? styles.start : styles.disabled }
            disabled={ !this.state.ready }
          >To battle!</button>
        </div>
      </div>
    );
  }
}

export default SetupBoard;
