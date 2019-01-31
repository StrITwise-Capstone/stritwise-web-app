import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { withRouter } from 'react-router-dom';
import {
  Typography,
  ListItem,
} from '@material-ui/core';

class StudentsList extends Component {
  state = {
    studentsList: null,
    isLoading: true,
  }

  componentWillReceiveProps(nextProps) {
    const { teamId } = this.props;
    if (teamId !== null)
      this.retreiveStudents(this.props.teamId);
  }

  retreiveStudents = (teamId) => {
    const { firestore, match } = this.props;
    if (teamId !== '' && teamId != null) {
      firestore.collection('events').doc(match.params.id).collection('students').where('team_id','==',`${teamId}`).get().then((querySnapshot) => {
        const studentsList = [];
        querySnapshot.forEach((doc) => {
          studentsList.push({
            name: doc.data().first_name + ' ' + doc.data().last_name + 'dasfadf',
          });
        });
        this.setState({ studentsList, isLoading: false });
      }).catch((error) => {
        console.log(error);
      });
    }
  }


  render() {
    const { studentsList, isLoading } = this.state;
    return (
      <div style={{height:'300px'}}>
        <div style={{height: '10px'}}></div>
        <Typography>Students in the Team</Typography>
        {!isLoading && 
           Object.keys(studentsList).map((name,index) => 
           { return (
             <ListItem>
               <Typography>{index+ 1} {studentsList[index].name}
               </Typography>
            </ListItem>
           )}
         )
        }
      </div>
    );
  }
}
StudentsList.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  firestore : PropTypes.any,
  match: PropTypes.any,
  /* eslint-enable */
};

StudentsList.defaultProps = {
  firestore: null,
  match: null,
};

export default compose(withRouter, firestoreConnect(),)(StudentsList);
