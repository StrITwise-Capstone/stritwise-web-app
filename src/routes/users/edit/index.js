import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withFirestore } from 'react-redux-firebase';
import { withRouter } from 'react-router';
import {
  Typography,
  CircularProgress,
} from '@material-ui/core';
import EditUserForm from './EditUserForm';
import AdminLayout from '../../../hoc/Layout/AdminLayout';

/**
 * Class representing the EditUser component.
 */
class EditUser extends Component {
  state = {
    // List of school documents.
    schools: [],
    // A specific user document.
    user: {},
  }

  /**
   * Populates the school array in the state with all the documents from the schools collection.
   * Populates the User variable in the state with a specific user document
   * from the users collection.
   */
  componentDidMount() {
    const { firestore, match } = this.props;
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

    const userID = match.params.id;
    const userDocRef = firestore.collection('users').doc(userID);
    userDocRef.get().then((doc) => {
      if (doc.exists) {
        const user = {
          id: userID,
          firstName: doc.data().firstName,
          lastName: doc.data().lastName,
          mobile: doc.data().mobile,
          school: {
            label: '',
            value: doc.data().school_id,
          },
        };
        this.setState({ user });
      }
    }).catch((error) => {
      console.log('Error getting document:', error);
    });
  }

  /**
   * Searches the schools array in state for a particular school_id
   * @returns {string} The school name.
   */
  getSchoolName = (schools, userSchoolId) => {
    if (schools !== null && userSchoolId !== null) {
      const currentSchool = schools.find(schoolElement => (schoolElement.value === userSchoolId));
      if (currentSchool) {
        return currentSchool.label;
      }
      return 'N.A. ';
    }
    return 'ErrorLoading';
  }

  render() {
    let content = <CircularProgress />;
    const { schools, user } = this.state;
    if (schools.length && user.school != null) {
      const userSchoolId = user.school.value;
      user.school.label = this.getSchoolName(schools, userSchoolId);
      content = (
        <AdminLayout>
          <Typography variant="h4" id="title">Edit User</Typography>
          <EditUserForm schools={schools} user={user} />
        </AdminLayout>
      );
    }
    return (
      <div>
        {content}
      </div>
    );
  }
}

EditUser.propTypes = {
  firestore: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
};

export default  withRouter(withFirestore(EditUser));
