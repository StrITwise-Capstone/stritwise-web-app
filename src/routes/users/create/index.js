import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import { Typography } from '@material-ui/core';
import { withFirestore } from 'react-redux-firebase';

import AddUserForm from './AddUserForm';
import AdminLayout from '../../../hoc/Layout/AdminLayout';

/**
 * Class representing the AddUser component.
 */
class AddUser extends Component {
  state = {
    // List of school documents.
    schools: [],
  }

  /**
   * Populates the school array in the state with all the documents from the schools collection.
   */
  componentDidMount() {
    const { firestore } = this.props;
    firestore.collection('schools').orderBy('name', 'asc').get().then((querySnapshot) => {
      const schools = [];
      querySnapshot.forEach((doc) => {
        schools.push({
          label: doc.data().name,
          value: doc.id,
        });
      });
      this.setState({ schools });
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    const { schools } = this.state;

    return (
      <AdminLayout>
        <Typography variant="h4" id="title">Add User</Typography>
        <AddUserForm schools={schools} />
      </AdminLayout>
    );
  }
}

AddUser.propTypes = {
  firestore: PropTypes.shape({}).isRequired,
};

export default withSnackbar(withFirestore(AddUser));
