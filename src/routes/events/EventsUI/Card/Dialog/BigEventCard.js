import React from 'react';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  CircularProgress,
  DialogContent,
  DialogContentText,
} from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { withFirebase } from 'react-redux-firebase';
import { compose } from 'redux';

import { firebaseConnect } from 'react-redux-firebase';
import ButtonList from '../ButtonList';

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
    notDeleted: true,
  };

  componentWillMount() {
    const { event , firebase } = this.props;
    firebase.storage().ref(`${event.image_path}`).getDownloadURL().then((img) => {
      const imageFile = img;
      this.setState({
        imageFile,
      });
    }).catch((error) => {
      console.log(`Unable to retreive${error}`);
    });
  }

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
    const { classes, event, eventuid, userType } = this.props;
    const { imageFile, notDeleted } = this.state;
    return (
      <React.Fragment>
        {notDeleted
          && (
            <Card style={{ width: '600px', height: '700px' }}>
              <CardContent className={classes.cardActionArea}>
                <div>
                  { imageFile === null
                    && (
                      <div>
                        <CircularProgress className={classes.progress} />
                      </div>)}
                  { imageFile
                    && (
                      <CardMedia
                        component="img"
                        className={classes.media}
                        height="140"
                        src={imageFile}
                      />)
                  }
                </div>
                <CardContent>
                  <Typography variant="h5" component="h2" className={classes.textField}>
                    {event.name}
                  </Typography>
                </CardContent>
              </CardContent>
              <div>
                <CardContent style={{ height: '300px' }}>
                  <Typography variant="subheading" color="primary">
                    <strong>Start Date : </strong>
                    {
                      moment(event.start_date.toDate()).calendar()
                    }
                  </Typography>
                  <Typography variant="subheading" color="primary">
                    <strong>End Date : </strong>
                    {
                      moment(event.end_date.toDate()).calendar()
                    }
                  </Typography>
                  <div style={{ height: '10px' }} />
                  <Typography component="p" className={classes.textField}>
                    Description:
                  </Typography>
                  <Typography style={{"paddingTop":"5px"}}>
                    {event.desc}
                  </Typography>
                </CardContent>
              </div>
              <CardActions className={classes.action}>
              <ButtonList eventuid={eventuid} classes={classes} userType={userType}/>
              {userType === 'admin' && <Button size="small" color="primary" onClick={this.deleteEvent}>Delete Event</Button>}
              </CardActions>
            </Card>
          )}
        { notDeleted === false
          && (
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Event is deleted successfully.
              </DialogContentText>
            </DialogContent>
          )
        }
      </React.Fragment>
    );
  }
}


export default compose(withFirebase,withStyles(styles),firebaseConnect())(eventCard);
