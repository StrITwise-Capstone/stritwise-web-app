import React, { Component } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import PropTypes from 'prop-types';

import Form from './UploadTeamForm';
import urlForDownloads from '../../../../config/urlForDownloads';


/**
 * Class representing the FormDialog component.
 * @param {Object[]} schools - An array of objects containing school name and Id
 * @param {string} teacherId - A string of the teacher Id
 * @param {string} eventId - A string of event Id
 * @param {Function} updatePage - A function to update the page
 */
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

  render() {
    const {
      schools,
      eventId,
      updatePage,
      teacherId,
      teams,
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
            <a href={urlForDownloads.teamsTemplate}>Download Template</a>
            <Form
              updatePage={updatePage}
              schools={schools}
              eventId={eventId}
              handleClose={this.handleClose}
              teacherId={teacherId}
              teams={teams}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

FormDialog.propTypes = {
  eventId: PropTypes.string.isRequired,
  updatePage: PropTypes.func.isRequired,
  teacherId: PropTypes.string,
  /* eslint-disable react/forbid-prop-types */
  schools: PropTypes.any,
  /* eslint-enable */
};

FormDialog.defaultProps = {
  teacherId: '',
  schools: null,
};

export default FormDialog;
