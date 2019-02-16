import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { withSnackbar } from 'notistack';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

/**
 * Class representing the DeleteButton component.
 * @param {Object[]} schools - An array of objects containing school name and Id
 * @param {string} studentId - A string of the student Id
 * @param {Function} updatePage - A function to update the page
*/
class DeleteButton extends Component {

  /**
  * Delete current student
  */
  deleteStudent = () => {
    const {
      enqueueSnackbar,
      firestore,
      studentId,
      match,
      updatePage,
    } = this.props;
    /**
     * Delete the student email
    */
    const deleteStudentEmail = (studentId) => {
      return firestore.collection('events').doc(match.params.eventId).collection('students').doc(studentId).get().then((docRef) => {
        const emailOfStudent = docRef.data().email;
        firestore.collection('events').doc(match.params.eventId).get().then((docRef2) => {
          let studentsEmail = docRef2.data().students_email;
          studentsEmail.map((email, index) => {
            if (studentsEmail[index] === emailOfStudent) {
              studentsEmail.splice(index, 1);
              return firestore.collection('events').doc(match.params.eventId).update({
                students_email: studentsEmail,
              });
            }
            return null;
          });
        }
        );
      });
    };
    deleteStudentEmail(studentId)
      .then(() => {
        firestore.collection('events').doc(match.params.eventId).collection('students').doc(studentId)
          .delete().then(() => {
            enqueueSnackbar('Student Delete',{
              variant: 'success',
            });
            updatePage();
          }).catch((error) => {
            enqueueSnackbar('Student Not Deleted', {
              variant: 'error',
            });
            console.log(error);
          });
      });
  }

  render() {
    return (
      <Button onClick={this.deleteStudent} color="primary">Delete</Button>
    );
  }
}

DeleteButton.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  studentId: PropTypes.string.isRequired,
  /* eslint-disable react/forbid-prop-types */
  firestore: PropTypes.any.isRequired,
  match: PropTypes.any.isRequired,
  /* eslint-enable */
};


export default compose(withSnackbar, firestoreConnect(), withRouter)(DeleteButton);
