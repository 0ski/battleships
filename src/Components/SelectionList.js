import React, { Component } from 'react';
import styles from './SelectionList.module.css';

class SelectionList extends Component {

  select = item => {
    this.selected = item;
    this.props.select(item);
  };

  render() {

    this.selected = this.selected || this.props.selected;

    let items = this.props.items.map((item, index) => (
      <li
        key={ index }
        className={ item === this.selected ? styles.selected : styles.item }
        onClick={ this.select.bind(this, item) }
      >
        { item.name }
      </li>
    ));

    return (
      <ul className={ styles.list }>
        { items }
      </ul>
    );
  }
}

export default SelectionList;
