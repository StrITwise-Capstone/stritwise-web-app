import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Navbar from './Navbar/Navbar';

class App extends Component {
  render() {
    const { children } = this.props;
    return (
      <React.Fragment>
        <Navbar />
        { children }
      </React.Fragment>
    );
  }
}

App.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;
