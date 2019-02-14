import React, { Component } from 'react';
import {
  CircularProgress,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { withSnackbar } from 'notistack';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import Form from './EditTeamForm';
import AdminLayout from '../../../../hoc/Layout/AdminLayout';

/**
 * Class representing the EditTeam component.
 * @param {Object} user - A specific user document
 */
class EditTeam extends Component {
  state = {
    schools: [],
    studentsList: [],
    isLoading: true,
    event: null,
  }

  componentDidMount() {
    this.getSchools();
    this.getTeam();
    this.getStudents();
    this.getEvent();
    this.getTeams();
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
  * Get the team that is edited
  */
  getTeam = () => {
    const { firestore, match } = this.props;
    this.setState({ isLoading: true });
    firestore.collection('events').doc(match.params.eventId).collection('teams').doc(match.params.teamId).get().then((doc) => {
      this.setState({ team: doc.data(), isLoading: false });
    });
  }

  /**
  * Get all the existing students of the team
  */
  getStudents = () => {
    const { firestore, match } = this.props;
    this.setState({ isLoading: false });
    const query = firestore.collection('events').doc(match.params.eventId).collection('students').where('team_id', '==', `${match.params.teamId}`);
    query.get().then((querySnapshot) => {
      const studentsList = [];
      querySnapshot.forEach((doc) => {
        const student = doc.data();
        studentsList.push({
          key: doc.id,
          first_name: student.first_name,
          last_name: student.last_name,
          email: student.email,
          badge_name: student.badge_name,
          dietary_restriction: student.dietary_restriction,
          remarks: student.remarks,
          emergency_contact_name: student.emergency_contacts.name,
          emergency_contact_mobile: student.emergency_contacts.mobile,
          emergency_contact_relation: student.emergency_contacts.relation,
        });
      });
      this.setState({ studentsList, isLoading: false });
    });
  }

  /**
  * Update page
  */
  updatePage = () => {
    const { firestore, match } = this.props;
    this.setState({ isLoading: true });
    const query = firestore.collection('events').doc(match.params.eventId).collection('students').where('team_id', '==', `${match.params.teamId}`);
    query.get().then((querySnapshot) => {
      const studentsList = [];
      querySnapshot.forEach((doc) => {
        const student = doc.data();
        studentsList.push({
          key: doc.id,
          first_name: student.first_name,
          last_name: student.last_name,
          email: student.email,
          badge_name: student.badge_name,
          dietary_restriction: student.dietary_restriction,
          remarks: student.remarks,
          emergency_contact_name: student.emergency_contacts.name,
          emergency_contact_mobile: student.emergency_contacts.mobile,
          emergency_contact_relation: student.emergency_contacts.relation,
        });
      });
      this.setState({ studentsList, isLoading: false });
    });
  }

  /**
   * Get all the teams
   */
  getTeams = () => {
    const { firestore, match } = this.props;
    this.setState({ isLoading: true });
    firestore.collection('events').doc(match.params.eventId).collection('teams').get().then((querySnapshot) => {
      const teams = [];
      querySnapshot.forEach((doc) => {
        teams.push(
          doc.data().team_name,
        );
      });
      this.setState({ teams, isLoading: false });
    }).catch((error) => {
      console.log(error);
    });
  }


  /**
  * Get the event to edit the team
  */
  getEvent = () => {
    const { firestore, match } = this.props;
    this.setState({ isLoading: true });
    firestore.collection('events').doc(match.params.eventId).get().then((docRef) => {
      this.setState({ event: docRef.data(), isLoading: false });
    });
  }

  /**
  * Get the school name from the ID
  */
  getSchoolName = (schools, userSchoolId) => {
    if (schools !== null && userSchoolId !== null) {
      const currentSchool = schools.find(schoolElement => (schoolElement.value === userSchoolId));
      if (currentSchool) {
        return currentSchool.label;
      }
      return 'N.A. ';
    }
    return 'ErrorLoading';
  }

  render() {
    const {
      schools,
      studentsList,
      team,
      event,
      isLoading,
      teams,
    } = this.state;
    if (schools.length > 1 && team) {
      team.school_name = this.getSchoolName(schools, team.school_id);
    }
    return (
      <AdminLayout
        title="Edit Team"
      >
        { isLoading && event == null
          && team == null && schools.length < 0 && studentsList.length < 0 && (
          <CircularProgress />)
        }
        { !isLoading && event && team && schools.length > 0 && studentsList.length > 0 && (
          <Form
            team={team}
            schools={schools}
            minStudent={event.min_student ? event.min_student : 1}
            maxStudent={event.max_student ? event.max_student : 10}
            students={studentsList}
            teams={teams}
            teamName={team.team_name}
            updatePage={() => { this.updatePage(); }}
          />)
        }
      </AdminLayout>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.firestore.data.user,
});

EditTeam.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  firestore: PropTypes.any.isRequired,
  match: PropTypes.any.isRequired,
  /* eslint-enable */
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect(),
  withSnackbar,
  withRouter,
)(EditTeam);
