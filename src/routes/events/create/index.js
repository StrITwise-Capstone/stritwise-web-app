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
import AdminLayout from '../../../hoc/Layout/AdminLayout';

class createEvent extends Component {
  
  render() {
    const { classes } = this.props;

    return (
      <AdminLayout>
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Typography variant="h4" className={classes.title}>Create Event</Typography>
          <Divider />
          <div className={classes.form}>
            <Form />
          </div>
        </Paper>
      </div>
      </AdminLayout>
    );
  }
}

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
