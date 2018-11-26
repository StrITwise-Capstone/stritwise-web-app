import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, withStyles } from '@material-ui/core';
import { withRouter } from 'react-router-dom';

import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';
import CardList from '../EventsUI/CardList/CardList';

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
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  createEvent = () => {
    const { history } = this.props;
    history.push('/events/create')
  }
  render() {
    const { eventsList , classes, auth, users, isAuthenticated } = this.props;
    return (
      <div>
        <div>
        <h1>{users && isAuthenticated && `Welcome, ${users[auth.uid].firstName} ${users[auth.uid].lastName}`}</h1>
        <h1>Events </h1>
        <CardList eventsList={eventsList} />
        </div>
        <Button variant="fab" color="primary" aria-label="Add" onClick={() => {this.createEvent()}} className={classes.button}>
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
export default withRouter(connect(mapStateToProps)(withStyles(styles)(Dashboard)));
