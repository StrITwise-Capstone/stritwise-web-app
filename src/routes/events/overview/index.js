import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  withStyles,
  Paper,
  CircularProgress,
  Typography,
} from '@material-ui/core';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import {
  firestoreConnect,
  firebaseConnect,
} from 'react-redux-firebase';
import moment from 'moment';
import { withSnackbar } from 'notistack';
import { Link } from 'react-router-dom';

import AdminLayout from '../../../hoc/Layout/AdminLayout';

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
  image: {
    width: '50%',
    height: '40%',
    display: 'block',
    margin: 'auto',
    padding: '1em',
    borderRadius: '25px',
  },
});

class Overview extends Component {
  state = {
    isLoading: true,
    imageFileURL: null,
    event: null,
  };

  componentDidMount() {
    this.getImage();
  }

  getImage = () => {
    const { firebase, firestore, match } = this.props;
    const { imageFileURL } = this.state;
    this.setState({ isLoading: true });
    if (imageFileURL === null) {
      firestore.collection('events').doc(match.params.eventId).get().then((doc)=>{
        firebase.storage().ref(`${doc.data().image_path}`).getDownloadURL().then((imageFileURL) => {
          this.setState({
            imageFileURL,
            isLoading: false,
            event: doc.data(),
          });
        }).catch((error) => {
          console.log(`Unable to retreive${error}`);
        });
      }).catch((error) => {
        console.log(`Unable to retreive${error}`);
      });
    }
  }

  createTeam = () => {
    const { history, match } = this.props;
    history.push(`/events/${match.params.eventId}/teams/create`)
  }

  getActionButtons = () => {
    const { isAuthenticated, user, match } = this.props;
    if (isAuthenticated && (user.type === 'admin' || user.type === 'orion member')) {
      return (
        <React.Fragment>
          <Button
            type="button"
            variant="contained"
            color="secondary"
            component={Link}
            to={`/events/${match.params.eventId}/edit`}
          >
            Edit
          </Button>
          <Button
            type="button"
            variant="contained"
            color="secondary"
            onClick={() => { this.deleteEvent(); }}
          >
            Delete
          </Button>
        </React.Fragment>);
    }
    return null;
  }

  deleteEvent = () => {
    const {
      match,
      firestore,
      history,
      enqueueSnackbar,
    } = this.props;
    const db = firestore;
    this.setState({ isLoading: true });
    db.collection('events').doc(match.params.eventId).delete().then(() => {
      enqueueSnackbar('Deleted Event', {
        variant: 'success',
      });
      history.push('/events');
    }).catch((error) => {
      console.error('Error moving document', error);
      enqueueSnackbar('Deleted Event Error', {
        variant: 'error',
      });
    });
  }

  render() {
    const { classes } = this.props;
    const { imageFileURL, isLoading, event } = this.state;
    return (
      <React.Fragment>
        {isLoading
        && (
          <CircularProgress />
        )}
        {imageFileURL
          && !isLoading
          && (
          <React.Fragment>
            <AdminLayout
              title={event.name}
              action={this.getActionButtons()}
            >
              <Paper>
                <div className={classes.imageDiv}>
                  <img className={classes.image} src={imageFileURL} alt="Event"/>
                </div>
                <div style={{ padding: '1em' }}>
                  <Typography className={classes.p} component="p">{event.desc}</Typography>
                  <Typography className={classes.p} component="p">
                    Start Date:
                    {moment(event.start_date.toDate()).calendar()}
                  </Typography>
                  <Typography className={classes.p} component="p">
                    End Date:
                    {moment(event.end_date.toDate()).calendar()}
                  </Typography>
                </div>
              </Paper>
            </AdminLayout>
          </React.Fragment>)}
      </React.Fragment>);
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    isAuthenticated: state.auth.isAuthenticated,
    user: state.firestore.data.user,
  };
};

Overview.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  /* eslint-disable react/forbid-prop-types */
  firebase: PropTypes.any.isRequired,
  match: PropTypes.any.isRequired,
  firestore: PropTypes.any.isRequired,
  history: PropTypes.any.isRequired,
  user: PropTypes.any.isRequired,
  classes: PropTypes.any.isRequired,
  /* eslint-enable */
};

Overview.defaultProps = {
  isAuthenticated: false,
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
)(Overview);
