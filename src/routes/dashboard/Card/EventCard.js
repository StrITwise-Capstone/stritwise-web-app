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
import moment from 'moment'
import queryString from 'query-string'

import { storage } from '../../../config/fbConfig';
import image from './Image/eventimage.jpg';
import RouteButton from './RouteButton/RouteButton';
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
  }
};

class eventCard extends React.Component {
  state = {
    imageFile: null,
  };

  componentWillMount() {
    const { event } = this.props;
    storage.ref(`${event.image_path}`).getDownloadURL().then((img) => {
      const imageFile = img;
      this.setState({
        imageFile,
      })
    }).catch((error) => {
      console.log(`Unable to retreive${ error}`)
    })
  }

  render() {
    const { classes, event, eventuid } = this.props;
    const { imageFile } = this.state;
    return (
      <Card style={{'width': '400px','height':'500px'}}>
        <CardActionArea className={classes.cardActionArea}>
          <div>
            { imageFile == null &&
              (
              <div>
                <CircularProgress className={classes.progress} />
              </div>)
            }
            { imageFile &&
              (
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
            <CardContent style={{'height':'200px',}}>
              <Typography variant="h7" component="h7" color="primary">
                <strong>Start Date :</strong> {moment(event.start_date.toDate()).calendar()}
              </Typography>
              <Typography variant="h7" component="h7" color="primary">
                <strong>End Date : </strong>{moment(event.end_date.toDate()).calendar()}
              </Typography>
              <div style={{'height':'10px'}}></div>
              <Typography component="p" className={classes.textField} >
                Description: <div style={{'height':'5px'}}/>
                { (event.desc.length> 200) ?
                  `${event.desc.substring(0,200)}...`:
                  event.desc
                }
              </Typography>
            </CardContent>
          </div>
          <CardActions className={classes.actions}>
            <RouteButton route='Sign Up' eventuid={eventuid}/>
            <RouteButton route='Edit Event' eventuid={eventuid}/>
            <RouteButton route='Delete Event' eventuid={eventuid}/>
        </CardActions>
      </Card>
    );
    }
}

eventCard.propTypes = {
  classes: PropTypes.object.isRequired,
  event: PropTypes.object.isRequired,
};

export default withStyles(styles)(eventCard);
