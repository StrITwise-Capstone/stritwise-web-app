import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  MenuItem,
  Menu
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase'
import { withRouter } from 'react-router';

import DrawerList from './Drawer/DrawerList'
import { logIn, logOut, retrieveUser } from '../../../store/actions/authActions';
import RouteButton from './Drawer/RouteButton/RouteButton'

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class Navbar extends Component {
  state = {
    auth: true,
    anchorEl: null,
    isDrawerOpen: false,
  };

  handleChange = event => {
    this.setState({ auth: event.target.checked });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  componentDidMount(){
    this.props.retrieveUser(this.props.auth.uid);
  }

  componentDidUpdate(){
    this.props.retrieveUser(this.props.auth.uid);
  }

  render() {
    const { classes, userRole, isAuthenticated} = this.props;
    const { anchorEl, isDrawerOpen} = this.state;
    const open = Boolean(this.state.anchorEl);

    return (
      <AppBar position="static">
          <Toolbar>
            {isAuthenticated && (
            <div>
              <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.toggleDrawer('isDrawerOpen', true)}>
              <MenuIcon />
            </IconButton>
            <SwipeableDrawer
              open={isDrawerOpen}
              onClose={this.toggleDrawer('isDrawerOpen', false)}
              onOpen={this.toggleDrawer('isDrawerOpen', true)}
            >
              <DrawerList auth={userRole}/>
            </SwipeableDrawer>
            </div>
            )
            }
            <Typography variant="h6" color="inherit" className={classes.grow}>
              <img src="/assets/logo.gif" alt="StrITwise Web Application" style={{ height: '50px',}} />
            </Typography>
            {isAuthenticated && (
              <div>
                <IconButton
                  aria-owns={open ? 'menu-appbar' : null}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={this.handleClose}
                >
                  <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                  <MenuItem onClick={this.handleClose}>My account</MenuItem>
                  <MenuItem onClick={this.props.logOut}>Log Out</MenuItem>
                </Menu>
              </div>
            )}
            {isAuthenticated === false && (
              <div>
                <RouteButton route="Sign Up" routelink="auth/signup" />
                <RouteButton route="Log In" routelink="auth/login" />
              </div>
            )}
          </Toolbar>
        </AppBar>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    authError: state.auth.authError,
    auth: state.firebase.auth,
    users: state.firestore.data.users,
    userRole: state.auth.userRole,
    isAuthenticated: state.auth.isAuthenticated,
    eventsList: state.firestore.data.events,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logIn: (creds) => dispatch(logIn(creds)),
    logOut: () => dispatch(logOut()),
    retrieveUser: (user) => dispatch(retrieveUser(user)),
  };
};

export default withRouter(compose(
  connect(mapStateToProps,mapDispatchToProps),
  firestoreConnect([
    {
    collection: 'users'},
    {
      collection:'events'
    }
  ])
)(withStyles(styles)(Navbar)));
