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

/**
 * Class representing the TeamCard component.
 * @param {Object} event - A specific event document
 * @param {teamId} teamId - A string of the team Id
 * @param {Function} updatePage - A function to update the page
 * @param {Boolean} deleteValue - A boolean whether can delete Student or not
*/
class TeamCard extends Component {
  state = {
    studentsList: null,
    isLoading: true,
    team: null,
    schoolsList: null,
    studentsEmail: null,
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
  * Delete the current student
  */
  deleteStudent = () => {
    const {
      firestore,
      teamId,
      match,
      enqueueSnackbar,
    } = this.props;

    const {
      studentsEmail,
    } = this.state;
    /**
     * Delete the student email
    */
    const deleteStudentEmail = (student) => {
      const studentId = student.id;
      return firestore.collection('events').doc(match.params.eventId).collection('students').doc(studentId).get().then((docRef) => {
        const emailOfStudent = docRef.data().email;
        studentsEmail.map((email, index) => {
          if (studentsEmail[index] === emailOfStudent) {
            studentsEmail.splice(index, 1);
            this.setState({studentsEmail});
          }
          return null;
        });
        return firestore.collection('events').doc(match.params.eventId).update({
          students_email: studentsEmail,
        }).then(()=> student);
      });
    };

    const ref = firestore.collection('events').doc(match.params.eventId).collection('students').where('team_id', '==', `${teamId}`);
    ref.get().then((querySnapshot) => {
      if (querySnapshot.empty)
      {
        this.deleteTeam();
      }
      let index = 0;
      querySnapshot.forEach((doc) => {
        deleteStudentEmail(doc).then((doc) => {
          doc.ref.delete().then(() => {
            index += 1;
            if (querySnapshot.size === index )
              this.deleteTeam();
          }).catch(() => {
            enqueueSnackbar('Student Not Deleted', {
              variant: 'error',
            });
          });
        });
      });
    }).catch((doc) => {
      enqueueSnackbar('Team is not deleted', {
        variant: 'error',
      });
    });
  }

  /**
  * Get the current team
  */
  getTeam = () => {
    const { firestore, match, teamId } = this.props;
    this.setState({ isLoading: true });
    firestore.collection('events').doc(match.params.eventId).collection('teams').doc(teamId).get().then((doc) => {
      this.setState({ team: doc.data(), isLoading: false });
    });
  }

  /**
  * Get the students of the current team
  */
  getStudents = () => {
    const { firestore, match, teamId } = this.props;
    this.setState({ isLoading: true });
    const query = firestore.collection('events').doc(match.params.eventId).collection('students').where('team_id', '==', `${teamId}`);
    query.get().then((querySnapshot) => {
      const studentsList = [];
      querySnapshot.forEach((doc) => {
        const currentStudent = doc.data();
        studentsList.push({
          key: doc.id,
          first_name: currentStudent.first_name,
          last_name: currentStudent.last_name,
          mobile: currentStudent.mobile,
          badge: currentStudent.badge,
          email: currentStudent.email,
          dietary_restriction: currentStudent.dietary_restriction,
          remarks: currentStudent.remarks,
          emergency_contact_name: currentStudent.emergency_contacts.name,
          emergency_contact_mobile: currentStudent.emergency_contacts.mobile,
          emergency_contact_relation: currentStudent.emergency_contacts.relation,
          shirt_size: currentStudent.shirt_size,
        });
      });
      this.setState({ studentsList, isLoading: false });
    });
  }

  /**
  * Get all the schools
  */
  getSchools = () => {
    const { firestore } = this.props;
    const schoolsList = [];
    this.setState({ isLoading: true });
    firestore.collection('schools').orderBy('name', 'asc').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        schoolsList[doc.id] = doc.data();
      });
      this.setState({ schoolsList, isLoading: false });
    });
  }

  /**
  * Delete the current team
  */
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

  /**
   * Function to call delete team and delete student function
   */
  deleteTeamAndStudent = () => {
    this.deleteStudent();
  }

  componentDidMount = () => {
    this.getTeam();
    this.getSchools();
    this.getStudents();
    this.getStudentsEmail();
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
        {!isLoading && team && studentsList
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
                          deleteValue={event.min_student
                            ? Object.keys(studentsList).length > event.min_student : true}
                          updatePage={updatePage}
                        />
                      </React.Fragment>
                    ))}
                    {Object.keys(studentsList).length < 1
                      && (
                        <div>
                          <Typography component="p" className={classes.textField}>
                            Student accounts are being generated
                          </Typography>
                          <Typography component="p" className={classes.textField}>
                            Please try again
                          </Typography>
                        </div>
                      )
                    }
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


TeamCard.propTypes = {
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

TeamCard.defaultProps = {
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
)(TeamCard);
