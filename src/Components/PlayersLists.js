import React, { Component } from 'react';
import _ from 'lodash';

import SelectionList from './SelectionList';
import * as ComputerPlayers from '../AI';

import styles from './PlayersList.module.css';
import './list.css';

const DEFAULT_STATE = {
  selectedPlayers: [
    { cls: ComputerPlayers.EasyAI, name: 'Easy' },
    { cls: ComputerPlayers.EasyAI, name: 'Easy' },
  ],
  firstPlayer: 0,
};

class PlayersList extends Component {

  state = DEFAULT_STATE;

  startGame = () => {
    // let arr = this.state.selectedPlayers;
    // let firstPlayer = this.state.firstPlayer;
    // let players = [arr[firstPlayer]].concat(arr.splice(firstPlayer, 1));
    let players = this.state.selectedPlayers.map(player => player.cls);
    if (this.props.onStartGame) {
      this.props.onStartGame(
        players
      );
    }
  };

  constructor(props) {
    super(props);
    this.players = _.keys(ComputerPlayers).map(name => ({
        name: name.replace('AI', ''),
        cls: ComputerPlayers[name],
      })
    );
    window.lists = this;
  }

  selectPlayer(selected, index) {
    let { selectedPlayers, firstPlayer } = this.state;
    firstPlayer = index;
    selectedPlayers[index] = selected;

    this.setState({ selectedPlayers, firstPlayer });
  }

  render() {
    let whoGoesFirst = '';

    if (this.state.firstPlayer !== -1) {
      whoGoesFirst = (
        <div className={ styles.firstPlayer }>
          Player { this.state.firstPlayer + 1 } goes first
        </div>
      );
    }

    return (
      <div className={ styles.playersPicker }>
        { whoGoesFirst }
        <div className={ styles.playersLists }>
          <div className={ styles.playersList }>
            <div className={ styles.playerNo }>Player 1:</div>
            <SelectionList
              items={ this.players }
              selected={ this.players[0] }
              select={
                selected => { this.selectPlayer(selected, 0); }
              }
            />
          </div>
          <div className={ styles.VS }></div>
          <div className={ styles.playersList }>
            <div className={ styles.playerNo }>Player 2:</div>
            <SelectionList
              items={ this.players }
              selected={ this.players[0] }
              select={
                selected => { this.selectPlayer(selected, 1); }
              }
            />
          </div>
        </div>
        <button
          type="button"
          disabled={ this.state.selectedPlayers.length < 2 }
          onClick={ this.startGame }
          className={ styles.startGame }
        >Start</button>
      </div>
    );
  }
}

export default PlayersList;
