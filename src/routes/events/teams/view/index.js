import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  withStyles,
  CircularProgress,
  Button,
} from '@material-ui/core';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import {
  firestoreConnect,
  firebaseConnect,
} from 'react-redux-firebase';
import { withSnackbar } from 'notistack';
import { Link } from 'react-router-dom';

import CardList from '../../TeamsUI/CardList/CardList';
import AdminLayout from '../../../../hoc/Layout/AdminLayout';
import Dialog from './ImportButton/Dialog';

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
    this.setState({isNotLoading: false });
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
    history.push(`/events/${match.params.id}/teams/create`);
  }

  refreshState = () => {
    this.forceUpdate();
  }

  render() {
    const {
      user,
      auth,
      currentevent,
      match,
    } = this.props;
    const { isNotLoading, schools } = this.state;
    var teacherId = '';
    if (user && user.type === 'teacher') {
      teacherId = auth.uid;
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
                to={`/events/${match.params.id}/teams/create`}
              >
              Create
              </Button>
              <Dialog
                refreshState={() => { this.refreshState(); }}
                schools={schools}
                eventuid={match.params.id}
                teacherId={teacherId}
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
              eventuid={match.params.id}
              schooluid={user.school_id}
              currentevent={currentevent}
            />)}
        </AdminLayout>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
    return {
      currentevent: state.firestore.data[`currentevent${ownProps.match.params.id}`],
      auth: state.firebase.auth,
      isAuthenticated: state.auth.isAuthenticated,
      user: state.firestore.data.user,
    }
};

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
  firestoreConnect(props => [
    {
      collection: 'events',
      doc: `${props.match.params.id}`,
      storeAs: `currentevent${props.match.params.id}`,
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
