import React from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import PropTypes from 'prop-types';

import Form from './Form';
import urlForDownloads from '../../../../config/urlForDownloads';

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
export default FormDialog;
