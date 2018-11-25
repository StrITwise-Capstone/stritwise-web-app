import React from 'react';
import Dialog from '@material-ui/core/Dialog';

import BigEventCard from '../Card/BigEventCard/BigEventCard';


class SimpleDialog extends React.Component {
  handleClose = () => {
    this.props.onClose(this.props.selectedValue);
  };

  handleListItemClick = (value) => {
    this.props.onClose(value);
  };

  render() {
    const {
      classes,
      onClose,
      event,
      selectedValue,
      eventuid,
      ...other
    } = this.props;

    return (
      <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
        <BigEventCard event={event} eventuid={eventuid} />
      </Dialog>
    );
  }
}

export default SimpleDialog;
