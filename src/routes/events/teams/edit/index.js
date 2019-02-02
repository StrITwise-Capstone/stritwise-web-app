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

class editTeam extends Component {
  state = {
    schools: [],
    studentsList: [],
  }

  getSchools = () => {
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

  getTeam = () => {
    const { firestore, match } = this.props;
    firestore.collection('events').doc(match.params.eventId).collection('teams').doc(match.params.teamId).get().then((doc) => {
      this.setState({ team: doc.data() });
    });
  }
  
  getStudents = () => {
    const { firestore, match } = this.props;
    const query = firestore.collection('events').doc(match.params.eventId).collection('students').where('team_id', '==', `${match.params.teamId}`);
    query.get().then((querySnapshot) => {
      const studentsList = [];
      querySnapshot.forEach((doc) => {
        const currentstudent = doc.data();
        studentsList.push({
          key: doc.id,
          first_name: currentstudent.first_name,
          last_name: currentstudent.last_name,
          mobile: currentstudent.mobile,
          email: currentstudent.email,
          badge_name: currentstudent.badge_name,
          dietary_restriction: currentstudent.dietary_restriction,
          remarks: currentstudent.remarks,
          emergency_contact_name: currentstudent.emergency_contacts.name,
          emergency_contact_mobile: currentstudent.emergency_contacts.mobile,
          emergency_contact_relation: currentstudent.emergency_contacts.relation,
        });
      });
      this.setState({ studentsList });
    });
  }

  componentDidMount() {
    this.getSchools();
    this.getTeam();
    this.getStudents();
  }

  refreshState = () => {
    const { firestore, match } = this.props;
    const query = firestore.collection('events').doc(match.params.eventId).collection('students').where('team_id', '==', `${match.params.teamId}`)
    query.get().then((querySnapshot) => {
      const studentsList = [];
      querySnapshot.forEach((doc) => {
        const currentstudent = doc.data();
        studentsList.push({
          key: doc.id,
          first_name: currentstudent.first_name,
          last_name: currentstudent.last_name,
          mobile: currentstudent.mobile,
          email: currentstudent.email,
          badge_name: currentstudent.badge_name,
          dietary_restriction: currentstudent.dietary_restriction,
          remarks: currentstudent.remarks,
          emergency_contact_name: currentstudent.emergency_contacts.name,
          emergency_contact_mobile: currentstudent.emergency_contacts.mobile,
          emergency_contact_relation: currentstudent.emergency_contacts.relation,
        });
      });
      this.setState({ studentsList });
    });
  }

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
    const { currentevent } = this.props;
    const { schools, studentsList, team } = this.state;
    if (schools.length > 1 && team) {
      team.school_name = this.getSchoolName(schools, team.school_id);
    }
    return (
      <AdminLayout
        title="Edit Team"
      >
        {currentevent == null && team == null && schools.length < 0 && studentsList.length < 0 && (
          <CircularProgress />)
        }
        {team && schools.length > 0 && studentsList.length > 0 && (
          <Form
            team={team}
            schools={schools}
            minStudent={currentevent.min_student ? currentevent.min_student : 1}
            maxStudent={currentevent.max_student ? currentevent.max_student : 10}
            students={studentsList}
            refreshState={() => { this.refreshState(); }}
          />)
        }
      </AdminLayout>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentevent: state.firestore.data[`currentevent${ownProps.match.params.eventId}`],
    isAuthenticated: state.auth.isAuthenticated,
    user: state.firestore.data.user,
  }
};

editTeam.propTypes = {
  currentevent: PropTypes.string.isRequired,
  /* eslint-disable react/forbid-prop-types */
  firestore: PropTypes.any.isRequired,
  match: PropTypes.any.isRequired,
  /* eslint-enable */
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => [
    {
      collection: 'events',
      doc: `${props.match.params.eventId}`,
      storeAs: `currentevent${props.match.params.eventId}`,
    },
  ]),
  withSnackbar,
  withRouter,
)(editTeam);
