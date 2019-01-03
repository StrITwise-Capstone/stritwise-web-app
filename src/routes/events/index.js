import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
  Button,
} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase'
import { withSnackbar } from 'notistack';
import { Link } from 'react-router-dom';

import CardList from './EventsUI/CardList/CardList';
import AdminLayout from '../../hoc/Layout/AdminLayout';

class Dashboard extends Component {

  createEvent = () => {
    const { history } = this.props;
    history.push('/events/create')
  }
  
  action = () => {
    const { isAuthenticated,user } = this.props;
    if (isAuthenticated && (user.type === 'admin' || user.type === 'orion member'))
    {
      
    return(<React.Fragment>
      <Button
        type="button"
        variant="contained"
        color="secondary"
        component={Link}
        to="/events/create"
      >Create Event</Button>
    </React.Fragment>)
    }
  }

  render() {
    const { eventsList , isAuthenticated,user } = this.props;

    return (
      <AdminLayout
        title='Events'
        subtitle={user && `Welcome, ${user.firstName} ${user.lastName}`}
        action={this.action()}
      >
       { isAuthenticated && user && <CardList eventsList={eventsList} userType={user.type} />}
      </AdminLayout>
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
  withSnackbar,
)(Dashboard);
