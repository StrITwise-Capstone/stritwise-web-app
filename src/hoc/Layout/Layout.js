import React, { Component } from 'react';
import Navbar from './Navbar/Navbar';

class App extends Component {
  render() {
    const user = '';
    return (
      <React.Fragment>
        <Navbar user={user} />
        {this.props.children}
      </React.Fragment>
    );
  }
}

export default App;
