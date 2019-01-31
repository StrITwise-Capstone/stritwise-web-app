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
import Card from '../../components/UI/Card/Card';


const styles = {
  root: {
    flexGrow: 1,
  }
};


class ViewVolunteers extends Component {
  state = {
    eventsList : null,
    isLoading: true,
  }

  createEvent = () => {
    const { history } = this.props;
    history.push('/events/create');
  }

  componentDidMount = () => {
    const { firestore } = this.props;
    const newEventList = {};
    firestore.collection('events').orderBy("start_date", "desc").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        newEventList[doc.id] = doc.data();
      });
      this.setState({ eventsList: newEventList, isLoading: false });
    });
  }

  action = () => {
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
      </React.Fragment>)
    }
  }

  filterDisplayEvent = (eventsList) => {
    const { isAuthenticated , user } = this.props;
    let result = {}, key;
    if (isAuthenticated && (user.type === 'teacher') && eventsList) {
      const date = new Date();
      for (key in eventsList) {
        if (eventsList[key].end_date.toDate() > date) {
          result[key] = eventsList[key];
        }
      }
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
        title='Events'
        action={this.action()}
      >
        <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="flex-start"
        className={classes.root}
        spacing={8}
        > {isLoading && (
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
  eventsList: PropTypes.any,
  history: PropTypes.any.isRequired,
  user: PropTypes.any.isRequired,
  /* eslint-enable */
};

ViewVolunteers.defaultProps = {
  eventsList: null,
};


export default compose(
  withRouter,
  connect(mapStateToProps),
  firestoreConnect(),
  withSnackbar,
  withStyles(styles),
)(ViewVolunteers);
