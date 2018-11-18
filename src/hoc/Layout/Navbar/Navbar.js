import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
// import Switch from '@material-ui/core/Switch';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import DrawerList from './Drawer/DrawerList'
import { connect } from 'react-redux';
import { logIn, logOut } from '../../../store/actions/authActions';
import {compose } from 'redux';
import { firestoreConnect} from 'react-redux-firebase'
import RouteButton from './Drawer/RouteButton/RouteButton'
import { withRouter, Router } from 'react-router';

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
    userrole: 'general',
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
    this.setUser();
  }

  componentDidUpdate(prevProps){
    this.setUser(prevProps)
  }

  setUser(prevProps){
    let userrole = 'general'
    if (this.props.users != null && this.props.auth.uid != null){
      userrole = this.props.users[this.props.auth.uid].role;
      console.log(userrole)
      if (userrole !== this.state.userrole)
        this.setState({
          userrole : userrole
        })
    }

    if (this.props.auth.uid == null){
      if (userrole !== 'general')
        this.setState({
          userrole : 'general'
        })
    }

  }

  render() {
    const { classes,auth, users } = this.props;
    const { anchorEl, isDrawerOpen, userrole } = this.state;
    const open = Boolean(this.state.anchorEl);

    return (
      <AppBar position="static">
          <Toolbar>
            {auth.uid && (
            <div>
              <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.toggleDrawer('isDrawerOpen', true)}>
              <MenuIcon />
            </IconButton>
            <SwipeableDrawer
              open={isDrawerOpen}
              onClose={this.toggleDrawer('isDrawerOpen', false)}
              onOpen={this.toggleDrawer('isDrawerOpen', true)}
            >
              <DrawerList auth={userrole}/>
            </SwipeableDrawer>
            </div>
            )
            }
            <Typography variant="h6" color="inherit" className={classes.grow}>
              StritWise Web Application {userrole}
            </Typography>
            {auth.uid == null && (
              <div>
                <RouteButton route="Home" color="inherit" routelink=""></RouteButton>
                <RouteButton route="Sign Up" color="inherit" routelink="signup"></RouteButton>
                <RouteButton route="Log In" color="inherit" routelink="login"></RouteButton>
              </div>
            )

            }
            {auth.uid && (
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
          </Toolbar>
        </AppBar>
    );
  };
}

const mapStateToProps = (state) => {
  console.log(state);
  return {
    authError: state.auth.authError,
    auth: state.firebase.auth,
    users: state.firestore.data.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logIn: (creds) => dispatch(logIn(creds)),
    logOut: () => dispatch(logOut()),
  };
};
export default withRouter(compose(
  connect(mapStateToProps,mapDispatchToProps),
  firestoreConnect([{
    collection: 'users'
  }])
)(withStyles(styles)(Navbar)));
