import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, withStyles } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase'
import AddIcon from '@material-ui/icons/Add';
import { withSnackbar } from 'notistack';

import CardList from './EventsUI/CardList/CardList';

const styles = () => ({
  button: {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
  }
});

class Dashboard extends Component {

  createEvent = () => {
    const { history } = this.props;
    history.push('/events/create')
  }

  componentDidMount(){
    const { history, enqueueSnackbar, isAuthenticated } = this.props;
    if (isAuthenticated === false){
      history.push('/auth/login');
      enqueueSnackbar('User not logged in', {
        variant: 'error',
      });
    }
  }

  render() {
    const { eventsList , classes, isAuthenticated,user} = this.props;
    var type = "";
    if (user){
      type = user.type;
    }
    return (
      <div>
        <div>
        <h1>{user && isAuthenticated && `Welcome, ${user.firstName} ${user.lastName}`}</h1>
        <h1>Events </h1>
        <CardList eventsList={eventsList} userType={type} />
        </div>
        { (type == 'admin' || type == 'orion member') && 
        (<Button variant="fab" color="primary" aria-label="Add" onClick={() => {this.createEvent()}} className={classes.button}>
          <AddIcon />
        </Button>)}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    eventsList: state.firestore.data.events,
    auth: state.firebase.auth,
    isAuthenticated: state.auth.isAuthenticated,
    user: state.firestore.data.user,
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps),
  firestoreConnect(props => [
    {
      collection: 'users',
      storeAs: 'user',
      doc: `${props.auth.uid}`,
    },
    {
      collection: 'events',
    }
  ]),
  withStyles(styles),
  withSnackbar,
)(Dashboard);
