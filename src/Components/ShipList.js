import React, { Component } from 'react';
import _ from 'lodash';
import styles from './ShipList.module.css';

import ShipComponent from './ShipComponent';

class ShipList extends Component {

  onClick = ship => {
    this.props.onClick(ship);
  };

  render() {
    let { ships, side='left', mode } = this.props;
    let style;

    if (mode === 'setup') {
      style = styles.clickable;
    } else {
      style = styles.wrapper;
    }

    ships = ships.map((ship, i) =>
      (<div
        onClick={ mode === 'setup' ? this.onClick.bind(this, ship) : _.noop }
        className={ style }
        key={ i }
       ><ShipComponent
         name={ ship.name() }
         size={ ship.size() }
         hitpoints={ ship.hitpoints() }
         highlight={ ship === this.props.activeShip }
        /></div>)
    );

    return (
      <div
        className={ styles[side] }
      >
        { ships }
      </div>
    );
  }
}

export default ShipList;
