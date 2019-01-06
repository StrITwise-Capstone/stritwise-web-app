import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Typography,
} from '@material-ui/core';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

const styles = {
  card: {
    width:'100%',
    height:'100%',
  },
  media: {
    height: '150px',
  },
};


class EventCard extends Component {
  state={
    imageFile:null,
  }
  componentWillMount() {
    const { firebase,imageSource } = this.props;
    firebase.storage().ref(`${imageSource}`).getDownloadURL().then((img) => {
      const imageFile = img;
      this.setState({
        imageFile,
      });
    }).catch((error) => {
      console.log(`Unable to retreive ${error}`);
    });
  }

  render(){
  const { classes, eventuid,history, title, imageTitle, end_date } = this.props;
  const { imageFile } = this.state;
  const image = imageFile;
  return (
    <Card className={classes.card}>
      <CardActionArea style={{height:'100%'}}onClick={()=>{history.push(`/events/${eventuid}/overview`)}}>
        { imageFile === null
          && (
            <div>
              <CircularProgress className={classes.progress} />
            </div>)
        }
        { imageFile !== null && 
        <CardMedia
          className={classes.media}
          image={image}
          title={imageTitle}
        />
        }
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {title}
          </Typography>
          <Typography component="p">
            <strong>Start Date : </strong>
            {
              moment(end_date.toDate()).calendar()
            }
          </Typography>
          <Typography component="p">
          <strong>End Date : </strong>
            {
              moment(end_date.toDate()).calendar()
            }
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
  }
}

EventCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withRouter,firebaseConnect(),withStyles(styles))(EventCard);
