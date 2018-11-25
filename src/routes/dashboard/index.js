import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, withStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';
import CardList from './EventsUI/CardList/CardList';

const styles = () => ({
  button: {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
  },
});

class Dashboard extends Component {
  render() {
    const {
      eventsList,
      classes,
      auth,
      users,
      isAuthenticated,
    } = this.props;

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

const mapStateToProps = state => ({
  eventsList: state.firestore.data.events,
  auth: state.firebase.auth,
  users: state.firestore.data.users,
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

Dashboard.propTypes = {
  eventsList: PropTypes.node.isRequired,
  auth: PropTypes.node.isRequired,
  users: PropTypes.node.isRequired,
  isAuthenticated: PropTypes.string.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default connect(mapStateToProps)(withStyles(styles)(Dashboard));
