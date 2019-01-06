import React, { Component } from 'react';
import { withFirestore } from 'react-redux-firebase';
import { withRouter } from 'react-router';
import {
  Typography,
  CircularProgress,
} from '@material-ui/core';
import EditTeamPtsForm from './EditTeamPtsForm';
import AdminLayout from '../../../../hoc/Layout/AdminLayout';

class EditPoints extends Component {
  state = {
    teamRef: null,
  }

  componentDidMount() {
    const { firestore, match } = this.props;
    console.log(match.params.teamid);
    const teamRef = firestore.collection('events').doc(match.params.id).collection('teams').doc(match.params.teamid);
    this.setState({ teamRef });
  }

  render() {
    let content = <CircularProgress />;
    const { teamRef } = this.state;
    if (teamRef !== null) {
      content = (
        <AdminLayout
        >
          <Typography variant="h4" id="title">Edit Volunteer!</Typography>
          <EditTeamPtsForm teamRef={teamRef} />
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

export default withRouter(withFirestore(EditPoints));
