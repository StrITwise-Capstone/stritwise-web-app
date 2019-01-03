import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {
  IconButton,
  MenuItem,
  Menu,
} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { withRouter } from 'react-router';

import DrawerList from './Drawer/DrawerList'
import { logIn, logOut, retrieveUser } from '../../../store/actions/authActions';
import RouteButton from './Drawer/RouteButton/RouteButton'

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
  icons: {
    'marginRight': '0px', 'marginLeft': 'auto'
  },
  toolbar: theme.mixins.toolbar,
});

class Navbar extends Component{
  state = {
    auth: true,
  };

  handleMenu = event =>{
    this.setState({anchorEl: event.currentTarget})
  }
  handleClose = () =>{
    this.setState({anchorEl:null})
  }
  componentDidMount(){
    this.props.retrieveUser(this.props.auth.uid);
  }

  componentDidUpdate(){
    this.props.retrieveUser(this.props.auth.uid);
  }

  render(){
  const { classes, isAuthenticated, user, history } = this.props;
  const { anchorEl } = this.state;
  const open = Boolean(this.state.anchorEl);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
        <Typography variant="h6" color="inherit" className={classes.grow}>
              <img onClick={() => { history.push(`/`); }} src="/assets/logo.gif" alt="StrITwise Web Application" style={{ height: '50px',}} />
            </Typography>
            {isAuthenticated && (
              <div className={classes.icons}>
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
                  <MenuItem onClick={()=>{history.push('/profile')}}>Profile</MenuItem>
                  {/* <MenuItem onClick={this.handleClose}>My account</MenuItem> */}
                  <MenuItem onClick={this.props.logOut}>Log Out</MenuItem>
                </Menu>
              </div>
            )}
            {isAuthenticated === false && (
              <div className={classes.icons}>
                <RouteButton route="Sign Up" routelink="auth/signup" />
                <RouteButton route="Log In" routelink="auth/login" />
              </div>
            )}
        </Toolbar>
      </AppBar>
      {isAuthenticated &&<Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolbar} />
        {user && <DrawerList auth={user.type}/>}
        
      </Drawer>
      }
    </div>
  );
}
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    userRole: state.auth.userRole,
    isAuthenticated: state.auth.isAuthenticated,
    eventsList: state.firestore.data.events,
    user: state.firestore.data.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logIn: (creds) => dispatch(logIn(creds)),
    logOut: () => dispatch(logOut()),
    retrieveUser: (user) => dispatch(retrieveUser(user)),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps,mapDispatchToProps),
  withStyles(styles),
  firestoreConnect(props => [
    {
      collection: 'users',
      storeAs: 'user',
      doc: `${props.auth.uid}`,
    },
  ]),
)(Navbar);

