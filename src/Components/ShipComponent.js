import React, { Component } from 'react';
import styles from './ShipComponent.module.css';

class ShipComponent extends Component {
  render() {
    let { name, size, hitpoints, highlight } = this.props;
    let damage = size - hitpoints;
    let structure = [];

    for (let i = 0; i < damage; i++) {
      structure.push(
        <div key={ i } className={ styles.damagedPart }></div>
      );
    }

    for (let i = 0; i < hitpoints; i++) {
      structure.push(
        <div key={ damage + i } className={ styles.healthyPart }></div>
      );
    }

    return (
      <div className={ highlight ? styles.highlightedShip : styles.ship }>
        <div className={ styles.name }>{ name }</div>
        <div className={ styles.structure }>
          { structure }
        </div>
      </div>
    );
  }
}

export default ShipComponent;
