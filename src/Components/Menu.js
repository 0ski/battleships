import React, { Component } from 'react';
import styles from './Menu.module.css';

class Menu extends Component {
  render() {
    return (
      <div className={ styles.menuContainer }>
        <ul className={ styles.menu }>
          <li className={ styles.item }>
            <div className={ styles.pixelFlag }></div>
            <div
              className={ styles.pixelFlagText }
              onClick={ this.props.newGame }
            >New game</div>
          </li>
        </ul>
      </div>
    );
  }
}

export default Menu;
