import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
  Button,
  Grid,
  withStyles,
} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase'
import { withSnackbar } from 'notistack';
import { Link } from 'react-router-dom';

import AdminLayout from '../../hoc/Layout/AdminLayout';
import Card from '../../components/UI/Card/Card';


const styles = {
  root:{
    flexGrow: 1,
  }
};


class Dashboard extends Component {

  createEvent = () => {
    const { history } = this.props;
    history.push('/events/create')
  }
  
  action = () => {
    const { isAuthenticated,user } = this.props;
    if (isAuthenticated && (user.type === 'admin' || user.type === 'orion member'))
    {
    return(<React.Fragment>
      <Button
        type="button"
        variant="contained"
        color="secondary"
        component={Link}
        to="/events/create"
      >Create Event</Button>
    </React.Fragment>)
    }
  }

  render() {
    const { eventsList ,classes } = this.props;

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
        >
        {eventsList
          && Object.keys(eventsList).map(eventuid => (
            <Grid item xs={6} key={eventuid}>
              <Card 
              eventuid={eventuid}
              imageSource={eventsList[eventuid].image_path}
              title={eventsList[eventuid].name}
              description={eventsList[eventuid].description}
              start_date={eventsList[eventuid].start_date}
              end_date={eventsList[eventuid].end_date}
              ></Card>
            </Grid>))
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

export default compose(
  withRouter,
  connect(mapStateToProps),
  firestoreConnect(props => [
    {
      collection: 'events',
    }
  ]),
  withSnackbar,
  withStyles(styles)
)(Dashboard);
