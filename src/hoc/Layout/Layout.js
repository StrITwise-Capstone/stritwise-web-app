import React, { Component } from 'react';
import Navbar from './Navbar/Navbar';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Navbar />
        {this.props.children}
      </React.Fragment>
    );
  }
}


export default App;
