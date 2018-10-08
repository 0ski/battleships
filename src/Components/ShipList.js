import React, { Component } from 'react';
import styles from './ShipList.module.css';

import ShipComponent from './ShipComponent';

class ShipList extends Component {
  render() {
    let { ships } = this.props;
    ships = ships.map((ship, i) =>
      (<ShipComponent
        key={ i }
        name={ ship.name() }
        size={ ship.size() }
        hitpoints={ ship.hitpoints() }
      />)
    );

    return (
      <div className={ styles.list }>
        { ships }
      </div>
    );
  }
}

export default ShipList;
