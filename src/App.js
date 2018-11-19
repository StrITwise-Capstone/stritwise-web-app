import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter, Router } from 'react-router';
import './App.css';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Index from './routes/index';
import Test from './routes/test';
import Layout from './hoc/Layout/Layout';
import SignUp from './routes/signup';
import Login from './routes/login';
import { retrieveUser } from './store/actions/authActions';

class App extends Component {
  componentDidMount() {
    const { auth, users } = this.props
    if (auth.uid != null && users != null) {
      retrieveUser(auth.uid);
    }
  }

  componentDidUpdate() {
    const { auth, users } = this.props
    if (auth.uid != null && users != null) {
      retrieveUser(auth.uid);
    }
  }

  render() {
    const {
      classes,
      auth,
      users,
      user,
    } = this.props;

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

const mapStateToProps = (state) => {
  console.log(state);
  return {
    authError: state.auth.authError,
    auth: state.firebase.auth,
    users: state.firestore.data.users,
    user: state.auth.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return ({
    retrieveUser: user => dispatch(retrieveUser(user)),
  }),
}
export default withRouter(compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([{
    collection: 'users',
  }]),
)(App));
