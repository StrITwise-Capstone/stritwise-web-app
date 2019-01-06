import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  ListItem,
  Typography,
} from '@material-ui/core';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import styles from './EventLayout.styles';

class EventLayout extends Component {
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
    return (
      <div style={{'display':'flex'}}>
        <div style={{'display':'inline-block','width':'80%'}}>
        {children}
        </div>
        <div style={{'display':'inline-block'}}>
            { userType === 'admin' &&
              (
                <div style={{'display':'inline-block','paddingTop':'35%'}}>
                  <Typography component="p">
                      {eventname}
                  </Typography>
                  <ListItem 
                    classes={{ selected: classes.selected }} 
                    selected={index === 0} 
                    onClick={()=>{history.push(`/events/${eventuid}/overview`); this.setState({index : 0})}}
                    >
                    <Typography component="p" style={{color:'inherit'}}>
                      Overview
                    </Typography>
                  </ListItem>
                  <ListItem 
                    classes={{ selected: classes.selected }} 
                    selected={index === 1} 
                    onClick={()=>{history.push(`/events/${eventuid}/teams/view`); this.setState({index : 1})}}
                  >
                    <Typography component="p" style={{color:'inherit'}}>
                      Teams
                    </Typography>
                  </ListItem>
                  <ListItem 
                    classes={{ selected: classes.selected }} 
                    selected={index === 2} 
                    onClick={()=>{history.push(`/events/${eventuid}/teams/create`); this.setState({index : 2})}}
                  >
                    <Typography component="p" style={{color:'inherit'}}>
                      Register
                    </Typography>
                  </ListItem>
                  <ListItem 
                    classes={{ selected: classes.selected }} 
                    selected={index === 3} 
                    onClick={()=>{history.push(`/events/${eventuid}/volunteers`); this.setState({index : 3})}}
                  >
                    <Typography component="p" style={{color:'inherit'}}>
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
                    selected={index === 0} 
                    onClick={()=>{history.push(`/events/${eventuid}/overview`); this.setState({index : 0})}}
                    >
                    <Typography component="p" style={{color:'inherit'}}>
                      Overview
                    </Typography>
                  </ListItem>
                  <ListItem 
                    classes={{ selected: classes.selected }} 
                    selected={index === 1} 
                    onClick={()=>{history.push(`/events/${eventuid}/teams/view`); this.setState({index : 1})}}
                  >
                    <Typography component="p" style={{color:'inherit'}}>
                      Teams
                    </Typography>
                  </ListItem>
                  <ListItem 
                    classes={{ selected: classes.selected }} 
                    selected={index === 2} 
                    onClick={()=>{history.push(`/events/${eventuid}/teams/create`); this.setState({index : 2})}}
                  >
                    <Typography component="p" style={{color:'inherit'}}>
                      Register
                    </Typography>
                  </ListItem>
                </div>
              )
            }
        </div>
      </div>
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
