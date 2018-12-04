import React from 'react';
import PropTypes from 'prop-types';
import {Button} from '@material-ui/core';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { withSnackbar } from 'notistack';

class DeleteButton extends React.Component {
  deleteStudent = () =>{{
    const {enqueueSnackbar,firestore,eventuid,teamuid,studentuid} = this.props;
    firestore.collection('events').doc(eventuid).collection('teams').doc(teamuid).collection('students').doc(studentuid).delete().then(() => {
        enqueueSnackbar('Student Delete',{
            variant: 'success',
        })
    }).catch(() => {
        enqueueSnackbar('Student Not Deleted', {
            variant: 'error',
        });
   });
}}

  render() {
    return (
        <Button onClick={this.deleteStudent} color="primary">Delete</Button>
    );
  }
}

export default compose(withSnackbar,firestoreConnect())(DeleteButton);