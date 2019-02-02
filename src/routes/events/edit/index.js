import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { withSnackbar } from 'notistack';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { CircularProgress } from '@material-ui/core';

import Form from './EditEventForm';
import AdminLayout from '../../../hoc/Layout/AdminLayout';

class editEvent extends Component {
  state = {
    event: null,
    isLoading: true,
  };

  componentDidMount() {
    this.getEvent();
  }

  getEvent() {
    const {
      match,
      firestore,
    } = this.props;
    firestore.collection('events').doc(match.params.eventId).get().then((doc)=>{
      this.setState({ event: doc.data(), isLoading: false });
    });
  }

  refreshState = () => {
    this.getEvent();
  }

  render() {
    const { match } = this.props;
    const { event, isLoading } = this.state;
    const eventId = match.params.eventId;
    return (
      <AdminLayout
        title="Edit Event"
      >
        {isLoading && <CircularProgress />}
        {!isLoading && (<Form event={event} eventId={eventId} refreshState={() => { this.refreshState(); }} />)}
      </AdminLayout>
    );
  }
}

const mapStateToProps = state => ({
  events: state.firestore.data.events,
  auth: state.firebase.auth,
  isAuthenticated: state.auth.isAuthenticated,
  user: state.firestore.data.user,
});

editEvent.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  match: PropTypes.any.isRequired,
  firestore: PropTypes.any.isRequired,
  /* eslint-enable */
};

editEvent.defaultProps = {
};

export default compose(
  connect(mapStateToProps),
  withRouter,
  firestoreConnect(),
  withSnackbar,
)(editEvent);
