import React, { Component } from 'react';
import {
  withStyles,
  CircularProgress,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import { withRouter } from 'react-router';

import Form from './AddTeamForm';
import AdminLayout from '../../../../hoc/Layout/AdminLayout';

const styles = () => ({
  root: {
    paddingTop: '10px',
  },
  title: {
    textAlign: 'center',
    padding: '10px',
  },
  form: {
    margin: '10px',
  },
});

/**
 * Class representing the AddTeam component.
 * @param {Object} user - A specific user document
 */
class AddTeam extends Component {
  state = {
    schools: [],
    event: null,
    isLoading: true,
  }

  componentDidMount() {
    this.getSchools();
    this.getEvent();
    this.getTeamsName();
    this.getStudentsEmail();
  }

  /**
   * Get all the teams
   */
  getTeamsName = () => {
    const { firestore, match } = this.props;
    this.setState({ isLoading: true });
    firestore.collection('events').doc(match.params.eventId).collection('teams').get().then((querySnapshot) => {
      const teamsName = [];
      querySnapshot.forEach((doc) => {
        teamsName.push(
          doc.data().team_name,
        );
      });
      this.setState({ teamsName, isLoading: false });
    }).catch((error) => {
      console.log(error);
    });
  }

  /**
   * Get all student emails
   */
  getStudentsEmail = () => {
    const { firestore, match } = this.props;
    this.setState({ isLoading: true });
    firestore.collection('events').doc(match.params.eventId).get().then((doc) => {
      this.setState({ studentsEmail: doc.data().students_email, isLoading: false });
    }).catch((error) => {
      this.setState({ studentsEmail: [''] });
      console.log(error);
    });
  }

  /**
   * Get all the schools
   */
  getSchools = () => {
    const { firestore } = this.props;
    this.setState({ isLoading: true });
    firestore.collection('schools').orderBy('name', 'asc').get().then((querySnapshot) => {
      const schools = [];
      querySnapshot.forEach((doc) => {
        schools.push({
          label: doc.data().name,
          value: doc.id,
        });
      });
      this.setState({ schools, isLoading: false });
    }).catch((error) => {
      console.log(error);
    });
  }

  /**
   * Get the event to add the team to
   */
  getEvent = () => {
    const { firestore, match } = this.props;
    this.setState({ isLoading: true });
    firestore.collection('events').doc(match.params.eventId).get().then((docRef) => {
      this.setState({ event: docRef.data(), isLoading: false });
    });
  }

  render() {
    const { auth, user } = this.props;
    const {
      schools,
      isLoading,
      event,
      teamsName,
      studentsEmail,
    } = this.state;
    let teacherId = '';
    let schoolId = '';
    if (user && user.type === 'teacher') {
      teacherId = auth.uid;
      schoolId = user.school;
    }
    return (
      <AdminLayout
        title="Register Team"
      >
        {isLoading
          && (
          <CircularProgress />
          )}
        {!isLoading && event
          && (
          <Form
            schools={schools || null}
            minStudent={event.min_student ? event.min_student : 1}
            maxStudent={event.max_student ? event.max_student : 10}
            teacherId={teacherId}
            schoolId={schoolId}
            teamsName={teamsName}
            studentsEmail={studentsEmail ? studentsEmail : ['']}
          />)
        }
      </AdminLayout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    user: state.firestore.data.user,
    auth: state.firebase.auth,
  };
};

AddTeam.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  firestore: PropTypes.any.isRequired,
  user: PropTypes.any.isRequired,
  auth: PropTypes.any.isRequired,
  match: PropTypes.any.isRequired,
  /* eslint-enable */
};

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
  firestoreConnect(),
  withSnackbar,
  withRouter,
)(AddTeam);
