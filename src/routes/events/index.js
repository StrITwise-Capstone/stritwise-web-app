import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
  Button,
  Grid,
  withStyles,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase'
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';

import AdminLayout from '../../hoc/Layout/AdminLayout';
import Card from '../../components/UI/EventCard/EventCard';


const styles = {
  root: {
    flexGrow: 1,
  },
};


class ViewVolunteers extends Component {
  state = {
    eventsList: null,
    isLoading: true,
  }

  componentDidMount = () => {
    this.getEvents();
  }

  getEvents() {
    const { firestore } = this.props;
    const newEventList = {};
    firestore.collection('events').orderBy('start_date', 'desc').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        newEventList[doc.id] = doc.data();
      });
      this.setState({ eventsList: newEventList, isLoading: false });
    });
  }

  createEvent = () => {
    const { history } = this.props;
    history.push('/events/create');
  }

  getActionButtons = () => {
    const { isAuthenticated, user } = this.props;
    if (isAuthenticated && (user.type === 'admin' || user.type === 'orion member')) {
      return (
        <React.Fragment>
          <Button
            type="button"
            variant="contained"
            color="secondary"
            component={Link}
            to="/events/create"
          >
          Create Event
          </Button>
        </React.Fragment>);
    }
    return null;
  }

  filterDisplayEvent = (eventsList) => {
    const { isAuthenticated, user } = this.props;
    let result = {};
    if (isAuthenticated && (user.type === 'teacher') && eventsList) {
      const date = new Date();
      Object.keys(eventsList).map((key) => {
        if (eventsList[key].end_date.toDate() > date) {
          result[key] = eventsList[key];
        }
        return null;
      });
      return result;
    }
    return eventsList;
  }

  render() {
    const { classes } = this.props;
    const { eventsList, isLoading } = this.state;
    const filteredEventsList = this.filterDisplayEvent(eventsList);
    return (
      <AdminLayout
        title="Events"
        action={this.getActionButtons()}
      >
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="flex-start"
          className={classes.root}
          spacing={8}
        >
          {isLoading && (
            <CircularProgress />
          )}
          {filteredEventsList
            && Object.keys(filteredEventsList).map(eventuid => (
              <Grid item xs={6} key={eventuid}>
                <Card
                  eventuid={eventuid}
                  imageSource={filteredEventsList[eventuid].image_path}
                  title={filteredEventsList[eventuid].name}
                  description={filteredEventsList[eventuid].description}
                  start_date={filteredEventsList[eventuid].start_date}
                  end_date={filteredEventsList[eventuid].end_date}
                />
              </Grid>))
          }
          { !filteredEventsList && !isLoading && (
            <Grid item>
              <Typography component="p">There is no data at the moment.</Typography>
            </Grid>
          )
          }
        </Grid>
      </AdminLayout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    eventsList: state.firestore.data.events,
    auth: state.firebase.auth,
    isAuthenticated: state.auth.isAuthenticated,
    user: state.firestore.data.user,
  };
};

ViewVolunteers.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  /* eslint-disable react/forbid-prop-types */
  history: PropTypes.any.isRequired,
  user: PropTypes.any.isRequired,
  firestore: PropTypes.any,
  /* eslint-enable */
};

ViewVolunteers.defaultProps = {
  firestore: null,
};


export default compose(
  withRouter,
  connect(mapStateToProps),
  firestoreConnect(),
  withSnackbar,
  withStyles(styles),
)(ViewVolunteers);
