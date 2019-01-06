import React, { Component } from 'react';
import {
  withStyles,
  CircularProgress
} from '@material-ui/core';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { withSnackbar } from 'notistack';

import Form from './Form';
import AdminLayout from '../../../../hoc/Layout/AdminLayout';

class editTeam extends Component {
  state = {
    schools: [],
    user: {},
    studentsList: [],
  }

  refreshState = () => {
    const { firestore, match } = this.props;
    const query = firestore.collection('events').doc(match.params.id).collection('students').where('team_id','==',`${match.params.teamid}`)
    query.get().then((querySnapshot)=>{
      const studentsList = [];
      querySnapshot.forEach((doc)=>{
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
        })
      })
      this.setState({ studentsList: studentsList})
    })
  }
  componentDidMount() {
    const { firestore, match } = this.props;
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
    
    const query = firestore.collection('events').doc(match.params.id).collection('students').where('team_id','==',`${match.params.teamid}`)
    query.get().then((querySnapshot)=>{
      const studentsList = [];
      querySnapshot.forEach((doc)=>{
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
        })
      })
      this.setState({ studentsList: studentsList})
    })
  }

  render() {
    const { currentevent, team, students } = this.props;
    const { schools, studentsList } = this.state;
    
    return (
      <AdminLayout
        title="Edit Team"
      >
      {currentevent == null && team == null && schools.length <0 && students == null && studentsList.length< 0 &&
        <CircularProgress/>
      }
      {team && schools.length >0 && students && studentsList.length> 0 &&
      <Form 
        team={team} 
        schools={schools} 
        minStudent={currentevent['min_student'] ? currentevent['min_student'] : 1}
        students={studentsList}
        refreshState={()=>{this.refreshState()}}
      />
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

const mapStateToProps = (state) => {
  return {
      currentevent: state.firestore.data.currentevent,
      isAuthenticated: state.auth.isAuthenticated,
      user: state.firestore.data.user,
      team: state.firestore.data.team,
      students: state.firestore.data.students,
  }
};

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
  firestoreConnect((props) => [
    {
      collection:'events',doc:`${props.match.params.id}`,storeAs:`currentevent`
    },
    {
      collection:'events',doc:`${props.match.params.id}`,subcollections: [{ collection: 'teams', doc:`${props.match.params.teamid}`}] ,storeAs:`team`
    },
    {
      collection:'events',doc:`${props.match.params.id}`,subcollections: [{ collection: 'students', where:['team_id', '==', `${props.match.params.teamid}`]}] ,storeAs:`students`
    },
  ]),
  withSnackbar,
)(editTeam);
