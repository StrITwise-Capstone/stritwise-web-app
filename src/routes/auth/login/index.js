import React, { Component } from 'react';
import {
  Paper,
  Typography,
  Divider,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as reduxAction from '../../../store/actions';
import Form from './Form';

class Login extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Typography variant="h4" className={classes.title}>Sign In</Typography>
          <Divider />
          <div className={classes.form}>
            <Form />
          </div>
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authError: state.auth.authError,
  auth: state.firebase.auth,
});

const mapDispatchToProps = dispatch => ({
  logIn: creds => dispatch(reduxAction.logIn(creds)),
  logOut: () => dispatch(reduxAction.logOut()),
});

Login.propTypes = {
  auth: PropTypes.objectOf(PropTypes.string),
  authError: PropTypes.string,
  logIn: PropTypes.func,
  logOut: PropTypes.func,
};

Login.defaultProps = {
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Login));
