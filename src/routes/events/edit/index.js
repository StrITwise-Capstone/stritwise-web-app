import React, { Component } from 'react';
import {
  Paper,
  Typography,
  Divider,
  withStyles,
} from '@material-ui/core';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Form from './Form';

class editEvent extends Component {
  state = {
    event: null,
  };

  componentDidMount(){
    const { events, match } = this.props;
    const { event } = this.state;
    const values = match.params.id;
    if ( events != null && event == null)
    { this.setState({
        event: events[values],
      })
      this.forceUpdate();
    }
  }

  render() {
    const { classes, match } = this.props;
    const { event } = this.state;
    const values = match.params.id;
    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Typography variant="h4" className={classes.title}>Edit Event</Typography>
          <Divider />
          <div className={classes.form}>
            <Form event={event} eventuid={values.event}/>
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

editEvent.propTypes = {
  classes: PropTypes.node.isRequired,
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

export default connect(mapStateToProps)(withStyles(styles)(editEvent));