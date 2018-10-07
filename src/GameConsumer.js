import React, { Component, Children, cloneElement } from 'react';
import { GameContext } from './GameRunner';

export default class GameConsumer extends Component {
  render() {
    const { children } = this.props;

    return (
      <GameContext.Consumer>
        {
          (gameInterface => {
            console.log(gameInterface);
            return Children.map(children, child =>
              cloneElement(child, {
                gameInterface,
              })
            );
          })
        }
      </GameContext.Consumer>
    );
  }
}
