import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  withStyles,
  Grid,
  Typography,
  List,
} from '@material-ui/core';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import {
  firestoreConnect,
  firebaseConnect,
} from 'react-redux-firebase';
import { withSnackbar } from 'notistack';


const styles = theme => ({
  button: {
    backgroundColor: '#7b1fa2',
    color: 'white',
    float: 'right',
  },
  p: {
    paddingTop: '10px',
  },
  gridItem: {
    height: '80%',
    width: '100%',
    position: 'relative',
    margin: '1em',
  },
  paper: {
    marginLeft: '20px',
    paddingLeft: '15px',
    paddingRight: '15px',

  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    color: 'white',
  },
  rankingHeadings: {
    textAlign: 'center',
    color: 'white',
  },
});

class PointSystem extends Component {


  render() {
    const { rankings, classes } = this.props;
    var array=[];
    for (var team in rankings) {
      array.push([rankings[team].team_name, rankings[team].credit]);
    }
    array.sort(function(a, b) {
      return b[1] - a[1];
    });

    return (
      <div style={{ backgroundColor: 'black' }}>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          style={{ height: '500px', alignItems: 'center' }}
        >
          <Grid item xs={3} className={classes.gridItem}>
            <Typography variant="h4" className={classes.rankingHeadings}>{rankings && array[1][0]}</Typography>
            <Typography variant="h5" className={classes.rankingHeadings}>
              {rankings && array[1][1]}
                pts
            </Typography>
            <div style={{
              backgroundColor: 'purple',
              width: '100%',
              height: '50%',
              display: 'inline-block',
              position: 'absolute',
              bottom: '0',
            }}
            >
              <Typography variant="h3" style={{ textAlign: 'center', color: 'white' }}>2</Typography>
            </div>
          </Grid>
          <Grid item xs={3} className={classes.gridItem}>
            <Typography variant="h4" className={classes.rankingHeadings}>{rankings && array[0][0]}</Typography>
            <Typography variant="h5" className={classes.rankingHeadings}>
              {rankings && array[0][1]}
              pts
            </Typography>
            <div style={{
              backgroundColor: 'purple',
              width: '100%',
              height: '80%',
              display: 'inline-block',
              position: 'absolute',
              bottom: '0',
            }}
            >
              <Typography variant="h3" style={{ textAlign: 'center', color: 'white' }}>1</Typography>
            </div>
          </Grid>
          <Grid item xs={3} className={classes.gridItem}>
            <Typography variant="h4" className={classes.rankingHeadings}>{rankings && array[2][0]}</Typography>
            <Typography variant="h5" className={classes.rankingHeadings}>
              {rankings && array[2][1]}
              pts
            </Typography>
            <div style={{ backgroundColor: 'purple', width: '100%', height: '30%', display: 'inline-block', position:'absolute', bottom: '0'
            }}
            >
              <Typography
                variant="h3"
                className={classes.rankingHeadings}
                style={{ color: 'white' }}
              >
              3
              </Typography>
            </div>
          </Grid>
        </Grid>
        <List style={{ textAlign: 'center' }}>
          <Typography
            variant="h5"
          >
          Remaining Teams
          </Typography>
          {rankings
            && (
              <div style={{
                width: '80%',
                height: '30%',
                backgroundColor: 'purple',
                display: 'inline-block',
                margin: '1em',
              }}
              >
                <div style={{ padding: '1em' }}>
                  <Typography
                    variant="h5"
                    className={classes.heading}
                    style={{
                      color: 'white',
                      paddingLeft: '10px',
                      textAlign: 'left',
                    }}
                  >
                    4. 
                    {array[3][0]}
                  </Typography>
                  <Typography
                    component="p"
                    className={classes.heading}
                    style={{ color: 'white', paddingLeft: '10px', textAlign: 'right' }}
                  >
                  Credits:
                    {array[3][1]}
                  pts
                  </Typography>
                </div>
              </div>
            )
          }
        </List>
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
