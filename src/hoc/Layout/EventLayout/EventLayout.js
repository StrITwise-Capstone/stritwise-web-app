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
    index : 0,
  }
  render() {
    const {
      children,
      classes,
      eventname,
      history,
      location,
      userRole,
    } = this.props;
    const { index } = this.state;
    const userType = userRole;
    const eventuid = location.pathname.replace('/events/','').substring(0,20);
    const path = location.pathname.split('/')[location.pathname.split('/').length -1];
   
    return (
      <Grid container>
        <Grid item xs={10}>
        {children}
        </Grid>
        <Grid item xs={2}>
            { userType === 'admin' &&
              (
                <div style={{'display':'inline-block','paddingTop':'35%'}}>
                  <Typography component="p">
                      {eventname}
                  </Typography>
                  <ListItem 
                    classes={{ selected: classes.selected }} 
                    selected={path === "overview"} 
                    onClick={()=>{history.push(`/events/${eventuid}/overview`); this.setState({index : 0})}}
                    >
                    <Typography component="p" style={{color:'inherit',fontWeight:'inherit'}}>
                      Overview
                    </Typography>
                  </ListItem>
                  <ListItem 
                    classes={{ selected: classes.selected }} 
                    selected={path === "teams"} 
                    onClick={()=>{history.push(`/events/${eventuid}/teams`); this.setState({index : 1})}}
                  >
                    <Typography component="p" style={{color:'inherit',fontWeight:'inherit'}}>
                      Teams
                    </Typography>
                  </ListItem>
                  <ListItem 
                    classes={{ selected: classes.selected }} 
                    selected={path === "volunteers"} 
                    onClick={()=>{history.push(`/events/${eventuid}/volunteers`); this.setState({index : 3})}}
                  >
                    <Typography component="p" style={{color:'inherit',fontWeight:'inherit'}}>
                      Volunteers
                    </Typography>
                  </ListItem>
                </div>
              )
            }
            { userType === 'teacher' &&
              (
                <div style={{'display':'inline-block','paddingTop':'35%'}}>
                  <Typography component="p">
                      {eventname}
                  </Typography>
                  <ListItem 
                    classes={{ selected: classes.selected }} 
                    selected={path === "overview"} 
                    onClick={()=>{history.push(`/events/${eventuid}/overview`); this.setState({index : 0})}}
                    >
                    <Typography component="p" style={{color:'inherit',fontWeight:'inherit'}}>
                      Overview
                    </Typography>
                  </ListItem>
                  <ListItem 
                    classes={{ selected: classes.selected }} 
                    selected={path === "teams"} 
                    onClick={()=>{history.push(`/events/${eventuid}/teams`); this.setState({index : 1})}}
                  >
                    <Typography component="p" style={{color:'inherit',fontWeight:'inherit'}}>
                      Teams
                    </Typography>
                  </ListItem>
                  <ListItem 
                    classes={{ selected: classes.selected }} 
                    selected={path === "create"} 
                    onClick={()=>{history.push(`/events/${eventuid}/teams/create`); this.setState({index : 2})}}
                  >
                    <Typography component="p" style={{color:'inherit',fontWeight:'inherit'}}>
                      Register
                    </Typography>
                  </ListItem>
                </div>
              )
            }
        </Grid>
      </Grid>
    );
  }
}

EventLayout.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  action: PropTypes.element,
  /* eslint-disable react/forbid-prop-types */
  children: PropTypes.any.isRequired,
  classes: PropTypes.any.isRequired,
  /* eslint-enable */
};

EventLayout.defaultProps = {
  title: null,
  subtitle: null,
  action: null,
};

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    userRole: state.auth.userRole,
    isAuthenticated: state.auth.isAuthenticated,
    user: state.firestore.data.user,
  };
};

export default compose(withRouter,withStyles(styles),connect(mapStateToProps))(EventLayout);
