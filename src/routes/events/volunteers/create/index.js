import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import { Typography } from '@material-ui/core';
import { withFirestore, firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { withRouter } from 'react-router';

import AddCrewForm from './AddCrewForm';
import AdminLayout from '../../../../hoc/Layout/AdminLayout';

class AddVolunteer extends Component {
  state = {
    isLoading: true,
  }
  componentDidMount() {
    const { firestore, match } = this.props;
    firestore.collection('events').doc(match.params.id).collection('teams').get().then((querySnapshot) => {
      const teams = [];
      querySnapshot.forEach((doc) => {
        teams.push({
          label: doc.data().team_name,
          value: doc.id,
        });
      });
      this.setState({ teams, isLoading: false });
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    const { teams, isLoading } = this.state;
    console.log(teams);
    return (
      <AdminLayout
      >
        <Typography variant="h4" id="title">Add Volunteer</Typography>
        {!isLoading && (<AddCrewForm teams={teams} />)}
      </AdminLayout>
    );
  }
}

AddVolunteer.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
};

export default compose(
  firestoreConnect(),
  withSnackbar,
  withRouter,
  withFirestore,
)(AddVolunteer);
