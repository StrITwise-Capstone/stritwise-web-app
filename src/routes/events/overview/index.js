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
    isNotLoading: false,
    imageFile: null,
  };

  componentDidMount() {
    this.setState({
      imageFile: null,
      isNotLoading: false,
    })
  }

  componentDidUpdate() {
    const { firebase, currentevent } = this.props;
    const { imageFile } = this.state;
    if (imageFile === null && currentevent) {
      firebase.storage().ref(`${currentevent.image_path}`).getDownloadURL().then((img) => {
        const imageFile = img;
        this.setState({
          imageFile,
          isNotLoading: true,
        });
      }).catch((error) => {
        console.log(`Unable to retreive${error}`);
      });
    }
  }

  createTeam = () => {
    const { history, match } = this.props;
    history.push(`/events/${match.params.id}/teams/create`)
  }

  action = () => {
    const { isAuthenticated, user, match } = this.props;
    if (isAuthenticated && (user.type === 'admin' || user.type === 'orion member')) {
      return (
        <React.Fragment>
          <Button
            type="button"
            variant="contained"
            color="secondary"
            component={Link}
            to={`/events/${match.params.id}/edit`}
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
  }

  deleteEvent = () => {
    const { match, firestore, history, enqueueSnackbar,
    } = this.props;
    const db = firestore;
    this.setState({isNotLoading: false });
    db.collection('events').doc(match.params.id).delete().then(() => {
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
    const { classes, currentevent, } = this.props;
    const { imageFile, isNotLoading, } = this.state;
    return (
      <React.Fragment>
        {isNotLoading === false && 
          <CircularProgress></CircularProgress>
        }
        {currentevent
          && isNotLoading
          && (
          <React.Fragment>
            <AdminLayout
              title={currentevent.name}
              action={this.action()}
            >
              <Paper>
                <div className={classes.imageDiv}>
                  <img className={classes.image} src={imageFile} alt="Event"/>
                </div>
                <div style={{ padding: '1em' }}>
                  <Typography className={classes.p} component="p">{currentevent.desc}</Typography>
                  <Typography className={classes.p} component="p">
                    Start Date:
                    {moment(currentevent.start_date.toDate()).calendar()}
                  </Typography>
                  <Typography className={classes.p} component="p">
                    End Date:
                    {moment(currentevent.end_date.toDate()).calendar()}
                  </Typography>
                </div>
              </Paper>
            </AdminLayout>
          </React.Fragment>)}
      </React.Fragment>);
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

Overview.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  /* eslint-disable react/forbid-prop-types */
  firebase: PropTypes.any.isRequired,
  currentevent: PropTypes.any,
  match: PropTypes.any.isRequired,
  firestore: PropTypes.any.isRequired,
  history: PropTypes.any.isRequired,
  /* eslint-enable */
};

Overview.defaultProps = {
  currentevent: null,
};

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
  firestoreConnect(props => [
    {
      collection: 'events', doc: `${props.match.params.id}`, storeAs: `currentevent${props.match.params.id}`,
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
)(Overview);
