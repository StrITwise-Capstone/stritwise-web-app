import React, { Component } from 'react';
import { withFirestore } from 'react-redux-firebase';
import { withRouter } from 'react-router';
import {
  Typography,
  CircularProgress,
  Card,
  CardContent,
} from '@material-ui/core';
import EditTeamPtsForm from './EditTeamPtsForm';
import AdminLayout from '../../../../hoc/Layout/AdminLayout';
import StarIcon from '@material-ui/icons/Stars';

class EditPoints extends Component {
  state = {
    teamRef: null,
    currentPoints: 0,
    teamName: null,
  }

  componentDidMount() {
    const { firestore, match } = this.props;
    const teamRef = firestore.collection('events').doc(match.params.id).collection('teams').doc(match.params.teamid);
    teamRef.get().then((doc) => {
      const currentPoints = doc.data().credit;
      const teamName = doc.data().team_name;
      this.setState({ teamRef, currentPoints, teamName });
    });
  }

  render() {
    let content = <CircularProgress />;
    const { teamRef, currentPoints } = this.state;
    if (teamRef !== null) {
      content = (
        <AdminLayout
        >
          <Typography variant="h4" id="title" style={{paddingBottom: 20}}>Edit Points</Typography>
          <Card>
            <CardContent style={{display: "flex", flexDirection: "column"}}>
              <Typography component="h5" variant="h5">
                Team: Amber
              </Typography>

              <span style={{ display: 'flex', flexDirection: 'row', paddingTop: 10 }}>
                <StarIcon color="secondary" style={{fontSize: 30, display: 'inline-block'}} />
                <p style={{marginTop: 3, paddingLeft: 10}}>Current Points: {currentPoints}</p>
              </span>
            </CardContent>
          </Card>
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
