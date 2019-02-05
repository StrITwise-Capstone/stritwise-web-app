import React, { Component } from 'react';
import {
  Typography,
  Paper,
  Chip,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { withSnackbar } from 'notistack';

import AdminLayout from '../../hoc/Layout/AdminLayout';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Class representing the Profile component.
 */
class Profile extends Component {
  state = {
    userSchool: null,
  }

  componentDidMount() {
    const { 
      user,
      firestore,
      isAuthenticated,
      history,
      enqueueSnackbar,
    } = this.props;

    const callback = (name) => {
      this.setState({ userSchool: name });
    };

    if (isAuthenticated && user) {
      if (user.type === 'teacher') {
        firestore.collection('schools').doc(user.school_id).get().then((doc) => {
          if (doc.exists) {
            const { name } = doc.data();
            callback(name);
          }
        });
      }
    }

    if (isAuthenticated === false) {
      history.push('/auth/login');
      enqueueSnackbar('User not logged in', {
        variant: 'error',
      });
    }
  }

  render() {
    const { isAuthenticated, user, auth } = this.props;
    const { userSchool } = this.state;
    return (
      <AdminLayout
        title="Profile"
      >
        <Paper style={{
          maxWidth: '50%',
          marginLeft: 'auto',
          marginRight: 'auto',
          textAlign: 'center',
        }}
        >
          <div style={{ padding: '2em' }}>
            { isAuthenticated !== true
            && (
              <Typography variant="h5" component="h3" style={{ position: 'relative' }}>
                User is not logged in.
              </Typography>
            )}
            { isAuthenticated && user && (user.type === 'admin' || user.type === 'orion') 
            && (
            <div>
              <Typography variant="h3" component="h3" style={{ paddingTop: '20px' }}>
                {`${user.firstName} ${user.lastName}`}
              </Typography>
              <Chip
                label={`${capitalizeFirstLetter(user.type)}`}
                color="primary"
                style={{ marginTop: '10px' }}
              />
              <Typography variant="h5" component="h5" style={{ paddingTop:'20px'}}>
                {auth.email}
              </Typography>
              <Typography variant="h5" component="h5" style={{ paddingTop:'20px'}}>
                {user.mobile}
              </Typography>
            </div>
            )}
            { isAuthenticated && user && user.type === 'teacher' && userSchool &&
            (
              <div>
                <Typography variant="h3" component="h3" style={{ paddingTop: '20px'}}>
                  {`${user.firstName} ${user.lastName}`}
                </Typography>
                <Chip
                  label={`${capitalizeFirstLetter(user.type)}`}
                  color="primary"
                  style={{ marginTop: '10px' }}
                />
                <Typography variant="h5" component="h5" style={{ paddingTop: '20px' }}>
                  {userSchool}
                </Typography>
                <Typography variant="h5" component="h5" style={{ paddingTop: '20px' }}>
                  {auth.email}
                </Typography>
                <Typography variant="h5" component="h5" style={{ paddingTop: '20px' }}>
                  {user.mobile}
                </Typography>
              </div>
            )}
          </div>
        </Paper>
      </AdminLayout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    isAuthenticated: state.auth.isAuthenticated,
    user: state.firestore.data.user,
  };
};

Profile.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  /* eslint-disable react/forbid-prop-types */
  auth: PropTypes.any.isRequired,
  user: PropTypes.any.isRequired,
  history: PropTypes.any.isRequired,
  firestore: PropTypes.any.isRequired,
  /* eslint-enable */
};

Profile.defaultProps = {
};

export default compose(
  withRouter,
  connect(mapStateToProps),
  firestoreConnect(props => [
    {
      collection: 'users',
      storeAs: 'user',
      doc: `${props.auth.uid}`,
    },
  ]),
  withSnackbar,
)(Profile);
