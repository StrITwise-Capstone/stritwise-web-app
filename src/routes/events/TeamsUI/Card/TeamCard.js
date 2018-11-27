import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  CircularProgress,
} from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { withFirebase } from 'react-redux-firebase';

import { storage } from '../../../../config/fbConfig';

const styles = {
  media: {
    // ⚠️ object-fit is not supported by IE 11.
    objectFit: 'cover',
  },
  progress: {
    padding: '30% 45%',
  },
  textField: {
    'word-wrap': 'break-word',
    overflow: 'auto',
  },
};

class eventCard extends React.Component {
  state = {
    imageFile: null,
    open: false,
    notDeleted: true,
  };

  componentWillMount() {
    const { event } = this.props;
    storage.ref(`${event.image_path}`).getDownloadURL().then((img) => {
      const imageFile = img;
      this.setState({
        imageFile,
      });
    }).catch((error) => {
      console.log(`Unable to retreive${error}`);
    });
  }

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  deleteEvent = () => {
    const { eventuid, firebase } = this.props;
    const db = firebase.firestore();
    db.collection('events').doc(eventuid).delete().then(() => {
      console.log('Document successfully deleted');
      this.setState({
        notDeleted: false,
      });
    }).catch((error) => {
      console.error('Error moving document', error);
    });
  }

  render() {
    const { classes, event, eventuid } = this.props;
    const { imageFile, notDeleted, open } = this.state;
    return (
      <React.Fragment>
      </React.Fragment>
    );
  }
}

eventCard.propTypes = {
  event: PropTypes.node.isRequired,
  eventuid: PropTypes.string.isRequired,
  firebase: PropTypes.node.isRequired,
  classes: PropTypes.node.isRequired,
};


export default withFirebase(withStyles(styles)(eventCard));
