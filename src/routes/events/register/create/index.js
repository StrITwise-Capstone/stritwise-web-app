import React, { Component } from 'react';
import {
  Paper,
  Typography,
  Divider,
  withStyles,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {firestoreConnect} from 'react-redux-firebase';
import { withSnackbar } from 'notistack';

import Form from './Form';

class createEvent extends Component {
  state = {
    schools: [],
    user: {},
  }

  componentDidMount() {
    const { firestore } = this.props;
    
    firestore.collection('schools').get().then((querySnapshot) => {
      const schools = [];
      querySnapshot.forEach((doc) => {
      schools.push({
          label: doc.data().name,
          value: doc.id,
        });
      });
      this.setState({ schools });
    }).catch((error) => {
      console.log(error);
      });
  }

  render() {
    const { classes, currentevent } = this.props;
    const { schools } = this.state;
    return (
      <div className={classes.root}>
        <Paper>
          <Typography variant="h4" className={classes.title}>Add Team and Students</Typography>
          <Divider />
          <div className={classes.form}>
           {currentevent && <Form schools={schools ? schools : null} minStudent={currentevent['min_student'] ? currentevent['min_student'] : 1} />
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
  return {
      currentevent: state.firestore.data.currentevent,
      isAuthenticated: state.auth.isAuthenticated,
      user: state.firestore.data.user,
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
  withSnackbar,
)(createEvent);
