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

import CardList from '../../TeamsUI/CardList/CardList';
import AdminLayout from '../../../../hoc/Layout/AdminLayout';
import Dialog from './ImportButton/Dialog';
import urlForDownloads from '../../../../config/urlForDownloads';

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

class ViewTeams extends Component {
  state = {
    isNotLoading: true,
    schools: null,
  };

  componentDidMount() {
    const { firestore } = this.props;
    this.setState({ isNotLoading: false });
    firestore.collection('schools').get().then((querySnapshot) => {
      const schools = [];
      querySnapshot.forEach((doc) => {
        schools.push({
          label: doc.data().name,
          value: doc.id,
        });
      });
      this.setState({ schools, isNotLoading: true });
    }).catch((error) => {
      console.log(error);
    });
  }

  createTeam = () => {
    const { history, match } = this.props;
    history.push(`/events/${match.params.eventId}/teams/create`);
  }

  refreshState = () => {
    this.setState({isNotLoading: false});
    this.setState({isNotLoading: true});
  }


  render() {
    const {
      user,
      auth,
      currentevent,
      match,
    } = this.props;
    const { isNotLoading, schools } = this.state;
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
                refreshState={() => { this.refreshState(); }}
                schools={schools}
                eventuid={match.params.eventId}
                teacherId={teacherId}
                schoolId={schoolId}
              />
            </div>)}
        >
          {isNotLoading === false
            && <CircularProgress />
          }
          {isNotLoading && schools && currentevent
            && (
            <CardList
              schools={schools}
              eventuid={match.params.eventId}
              currentevent={currentevent}
              teacherId={teacherId}
            />)}
        </AdminLayout>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentevent: state.firestore.data[`currentevent${ownProps.match.params.eventId}`],
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
  currentevent: PropTypes.any,
  history: PropTypes.any.isRequired,
  /* eslint-enable */
};

ViewTeams.defaultProps = {
  currentevent: null,
};

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
  firestoreConnect(props => [
    {
      collection: 'events',
      doc: `${props.match.params.eventId}`,
      storeAs: `currentevent${props.match.params.eventId}`,
    },
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
