import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import './App.css';
import Index from './routes/index';
import Test from './routes/test';
import Layout from './hoc/Layout/Layout';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Layout>
          <Switch>
            <Route path="/test" component={Test} />
            <Route path="/" exact component={Index} />
          </Switch>
        </Layout>
      </React.Fragment>
    );
  }
}

export default App;
