import React from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';

import Form from './Form';
import urlForDownloads from '../../../../../config/urlForDownloads';

class FormDialog extends React.Component {
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
      eventuid,
      refreshState,
      teacherId,
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
              refreshState={refreshState}
              schools={schools}
              eventuid={eventuid}
              handleClose={this.handleClose}
              teacherId={teacherId}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default FormDialog;
