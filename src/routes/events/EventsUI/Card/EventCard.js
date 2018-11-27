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
import { withSnackbar } from 'notistack';

import { storage } from '../../../../config/fbConfig';
import RouteButton from './RouteButton/RouteButton';
import SimpleDialogWrapped from '../Dialog/Dialog';

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
      this.props.enqueueSnackbar('Deleted Event', {
        variant: 'success',
      });
    }).catch((error) => {
      console.error('Error moving document', error);
      this.props.enqueueSnackbar('Deleted Event Error', {
        variant: 'error',
      });
    });
  }

  render() {
    const { classes, event, eventuid } = this.props;
    const { imageFile, notDeleted, open } = this.state;
    return (
      <React.Fragment>
        {event
          && notDeleted
          && (
            <Card style={{ width: '400px', height: '500px' }}>
              <CardActionArea className={classes.cardActionArea} onClick={this.handleClickOpen}>
                <div>
                  { imageFile == null
                    && (
                      <div>
                        <CircularProgress className={classes.progress} />
                      </div>)
                  }
                  { imageFile
                    && (
                      <CardMedia
                        component="img"
                        className={classes.media}
                        height="140"
                        src={imageFile}
                      />
                    )
                  }
                </div>
                <CardContent>
                  <Typography variant="h5" component="h2" className={classes.textField}>
                    {event.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <div>
                <CardContent style={{ height: '200px' }}>
                  <Typography variant="h7" component="h7" color="primary">
                    <strong>Start Date : </strong>
                    {
                      moment(event.start_date.toDate()).calendar()
                    }
                  </Typography>
                  <Typography variant="h7" component="h7" color="primary">
                    <strong>End Date : </strong>
                    {
                      moment(event.end_date.toDate()).calendar()
                    }
                  </Typography>
                  <div style={{ height: '10px' }} />
                  <Typography component="p" className={classes.textField}>
                    Description:
                    <div style={{ height: '5px' }} />
                    { (event.desc.length > 200)
                      ? `${event.desc.substring(0, 200)}...`
                      : event.desc
                    }
                  </Typography>
                </CardContent>
              </div>
              <CardActions className={classes.actions}>
                <RouteButton route="Register" routelink="register" eventuid={eventuid} />
                <RouteButton route="Edit Event" routelink="edit" eventuid={eventuid} />
                <Button size="small" color="primary" onClick={this.deleteEvent}>Delete Event</Button>
              </CardActions>
              <SimpleDialogWrapped
                open={open}
                onClose={this.handleClose}
                event={event}
                eventuid={eventuid}
              />
            </Card>)}
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


export default withSnackbar(withFirebase(withStyles(styles)(eventCard)));
