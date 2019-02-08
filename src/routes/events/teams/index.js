import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  withStyles,
  CircularProgress,
  Button,
} from '@material-ui/core';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import {
  firestoreConnect,
  firebaseConnect,
} from 'react-redux-firebase';
import { withSnackbar } from 'notistack';
import { Link } from 'react-router-dom';

import CardList from './TeamsUI/CardList/CardList';
import AdminLayout from '../../../hoc/Layout/AdminLayout';
import Dialog from './ImportButton/Dialog';
import urlForDownloads from '../../../config/urlForDownloads';

const styles = () => ({
  button: {
    backgroundColor: '#7b1fa2',
    color: 'white',
    float: 'right',
  },
  p: {
    paddingTop: '10px',
  },
  gridItem: {
    paddingTop: '20px',
  },
  paper: {
    marginLeft: '20px',
    paddingLeft: '15px',
    paddingRight: '15px',
  },
});

/**
 * Class representing the ViewTeams component.
*/
class ViewTeams extends Component {
  state = {
    isLoading: true,
    schools: null,
    event: null,
  };

  componentDidMount() {
    this.getSchools();
    this.getEvent();
    this.getTeams();
  }

  /**
   * Get the current event
   */
  getEvent = () => {
    const { firestore, match } = this.props;
    this.setState({ isLoading: true });
    firestore.collection('events').doc(`${match.params.eventId}`).get().then((doc) => {
      this.setState({ event: doc.data(), isLoading: false });
    });
  }

  /**
 * Get all the teams
 */
  getTeams = () => {
    const { firestore, match } = this.props;
    this.setState({ isLoading: true });
    firestore.collection('events').doc(match.params.eventId).collection('teams').get().then((querySnapshot) => {
      const teams = [];
      querySnapshot.forEach((doc) => {
        teams.push(
          doc.data().team_name,
        );
      });
      this.setState({ teams , isLoading: false });
    }).catch((error) => {
      console.log(error);
    });
  }

  /**
   * Get all the schools
   */
  getSchools = () => {
    const { firestore } = this.props;
    this.setState({ isLoading: true });
    firestore.collection('schools').get().then((querySnapshot) => {
      const schools = [];
      querySnapshot.forEach((doc) => {
        schools.push({
          label: doc.data().name,
          value: doc.id,
        });
      });
      this.setState({ schools, isLoading: false });
    }).catch((error) => {
      console.log(error);
    });
  }

  /**
   * Reroute to page to create team
   */
  createTeam = () => {
    const { history, match } = this.props;
    history.push(`/events/${match.params.eventId}/teams/create`);
  }

  /**
   * Update the page
   */
  updatePage = () => {
    this.setState({ isLoading: true });
    this.setState({ isLoading: false });
  }

  render() {
    const {
      user,
      auth,
      match,
    } = this.props;
    const { isLoading, schools, event, teams } = this.state;
    let teacherId = '';
    let schoolId = '';
    if (user && user.type === 'teacher') {
      teacherId = auth.uid;
      schoolId = user.school_id;
    }
    return (
      <React.Fragment>
        <AdminLayout
          title="Teams"
          action={
          (
            <div style={{ display: 'flex' }}>
              <Button
                type="button"
                variant="contained"
                color="secondary"
                component={Link}
                to={`/events/${match.params.eventId}/teams/create`}
              >
              Create
              </Button>
              <Button
                type="button"
                variant="contained"
                color="secondary"
                href={urlForDownloads.teamsTemplate}
              >
              Download Template
              </Button>
              <Dialog
                updatePage={() => { this.updatePage(); }}
                schools={schools}
                eventId={match.params.eventId}
                teacherId={teacherId}
                schoolId={schoolId}
                teams={teams}
              />
            </div>)}
        >
          {isLoading
            && <CircularProgress />
          }
          {!isLoading
            && (
            <CardList
              schools={schools}
              eventId={match.params.eventId}
              event={event}
              teacherId={teacherId}
            />)}
        </AdminLayout>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    isAuthenticated: state.auth.isAuthenticated,
    user: state.firestore.data.user,
  }
};

ViewTeams.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  match: PropTypes.any.isRequired,
  user: PropTypes.any.isRequired,
  auth: PropTypes.any.isRequired,
  history: PropTypes.any.isRequired,
  firestore: PropTypes.any.isRequired,
  /* eslint-enable */
};

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
  firestoreConnect(props => [
    {
      collection: 'users',
      storeAs: 'user',
      doc: `${props.auth.uid}`,
    },
  ]),
  firebaseConnect(),
  withSnackbar,
  withRouter,
)(ViewTeams);
