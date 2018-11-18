import React, { Component } from 'react';
import Navbar from './Navbar/Navbar';
import {compose } from 'redux';
import { firestoreConnect} from 'react-redux-firebase'
import { connect } from 'react-redux';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Navbar/>
        {this.props.children}
      </React.Fragment>
    );
  }
}


export default App;
