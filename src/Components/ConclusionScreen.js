import React, { Component } from 'react';
import styles from './ConclusionScreen.module.css';

const DEFAULT_STATE = {
  hidden: false,
};

class ConclusionScreen extends Component {

  state = DEFAULT_STATE;

  hide = () => {
    this.setState({ hidden: true });
  };

  render() {
    let hidden = this.props.hidden || this.state.hidden;

    return (
      <div
        className={ styles.modal }
        style= {{
          display: hidden ? 'none' : 'flex',
        }}
      >
            <div className={ styles.conclusion }>
              <div
            className={ styles.X }
            onClick={ this.hide }
          ></div>
          <div className={ styles.text }>{ this.props.player } won!</div>
          <div className={ styles.box }></div>
        </div>
      </div>
    );
  }
}

export default ConclusionScreen;
