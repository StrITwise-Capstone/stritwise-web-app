import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { withSnackbar } from 'notistack';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import Form from './EditEventForm';
import AdminLayout from '../../../hoc/Layout/AdminLayout';

class editEvent extends Component {
  state = {
    event: null,
  };

  componentDidUpdate() {
    const {
      events,
      match,
    } = this.props;
    const { event } = this.state;
    const eventuid = match.params.id;
    if (events !== null && events !== undefined && event === null) {
      this.setState({
        event: events[eventuid],
      });
    }
  }

  refreshState = () => {
    const {
      events,
      match,
    } = this.props;
    const eventuid = match.params.id;
    this.setState({
      event: events[eventuid],
    });
  }

  render() {
    const { match } = this.props;
    const { event} = this.state;
    const eventuid = match.params.id;
    return (
      <AdminLayout
        title="Edit Event"
      >
        <Form event={event} eventuid={eventuid} refreshState={() => { this.refreshState(); }} />
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
  events: PropTypes.any,
  match: PropTypes.any.isRequired,
  /* eslint-enable */
};

editEvent.defaultProps = {
  events: null,
};

export default compose(
  connect(mapStateToProps),
  withRouter,
  firestoreConnect([
    {
      collection: 'events', storeAs: 'events',
    },
  ]),
  withSnackbar,
)(editEvent);
