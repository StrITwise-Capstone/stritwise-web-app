import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import './App.css';
import Index from './routes/index';
import Test from './routes/test';
import Layout from './hoc/Layout/Layout';
import SignUp from './routes/signup';
import Login from './routes/login';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Layout>
          <Switch>
            <Route path="/test" component={Test} />
            <Route path="/" exact component={Index} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
          </Switch>
        </Layout>
      </React.Fragment>
    );
  }
}

export default App;
