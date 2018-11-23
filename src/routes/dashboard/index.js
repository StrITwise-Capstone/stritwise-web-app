import React, { Component } from 'react';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import { Button, Icon, withStyles, Modal } from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

import CardList from './CardList/CardList';

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

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

class Dashboard extends Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { eventsList ,firestore, classes, auth, users, isAuthenticated, user} = this.props;
    return (
      <div>
        <div>
        <h1>{users && isAuthenticated && `Welcome, ${users[auth.uid].firstName} ${users[auth.uid].lastName}`}</h1>
        <h1>Events </h1>
        <CardList eventsList={eventsList} />
        </div>
        <Button variant="fab" color="primary" aria-label="Add" href="/createevent" className={classes.button}>
          <AddIcon />
        </Button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    eventsList: state.firestore.data.events,
    auth: state.firebase.auth,
    users: state.firestore.data.users,
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
  };
};
export default connect(mapStateToProps)(withStyles(styles)(Dashboard));
