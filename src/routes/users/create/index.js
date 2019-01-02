import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import { Typography } from '@material-ui/core';
import { withFirestore } from 'react-redux-firebase';

import AddUserForm from './AddUserForm';
import AdminLayout from '../../../hoc/Layout/AdminLayout';

class AddUser extends Component {
  state = {
    schools: [],
  }

  componentDidMount() {
    const { firestore } = this.props;
    firestore.collection('schools').get().then((querySnapshot) => {
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
    const { enqueueSnackbar } = this.props;
    const { schools } = this.state;

    return (
      <AdminLayout
      >
        <Typography variant="h4" id="title">Add a New User!</Typography>
        <AddUserForm schools={schools}/>
      </React.Fragment>
    );
  }
}

AddUser.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
};

export default withSnackbar(withFirestore(AddUser));
