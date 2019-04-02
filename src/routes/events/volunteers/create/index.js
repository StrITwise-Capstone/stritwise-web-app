import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import { Typography } from '@material-ui/core';
import { withFirestore } from 'react-redux-firebase';

import AddCrewForm from './AddCrewForm';
import AdminLayout from '../../../../hoc/Layout/AdminLayout';

/**
 * Class representing the AddVolunteer component.
 */
class AddVolunteer extends Component {
  state = {
    // List of team documents.
    teams: [],
  }

  /**
   * Populates the team array in the state with all the documents from the teams collection.
   */
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
  }


  render() {
    const { teams } = this.state;
    return (
      <AdminLayout>
        <Typography variant="h4" id="title">Add Volunteer</Typography>
        <AddCrewForm teams={teams} />
      </AdminLayout>
    );
  }
}

AddVolunteer.propTypes = {
  firestore: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
};

export default withSnackbar(withFirestore(AddVolunteer));
