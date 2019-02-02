import React, { Component } from 'react';
import { withFirestore } from 'react-redux-firebase';
import { withRouter } from 'react-router';
import {
  Typography,
  CircularProgress,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import EditCrewForm from './EditCrewForm';
import AdminLayout from '../../../../hoc/Layout/AdminLayout';

class EditVolunteer extends Component {
  state = {
    teams: [],
    volunteer: null,
    volunteerRef: null,
  }

  componentDidMount() {
    const { firestore, match } = this.props;
    firestore.collection('events').doc(match.params.eventId).collection('teams').get().then((querySnapshot) => {
      const teams = [];
      querySnapshot.forEach((doc) => {
        teams.push({
          label: doc.data().team_name,
          value: doc.id,
        });
      });
      this.setState({ teams });
    }).catch((error) => {
      console.log(error);
    });

    const volunteerDocRef = firestore.collection('events').doc(match.params.eventId).collection('volunteers').doc(match.params.volunteerid);
    volunteerDocRef.get().then((doc) => {
      const volunteer = {
        id: match.params.volunteerid,
        firstName: doc.data().first_name,
        lastName: doc.data().last_name,
        studentNo: doc.data().student_no,
        mobile: doc.data().mobile,
        type: doc.data().type,
        team: {
          label: '',
          value: doc.data().team_id,
        },
        school: doc.data().school,
        dietary: doc.data().dietary_restrictions ? doc.data().dietary_restrictions : '',
      };
      this.setState({ volunteer, volunteerRef: volunteerDocRef });
    }).catch((error) => {
      console.log('Error getting document:', error);
    });
  }

  getTeamName = (teams, volunteerTeamId) => {
    if (teams !== null && volunteerTeamId !== null) {
      const currentTeam = teams.find(teamElement => (teamElement.value === volunteerTeamId));
      if (currentTeam) {
        return currentTeam.label;
      }
      return 'N.A. ';
    }
    return 'ErrorLoading';
  }

  render() {
    let content = <CircularProgress />;
    const { volunteer, volunteerRef, teams } = this.state;
    if (teams.length && volunteer !== null) {
      const volunteerTeamId = volunteer.team.value;
      volunteer.team.label = this.getTeamName(teams, volunteerTeamId);
      content = (
        <AdminLayout
        >
          <Typography variant="h4" id="title">Edit Volunteer</Typography>
          <EditCrewForm teams={teams} volunteer={volunteer} volunteerRef={volunteerRef} />
        </AdminLayout>
      );
    }
    return (
      <div>
        {content}
      </div>
    );
  }
}

EditVolunteer.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  firestore: PropTypes.any.isRequired,
  match: PropTypes.any.isRequired,
  /* eslint-enable */
};

export default withRouter(withFirestore(EditVolunteer));
