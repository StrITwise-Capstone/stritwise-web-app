import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Navbar from './Navbar/Navbar';

class App extends Component {
  render() {
    const { children } = this.props;
    return (
      <React.Fragment>
        <Navbar />
        <div style={{ padding: '0px 10px 10px 10px' }}>
          { children }
        </div>
      </React.Fragment>
    );
  }
}

App.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;
