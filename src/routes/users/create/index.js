import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import { Typography } from '@material-ui/core';

import AddUserForm from './AddUserForm';
import AdminLayout from '../../../hoc/Layout/AdminLayout';

class AddUser extends Component {
  render() {
    const { enqueueSnackbar } = this.props;
    enqueueSnackbar('You may add a new user now!', {
      variant: 'info',
    });

    return (
      <AdminLayout
      >
        <Typography variant="h4" id="title">Add a New User!</Typography>
        <AddUserForm />
      </AdminLayout>
    );
  }
}

AddUser.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
};

export default withSnackbar(AddUser);
