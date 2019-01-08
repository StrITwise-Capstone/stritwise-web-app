import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { withSnackbar } from 'notistack';

import Form from './Form';
import AdminLayout from '../../../hoc/Layout/AdminLayout';

class editEvent extends Component {
  state = {
    event: null,
  };

  componentWillMount() {
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
      this.forceUpdate();
    }
  }

  render() {
    const { match } = this.props;
    const { event } = this.state;
    const eventuid = match.params.id;
    return (
      <AdminLayout
        title="Edit Event"
      >
        <Form event={event} eventuid={eventuid} />
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


export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    {
      collection: 'events',
    },
  ]),
  withSnackbar,
)(editEvent);
