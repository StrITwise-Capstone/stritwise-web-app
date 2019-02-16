import React, { Component } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { withRouter } from 'react-router';

import Form from './Form';
import urlForDownloads from '../../../../config/urlForDownloads';

class FormDialog extends Component {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  /**
   * Get all student emails
   */
  getStudentsEmail = () => {
    const { firestore, match } = this.props;
    this.setState({ isLoading: true });
    firestore.collection('events').doc(match.params.eventId).collection('students').get().then((querySnapshot) => {
      const studentsEmail = [];
      querySnapshot.forEach((doc) => {
        studentsEmail.push(
          doc.data().email,
        );
      });
      this.setState({ studentsEmail, isLoading: false });
    }).catch((error) => {
      this.setState({ studentsEmail: [''] });
      console.log(error);
    });
  }

  render() {
    const {
      schools,
      eventuid,
      refreshState,
    } = this.props;

    return (
      <div>
        <Button
          type="button"
          variant="contained"
          color="secondary"
          onClick={this.handleClickOpen}>
          Upload CSV
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          schools={schools}
        >
          <DialogTitle id="form-dialog-title">
            <p>Upload CSV</p>
          </DialogTitle>
          <DialogContent>
            <a href={urlForDownloads.volunteersTemplate}>Download Template</a>
            <Form
              refreshState={refreshState}
              eventuid={eventuid}
              handleClose={this.handleClose}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

FormDialog.propTypes = {
  eventuid: PropTypes.string,
  refreshState: PropTypes.func.isRequired,
  /* eslint-disable react/forbid-prop-types */
  schools: PropTypes.any,
  /* eslint-enable */
};

FormDialog.defaultProps = {
  eventuid: null,
  schools: null,
};

export default compose(
  firestoreConnect(),
  withRouter,
)(FormDialog);
