import _ from 'lodash';
import List from 'react-list-select';

import React, { Component } from 'react';
import * as ComputerPlayers from '../AI';

import styles from './PlayersList.module.css';
import './list.css';

const DEFAULT_STATE = {
  selectedPlayers: [],
  firstPlayer: -1,
};

class PlayersList extends Component {

  state = DEFAULT_STATE;

  startGame = () => {
    let arr = this.state.selectedPlayers;
    let firstPlayer = this.state.firstPlayer;
    let players = [arr[firstPlayer]].concat(arr.splice(firstPlayer, 1));
    if (this.props.onStartGame) {
      this.props.onStartGame(
        players
      );
    }
  };

  constructor(props) {
    super(props);
    this.classes = _.keys(ComputerPlayers).map(name => ComputerPlayers[name]);
    this.players = _.keys(ComputerPlayers).map(className =>
      className.replace('AI', '')
    );
  }

  selectPlayer(selected, index) {
    let { selectedPlayers, firstPlayer } = this.state;
    firstPlayer = index;
    selectedPlayers[index] = this.classes[selected];
    this.setState({ selectedPlayers, firstPlayer });
  }

  render() {
    let whoGoesFirst = '';

    if (this.state.firstPlayer !== -1) {
      whoGoesFirst = (
        <div className={ styles.isFirst }>
          Player { this.state.firstPlayer + 1 } goes first
        </div>
      );
    }

    return (
      <div className={ styles.playersList }>
        { whoGoesFirst }
        <div className={ styles.playerNo }>Player 1:</div>
        <List
          items={ this.players }
          multiple={ false }
          onChange={
            selected => { this.selectPlayer(selected, 0); }
          }
        />
        <div className={ styles.VS }>VS</div>
        <div className={ styles.playerNo }>Player 2:</div>
        <List
          items={ this.players }
          multiple={ false }
          onChange={
            selected => { this.selectPlayer(selected, 1); }
          }
        />
        <button
          type="button"
          disabled={ this.state.selectedPlayers.length < 2 }
          onClick={ this.startGame }
        >Start</button>
      </div>
    );
  }
}

export default PlayersList;
