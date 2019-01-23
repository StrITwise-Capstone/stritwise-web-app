import React, { Component } from 'react';
import { withFirestore } from 'react-redux-firebase';
import { withRouter } from 'react-router';
import {
  Typography,
  CircularProgress,
} from '@material-ui/core';
import EditCrewForm from './EditCrewForm';
import AdminLayout from '../../../../hoc/Layout/AdminLayout';

class EditVolunteer extends Component {
  state = {
    volunteer: null,
    volunteerRef: null,
  }

  componentDidMount() {
    const { firestore, match } = this.props;
    const volunteerDocRef = firestore.collection('events').doc(match.params.id).collection('volunteers').doc(match.params.volunteerid);
    volunteerDocRef.get().then((doc) => {
      const volunteer = {
        id: match.params.volunteerid,
        firstName: doc.data().first_name,
        lastName: doc.data().last_name,
        studentNo: doc.data().student_no,
        mobile: doc.data().mobile,
        type: doc.data().type,
        school: doc.data().school,
        email: doc.data().email,
        dietary: doc.data().dietary_restrictions ? doc.data().dietary_restrictions : '',
      };
      this.setState({ volunteer, volunteerRef: volunteerDocRef });
    }).catch((error) => {
      console.log('Error getting document:', error);
    });
  }

  render() {
    let content = <CircularProgress />;
    const { volunteer, volunteerRef } = this.state;
    if (volunteer !== null) {
      content = (
        <AdminLayout
        >
          <Typography variant="h4" id="title">Edit Volunteer</Typography>
          <EditCrewForm volunteer={volunteer} volunteerRef={volunteerRef} />
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

export default withRouter(withFirestore(EditVolunteer));
