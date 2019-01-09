import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  withStyles,
  Grid,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Paper,
  CircularProgress,
} from '@material-ui/core';
import { compose } from 'redux';
import { Star } from '@material-ui/icons/';
import { withRouter } from 'react-router';
import {
  firestoreConnect,
  firebaseConnect,
} from 'react-redux-firebase';
import { withSnackbar } from 'notistack';

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: '#FFD700',
  },
  content: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
  },
  icons: {
    marginRight: '0px',
    marginLeft: 'auto',
  },
  toolbar: theme.mixins.toolbar,
  divContent: {
    width: '100vw',
    flexGrow: 1,
    backgroundColor: '#EFDECE',
  },
  divBlock: {
    backgroundColor: 'white',
    margin: '2em',
    maxWidth: '80vw',
    width: '80vw',
    display: 'flex',
  },
  paper: {
    backgroundColor: 'white',
    display: 'flex',
    width: '100%',
  },
  rankingBlock: {
    width: '25%',
    padding: '2em',
  },
  rankingContent: {
    color: 'black',
    width: '75%',
    padding: '4em',
  },
});


class PointSystem extends Component {
  state= {
    isNotLoading: false,
  }

  getData = () => {
    const { rankings } = this.props;
    const { isNotLoading } = this.state;
    var array = [];
    if (rankings) {
      console.log(rankings);
      if ( isNotLoading === false ) {
        this.setState({ isNotLoading: true });
      }
      Object.keys(rankings).map((teamIndex) => {
        array.push([rankings[teamIndex].team_name, rankings[teamIndex].credit]);
        return null;
      });
      array.sort((a, b) => {
        return b[1] - a[1];
      });
    }
    return array;
  }

  render() {
    const { classes } = this.props;
    const { isNotLoading } = this.state;
    const rankingsList = this.getData();
    return (
      <div>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton color="inherit">
              <Star />
            </IconButton>
            <div className={classes.icons}>
              <Typography
                style={{ fontWeight: '500' }}
                variant="h5"
                color="inherit"
                className={classes.grow}
              >
                LEADERBOARD
              </Typography>
            </div>
          </Toolbar>
        </AppBar>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {isNotLoading === false && (
            <CircularProgress />)
          }
          {isNotLoading && (
          <Grid
            container
            spacing={12}
            direction="column"
            justify="center"
            alignItems="center"
            className={classes.divContent}
          >
            <Grid item xs={4} className={classes.divBlock}>
              <Paper className={classes.paper}>
                <div className={classes.rankingBlock} style={{ backgroundColor: '#FFD700' }}>
                  <Typography
                    component="h1"
                    variant="h1"
                    style={{
                      textAlign: 'center',
                      lineHeight: 'normal',
                      color: 'white',
                      fontWeight: '450'}}
                  >
                    1st
                  </Typography>
                </div>
                <div className={classes.rankingContent}>
                  <div style={{ display: 'inline-block', float: 'left' }}>
                    <Typography component="h4" variant="h4" style={{lineHeight: 'normal', color:'#9B9CA6'}}>
                      {rankingsList != null && rankingsList[0][0]}
                    </Typography>
                  </div>
                  <div style={{ display: 'inline-block', float: 'right' }}>
                    <Typography component="h4" variant="h4" style={{ lineHeight: 'normal'}}>
                      {rankingsList != null && rankingsList[0][1]} pts
                    </Typography>
                  </div>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={4} className={classes.divBlock}>
              <Paper className={classes.paper}>
                <div className={classes.rankingBlock} style={{ backgroundColor: '#EFEFEF' }}>
                  <Typography
                    component="h1"
                    variant="h1"
                    style={{
                      textAlign: 'center',
                      lineHeight: 'normal',
                      color: 'white',
                      fontWeight: '450',
                    }}
                  >
                  2nd
                  </Typography>
                </div>
                <div className={classes.rankingContent}>
                  <div style={{ display: 'inline-block', float: 'left' }}>
                    <Typography component="h4" variant="h4" style={{lineHeight: 'normal', color:'#9B9CA6'}}>
                      {rankingsList != null && rankingsList[1][0]}
                    </Typography>
                  </div>
                  <div style={{ display: 'inline-block', float: 'right' }}>
                    <Typography component="h4" variant="h4" style={{ lineHeight: 'normal'}}>
                      {rankingsList != null && rankingsList[1][1]} pts
                    </Typography>
                  </div>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={4} className={classes.divBlock}>
              <Paper className={classes.paper}>
                <div className={classes.rankingBlock} style={{ backgroundColor: '#C57252' }}>
                  <Typography
                    component="h1"
                    variant="h1"
                    style={{
                      textAlign: 'center',
                      lineHeight: 'normal',
                      color: 'white',
                      fontWeight: '450',
                    }}
                  >
                   3rd
                  </Typography>
                </div>
                <div className={classes.rankingContent}>
                  <div style={{ display: 'inline-block', float: 'left' }}>
                    <Typography component="h4" variant="h4" style={{lineHeight: 'normal', color:'#9B9CA6'}}>
                      {rankingsList != null && rankingsList[2][0]}
                    </Typography>
                  </div>
                  <div style={{ display: 'inline-block', float: 'right' }}>
                    <Typography component="h4" variant="h4" style={{ lineHeight: 'normal'}}>
                      {rankingsList != null && rankingsList[2][1]} pts
                    </Typography>
                  </div>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={4} className={classes.divBlock}>
              <Paper className={classes.paper}>
                <div className={classes.rankingBlock} style={{ backgroundColor: '#8B4513' }}>
                  <Typography
                    component="h1"
                    variant="h1"
                    style={{
                      textAlign: 'center',
                      lineHeight: 'normal',
                      color: 'white',
                      fontWeight: '450',
                    }}
                  >
                    4th
                  </Typography>
                </div>
                <div className={classes.rankingContent}>
                  <div style={{ display: 'inline-block', float: 'left' }}>
                    <Typography component="h4" variant="h4" style={{ lineHeight: 'normal', color: '#9B9CA6'}}>
                      {rankingsList != null && rankingsList[3][0]}
                    </Typography>
                  </div>
                  <div style={{ display: 'inline-block', float: 'right' }}>
                    <Typography component="h4" variant="h4" style={{ lineHeight: 'normal'}}>
                      {rankingsList != null && rankingsList[3][1]} pts
                    </Typography>
                  </div>
                </div>
              </Paper>
            </Grid>
          </Grid>)}
        </main>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    currentevent: state.firestore.data.currentevent,
    auth: state.firebase.auth,
    isAuthenticated: state.auth.isAuthenticated,
    user: state.firestore.data.user,
    rankings: state.firestore.data.rankings,
  }
};

export default compose(
  connect(mapStateToProps),
  withRouter,
  withStyles(styles),
  firestoreConnect(props => [
    {
      collection: 'events',
      doc: `${props.location.pathname.replace('/events/','').replace('/pointsystem','')}`,
      storeAs: 'currentevent',
    },
    {
      collection: 'users',
      storeAs: 'user',
      doc: `${props.auth.uid}`,
    },
    {
      collection: 'events',
      doc: `${props.location.pathname.replace('/events/', '').replace('/pointsystem', '')}`,
      subcollections: [{ collection: 'teams' }],
      storeAs: 'rankings',
    },
  ]),
  firebaseConnect(),
  withSnackbar,
)(PointSystem);
