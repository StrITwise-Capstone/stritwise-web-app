import React, { Component } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  Divider,
  Button,
  CircularProgress,
} from '@material-ui/core/';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { withRouter } from 'react-router';
import { withSnackbar } from 'notistack';

import ExpansionPanel from './ExpansionPanel/ExpansionPanel';

const styles = {
  media: {
    // ⚠️ object-fit is not supported by IE 11.
    objectFit: 'cover',
  },
  progress: {
    padding: '30% 45%',
  },
  textField: {
    'word-wrap': 'break-word',
    overflow: 'auto',
    'text-align': 'center',
  },
};

class teamCard extends Component {
  state = {
    studentsList: null,
    isLoading: true,
    team: null,
    schoolsList: null,
  }

  deleteStudent = () => {
    const {
      firestore,
      teamId,
      match,
      enqueueSnackbar,
    } = this.props;
    const ref = firestore.collection('events').doc(match.params.eventId).collection('students').where('team_id', '==', `${teamId}`);
    ref.get().then(querySnapshot => querySnapshot.forEach((doc) => {
      doc.ref.delete().then(() => {
      }).catch(() => {
        enqueueSnackbar('Student Not Deleted', {
          variant: 'error',
        });
      });
    }));
  }

  getTeam = () => {
    const { firestore, match, teamId } = this.props;
    this.setState({ isLoading: true });
    firestore.collection('events').doc(match.params.eventId).collection('teams').doc(teamId).get().then((doc) => {
      this.setState({ team: doc.data(), isLoading: false });
    });
  }

  getStudents = () => {
    const { firestore, match, teamId } = this.props;
    const query = firestore.collection('events').doc(match.params.eventId).collection('students').where('team_id', '==', `${teamId}`);
    query.get().then((querySnapshot) => {
      const studentsList = [];
      querySnapshot.forEach((doc) => {
        const currentStudent = doc.data();
        console.log(currentStudent);
        studentsList.push({
          key: doc.id,
          first_name: currentStudent.first_name,
          last_name: currentStudent.last_name,
          mobile: currentStudent.mobile,
          email: currentStudent.email,
          badge_name: currentStudent.badge_name,
          dietary_restriction: currentStudent.dietary_restriction,
          remarks: currentStudent.remarks,
          emergency_contact_name: currentStudent.emergency_contacts.name,
          emergency_contact_mobile: currentStudent.emergency_contacts.mobile,
          emergency_contact_relation: currentStudent.emergency_contacts.relation,
        });
      });
      this.setState({ studentsList, isLoading: false });
    });
  }

  getSchools = () => {
    const { firestore } = this.props;
    const schoolsList = [];
    this.setState({ isLoading: true });
    firestore.collection('schools').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        schoolsList[doc.id] = doc.data();
      });
      this.setState({ schoolsList , isLoading: false });
    });
  }

  deleteTeam = () => {
    const {
      firestore,
      teamId,
      match,
      enqueueSnackbar,
      updatePage,
    } = this.props;
    firestore.collection('events').doc(match.params.eventId).collection('teams').doc(teamId).delete().then(() => {
      enqueueSnackbar('Team Deleted', {
        variant: 'success',
      });
      updatePage();
    });
  }

  deleteTeamAndStudent = () => {
    this.deleteTeam();
    this.deleteStudent();
  }

  componentDidMount = () => {
    this.getStudents();
    this.getTeam();
    this.getSchools();
  }

  render() {
    const {
      classes,
      event,
      teamId,
      match,
      history,
      updatePage,
    } = this.props;
    const {
      studentsList,
      isLoading,
      team,
      schoolsList,
    } = this.state;
    return (
      <React.Fragment>
        {isLoading
          && (
            <CircularProgress />
          )
        }
        {!isLoading && team
          && (
          <Card>
            <CardContent onClick={this.handleClickOpen}>
              <CardContent>
                <Typography variant="h5" component="h2" className={classes.textField}>
                  {team.team_name}
                </Typography>
                <Typography component="p" className={classes.textField}>
                  {schoolsList && schoolsList[team.school_id].name}
                </Typography>
              </CardContent>
              <Divider />
              <CardContent>
                <List>
                  <div style={{ overflowY: 'auto', maxHeight: '450px' }}>
                    {Object.keys(studentsList).map(student => (
                      <React.Fragment key={student}>
                        <ExpansionPanel
                          student={studentsList[student]}
                          teamId={teamId}
                          deleteValue={event.min_student ? Object.keys(studentsList).length > event.min_student : true}
                          updatePage={updatePage}
                        />
                      </React.Fragment>
                    ))}
                  </div>
                </List>
              </CardContent>
            </CardContent>
            <CardContent>
              <Button
                onClick={() => { history.push(`/events/${match.params.eventId}/teams/${teamId}/edit`); }}
                color="primary"
              >
              Edit
              </Button>
              <Button onClick={this.deleteTeamAndStudent} color="primary">Delete</Button>
            </CardContent>
          </Card>
          )}
      </React.Fragment>
    );
  }
}


teamCard.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  event: PropTypes.shape({}),
  team: PropTypes.shape({}),
  teamId: PropTypes.string,
  student: PropTypes.shape({}),
  /* eslint-disable react/forbid-prop-types */
  classes: PropTypes.any.isRequired,
  firestore: PropTypes.any.isRequired,
  match: PropTypes.any.isRequired,
  history: PropTypes.any.isRequired,
  /* eslint-enable */
};

teamCard.defaultProps = {
  team: null,
  event: null,
  student: null,
  teamId: null,
};

export default compose(
  withRouter,
  firestoreConnect(),
  withStyles(styles),
  withSnackbar,
)(teamCard);
