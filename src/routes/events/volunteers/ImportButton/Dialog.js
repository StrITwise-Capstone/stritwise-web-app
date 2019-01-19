import React from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';

import Form from './Form';

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
            <a href="https://drive.google.com/a/np.edu.sg/file/d/1je8FVM3U7R1YPABfPkPozw1M1SSFr0Tm/view?usp=sharing">Download Template</a>
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

export default FormDialog;
