import React, { Component } from 'react';
import {
  Paper,
  Typography,
  Divider,
  withStyles,
} from '@material-ui/core';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {firestoreConnect} from 'react-redux-firebase';

import Form from './Form';

class createEvent extends Component {
  render() {
    const { classes, currentevent } = this.props;

    return (
      <div className={classes.root}>
        <Paper>
          <Typography variant="h4" className={classes.title}>Add Team and Students</Typography>
          <Divider />
          <div className={classes.form}>
           {currentevent && <Form minStudent={currentevent['min_student'] ? currentevent['min_student'] : 1} />
           }</div>
        </Paper>
      </div>
    );
  }
}


const styles = () => ({
  root: {
    paddingTop:'10px',
  },
  title: {
    textAlign: 'center',
    padding: '10px',
  },
  form: {
    margin: '10px',
  },
});

const mapStateToProps = (state) => {
  console.log(state);
  return {
      currentevent: state.firestore.data.currentevent,
  }
};

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
  firestoreConnect((props) => [
    {
      collection:'events',doc:`${props.match.params.id}`,storeAs:`currentevent`
    },
  ]),
)(createEvent);
