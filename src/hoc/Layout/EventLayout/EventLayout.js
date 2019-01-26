import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  ListItem,
  Typography,
  Grid,
} from '@material-ui/core';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import styles from './EventLayout.styles';

class EventLayout extends Component {
  state = {
  }

  render() {
    const {
      children,
      classes,
      history,
      location,
      userRole,
    } = this.props;
    const userType = userRole;
    const eventuid = location.pathname.replace('/events/','').substring(0, 20);
    const path = location.pathname.split('/')[location.pathname.split('/').length - 1];
    return (
      <Grid container>
        <Grid item xs={10}>
          {children}
        </Grid>
        <Grid item xs={2}>
          { (userType === 'admin' || userType === 'orion') &&
            (
              <div style={{display: 'inline-block', paddingTop: '35%' }}>
                <ListItem
                  classes={{ selected: classes.selected }}
                  selected={path === 'overview'}
                  onClick={() => { history.push(`/events/${eventuid}/overview`); }}
                >
                  <Typography component="p" style={{ color: 'inherit', fontWeight: 'inherit' }}>
                    Overview
                  </Typography>
                </ListItem>
                <ListItem
                  classes={{ selected: classes.selected }}
                  selected={path === 'teams'}
                  onClick={() => { history.push(`/events/${eventuid}/teams`); }}
                >
                  <Typography component="p" style={{ color: 'inherit', fontWeight: 'inherit' }}>
                    Teams
                  </Typography>
                </ListItem>
                <ListItem
                  classes={{ selected: classes.selected }}
                  selected={path === 'volunteers'}
                  onClick={() => { history.push(`/events/${eventuid}/volunteers`); }}
                >
                  <Typography component="p" style={{ color: 'inherit', fontWeight: 'inherit' }}>
                    Volunteers
                  </Typography>
                </ListItem>
                <ListItem
                  classes={{ selected: classes.selected }}
                  selected={path === 'points'} 
                  onClick={() => { history.push(`/events/${eventuid}/points`); }}
                >
                  <Typography component="p" style={{ color: 'inherit', fontWeight: 'inherit' }}>
                    Points
                  </Typography>
                </ListItem>
              </div>
            )
            }
          { userType === 'teacher'
          && (
            <div style={{ display: 'inline-block', paddingTop: '35%' }}>
              <ListItem
                classes={{ selected: classes.selected }}
                selected={path === 'overview'}
                onClick={() => {history.push(`/events/${eventuid}/overview`); }}
                >
                <Typography component="p" style={{ color: 'inherit', fontWeight: 'inherit' }}>
                  Overview
                </Typography>
              </ListItem>
              <ListItem
                classes={{ selected: classes.selected }} 
                selected={path === 'teams'} 
                onClick={() => { history.push(`/events/${eventuid}/teams`);}}
              >
                <Typography component="p" style={{ color: 'inherit', fontWeight: 'inherit'}}>
                  Teams
                </Typography>
              </ListItem>
              <ListItem
                classes={{ selected: classes.selected }} 
                selected={path === 'create'} 
                onClick={() => { history.push(`/events/${eventuid}/teams/create`);}}
              >
                <Typography component="p" style={{ color: 'inherit', fontWeight: 'inherit' }}>
                  Register
                </Typography>
              </ListItem>
            </div>)
          }
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    userRole: state.auth.userRole,
    isAuthenticated: state.auth.isAuthenticated,
    user: state.firestore.data.user,
  };
};

EventLayout.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  children: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  userRole: PropTypes.string,
};

EventLayout.defaultProps = {
  userRole: null,
};

export default compose(withRouter, withStyles(styles), connect(mapStateToProps))(EventLayout);
