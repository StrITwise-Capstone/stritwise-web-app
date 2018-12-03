import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, withStyles } from '@material-ui/core';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';

import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';
import CardList from '../TeamsUI/CardList/CardList';

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
    event: null,
  };

  componentDidMount(){
    const { eventsList, match } = this.props;
    const { event } = this.state;
    const values = match.params.id;
    if ( eventsList != null && event == null)
    { this.setState({
        event: eventsList[values],
      })
      this.forceUpdate();
    }
  }

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
    const { event } = this.state;
    //console.log(this.props.store.firestore.get('events/3z1WXjgy2jt607vcJ1qp/teams'));
    return (
      <div>
        <div>
        <h1>{event && event.name}</h1>
        <h1>Teams </h1>
        <CardList eventuid={this.props.match.params.id}/>
        </div>
        <Button variant="fab" color="primary" aria-label="Add" onClick={() => {this.createEvent()}} className={classes.button}>
          <AddIcon />
        </Button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
    console.log(state);
    return {
        eventsList: state.firestore.data.events,
        auth: state.firebase.auth,
        users: state.firestore.data.users,
        isAuthenticated: state.auth.isAuthenticated,
        user: state.auth.user,
        teams: state.firestore.data.teams,
    }
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
      {
        collection:'events',
      }
    ]),
    withStyles(styles)
)(Dashboard);
  