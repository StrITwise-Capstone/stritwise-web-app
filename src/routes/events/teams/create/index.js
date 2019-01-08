import React, { Component } from 'react';
import {
  withStyles,
  CircularProgress,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { withSnackbar } from 'notistack';
import { withRouter } from 'react-router';

import Form from './Form';
import AdminLayout from '../../../../hoc/Layout/AdminLayout';

class createTeam extends Component {
  state = {
    schools: [],
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
    const { currentevent, auth, user } = this.props;
    const { schools } = this.state;
    var teacherId = '';
    if (user && user.type === 'teacher') {
      teacherId = auth.uid;
    }
    return (
      <AdminLayout
        title="Register Team"
      >
        {currentevent == null
          && (
          <CircularProgress/>
          )}
        {currentevent
          && (
          <Form 
            schools={schools ? schools : null}
            minStudent={currentevent.min_student ? currentevent.min_student : 1}
            teacherId={teacherId}
          />)
        }
      </AdminLayout>
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

const mapStateToProps = (state, ownProps) => {
  return {
    currentevent: state.firestore.data[`currentevent${ownProps.match.params.id}`],
    isAuthenticated: state.auth.isAuthenticated,
    user: state.firestore.data.user,
    auth: state.firebase.auth,
  }
};

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
  firestoreConnect(props => [
    {
      collection: 'events',
      doc: `${props.match.params.id}`,
      storeAs: `currentevent${props.match.params.id}`,
    },
  ]),
  withSnackbar,
  withRouter,
)(createTeam);
