import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { withSnackbar } from 'notistack';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

class DeleteButton extends Component {
  deleteStudent = () => {
    const {
      enqueueSnackbar,
      firestore,
      studentuid,
      match,
      updatePage,
    } = this.props;
    firestore.collection('events').doc(match.params.eventId).collection('students').doc(studentuid)
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
  studentuid: PropTypes.string.isRequired,
  /* eslint-disable react/forbid-prop-types */
  firestore: PropTypes.any.isRequired,
  match: PropTypes.any.isRequired,
  /* eslint-enable */
};

DeleteButton.defaultProps = {
};


export default compose(withSnackbar, firestoreConnect(), withRouter)(DeleteButton);
