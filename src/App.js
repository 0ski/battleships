import React, { Component } from 'react';
import styles from './App.module.css';

import Menu from './Components/Menu';

class App extends Component {
  render() {
    return (
      <div className={ styles.landing }>
        <div className={ styles.fog }>
          <div className={ styles.fogFirstLayer }></div>
          <div className={ styles.fogSecondLayer }></div>
        </div>
        <Menu></Menu>
      </div>
    );
  }
}

export default App;
