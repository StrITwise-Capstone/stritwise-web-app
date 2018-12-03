import React, { Component } from 'react';
import {
  withStyles,
} from '@material-ui/core';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';

import Form from './Form';

class editStudent extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Form/>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authError: state.auth.authError,
  auth: state.firebase.auth,
});

createEvent.propTypes = {
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


export default compose(
  connect(mapStateToProps),
  withStyles(styles),
)(editStudent);
