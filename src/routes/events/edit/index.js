import React, { Component } from 'react';
import {
  Paper,
  Typography,
  Divider,
  withStyles,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { withSnackbar } from 'notistack';

import Form from './Form';
import AdminLayout from '../../../hoc/Layout/AdminLayout';


class editEvent extends Component {
  state = {
    event: null,
  };

  componentWillMount(){
    const { events, match } = this.props;
    const { event } = this.state;
    const eventuid = match.params.id;
    if ( events !== null && event === null)
    { this.setState({
        event: events[eventuid],
      })
      this.forceUpdate();
    }
  }
  
  render() {
    const { classes, match } = this.props;
    const { event } = this.state;
    const eventuid = match.params.id;
    return (
      <AdminLayout>
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Typography variant="h4" className={classes.title}>Edit Event</Typography>
          <Divider />
          <div className={classes.form}>
            <Form event={event} eventuid={eventuid}/>
          </div>
        </Paper>
      </div>
      </AdminLayout>
    );
  }
}

const mapStateToProps = state => ({
  events : state.firestore.data.events,
  auth: state.firebase.auth,
  isAuthenticated: state.auth.isAuthenticated,
  user: state.firestore.data.user,
});


const styles = () => ({
  root: {
    alignItems: 'center',
    width: '100%',
    height: '70vh',
    margin: '0 auto',
    maxWidth: '500px',
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

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    {
      collection:'events'
    }
  ]),
  withStyles(styles),
  withSnackbar,
)(editEvent);
