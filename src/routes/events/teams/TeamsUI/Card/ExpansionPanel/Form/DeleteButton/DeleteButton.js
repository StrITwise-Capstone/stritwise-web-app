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
    firestore.collection('events').doc(match.params.eventId).collection('students').doc(studentId)
      .delete().then(() => {
        enqueueSnackbar('Student Delete',{
          variant: 'success',
        });
        updatePage();
      }).catch((err) => {
        enqueueSnackbar('Student Not Deleted', {
          variant: 'error',
        });
        console.log(err);
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
