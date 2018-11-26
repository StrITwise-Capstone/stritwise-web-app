import React, { Component } from 'react';
import {
  Paper,
  Typography,
  Divider,
  withStyles,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
} from '@material-ui/core';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { storage } from '../../../config/fbConfig';
import moment from 'moment';

import Form from './Form';
class createEvent extends Component {

  state = {
    event: null,
    imageFile: null,
  };

  componentDidMount(){
    const { events } = this.props;
    const { event } = this.state;
    const values = queryString.parse(this.props.location.search);
    if ( events != null && event == null)
    { this.setState({
        event: events[values.event],
      })
      this.forceUpdate()
      console.log("here");
    }
  }

  render() {
    const { classes } = this.props;
    const { event, imageFile } = this.state;
    const values = queryString.parse(this.props.location.search);
    console.log(event)
    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Typography variant="h4" className={classes.title}>Sign Up For Event</Typography>
          <Divider />
          <div className={classes.form}>
          {event &&
            (<div>
                <div>
                  {/* { imageFile == null
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
                  } */}
                </div>
                
                  <Typography variant="h5" component="h2" className={classes.textField}>
                    {event.name}
                  </Typography>
              <div>
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
                    {event.desc}
                  </Typography>
              </div>
              </div>
            )
          }
          {event && <Form event={event} eventuid={values.event}/>}
          </div>
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authError: state.auth.authError,
  auth: state.firebase.auth,
  events : state.firestore.data.events,
});

createEvent.propTypes = {
  auth: PropTypes.objectOf(PropTypes.string),
  authError: PropTypes.string,
  logIn: PropTypes.func,
  logOut: PropTypes.func,
};

createEvent.defaultProps = {
  auth: {},
  authError: null,
  logIn: () => {},
  logOut: () => {},
};

const styles = () => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '70vh',
  },
  paper: {
    width: '100%',
    maxWidth: '500px',
  },
  title: {
    textAlign: 'center',
    padding: '10px',
  },
  form: {
    margin: '10px',
  },
});

export default connect(mapStateToProps)(withStyles(styles)(createEvent));
