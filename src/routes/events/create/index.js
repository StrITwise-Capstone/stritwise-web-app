import React, { Component } from 'react';
import {
  Paper,
  Typography,
  Divider,
  withStyles,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withSnackbar } from 'notistack';

import Form from './Form';

class createEvent extends Component {
  componentDidMount(){
    const { history, enqueueSnackbar, isAuthenticated, user } = this.props;
    if (isAuthenticated === false){
      history.push('/auth/login');
      enqueueSnackbar('User not logged in', {
        variant: 'error',
      });
    }
    
    if (isAuthenticated){
      if (user.type !== 'admin' || user.type !== 'orion member'){
        history.push('/events');
        enqueueSnackbar('User does not have the administrative rights', {
          variant: 'error',
        });
      }
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Typography variant="h4" className={classes.title}>Create Event</Typography>
          <Divider />
          <div className={classes.form}>
            <Form />
          </div>
        </Paper>
      </div>
    );
  }
}

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

const mapStateToProps = (state) => { console.log(state)
  return {
    auth: state.firebase.auth,
    isAuthenticated: state.auth.isAuthenticated,
    user: state.firestore.data.user,
  };
};

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
  withSnackbar,
)(createEvent);
