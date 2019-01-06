import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import { Typography } from '@material-ui/core';
import { withFirestore } from 'react-redux-firebase';

import AddCrewForm from './AddCrewForm';
import AdminLayout from '../../../../hoc/Layout/AdminLayout';

class AddVolunteer extends Component {
  render() {
    return (
      <AdminLayout
      >
        <Typography variant="h4" id="title">Add Volunteer!</Typography>
        <AddCrewForm />
      </AdminLayout>
    );
  }
}

AddVolunteer.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
};

export default withSnackbar(withFirestore(AddVolunteer));
