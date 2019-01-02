import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { 
  Button, 
  withStyles,
  Paper,
  Divider, 
  CircularProgress,
  Grid,
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  List,
} from '@material-ui/core';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { 
  firestoreConnect,
  firebaseConnect 
} from 'react-redux-firebase';
import moment from 'moment';
import { withSnackbar } from 'notistack';

import AdminLayout from '../../../../hoc/Layout/AdminLayout';

const styles = theme => ({
  button: {
    backgroundColor:"#7b1fa2",
    color:"white",
    float:'right',
  },
  p:{
    paddingTop:'10px',
  },
  gridItem:{
    height:'80%',
    width:'100%',
    position:'relative',
    margin:'1em',
  },
  paper:{
    marginLeft:'20px',
    paddingLeft:'15px',
    paddingRight:'15px',

  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    color: "white",
  },
  rankingHeadings:{
    textAlign:'center',
    color:'white',
  }
});

class PointSystem extends Component {
  render() {
    const { currentevent, rankings, classes } = this.props;
    console.log(rankings);
    if (rankings)
    console.log();
    const action = (
      <React.Fragment>
        <Button
          type="button"
          variant="contained"
          color="secondary"
          component={Link}
          to=''
        >
          Back
        </Button>
      </React.Fragment>
    );

    return (
      <AdminLayout
        title={currentevent && `${currentevent.name}`}
        subtitle="Point System"
        action={action}
      >
        <Paper style={{ minHeight: '1000px', paddingTop:'30px'}}>
          <Grid 
            container  
            direction="row"
            justify="center"  
            alignItems="center"
            style={{height:'500px', alignItems:'center',backgroundColor:'black'}}
          >
             <img src='/assets/fireworks.png' style={{position:'absolute', height:'inherit'}}></img>

            <Grid item xs={3} className={classes.gridItem}>
              <Typography variant="h4" className={classes.rankingHeadings}>{rankings && rankings[Object.keys(rankings)[1]].team_name}</Typography>
              <Typography variant="h5" className={classes.rankingHeadings}>{rankings && rankings[Object.keys(rankings)[1]].credit} pts</Typography>
              <div style={{backgroundColor:'purple' ,width: '100%', height:'50%', display:'inline-block',position:'absolute',bottom:'0'}}>
              <Typography variant="h3" style={{'textAlign':'center', 'color':'white'}}>2</Typography>
              </div>
            </Grid>
            <Grid item xs={3} className={classes.gridItem} >
              <Typography variant="h4"  className={classes.rankingHeadings}>{rankings && rankings[Object.keys(rankings)[0]].team_name}</Typography>
              <Typography variant="h5" className={classes.rankingHeadings}>{rankings && rankings[Object.keys(rankings)[0]].credit} pts</Typography>
              <div style={{backgroundColor:'purple' ,width: '100%', height:'80%', display:'inline-block',position:'absolute',bottom:'0'}}>
              <Typography variant="h3" style={{'textAlign':'center', 'color':'white'}}>1</Typography>
              </div>
            </Grid><Grid item xs={3} className={classes.gridItem}>
              <Typography variant="h4" className={classes.rankingHeadings}>{rankings && rankings[Object.keys(rankings)[2]].team_name}</Typography>
              <Typography variant="h5" className={classes.rankingHeadings}>{rankings && rankings[Object.keys(rankings)[2]].credit} pts</Typography>
              <div style={{backgroundColor:'purple' ,width: '100%', height:'30%', display:'inline-block',position:'absolute',bottom:'0'}}>
              <Typography variant="h3" className={classes.rankingHeadings} style={{'color':'white'}}>3</Typography>
              </div>
            </Grid>
          </Grid>
          <List style={{'textAlign':'center'}}>
          <Typography variant="h5">Remaining Teams</Typography>
          {rankings && Object.keys(rankings).length > 3 &&
            Object.keys(rankings).map((key, index) => 
              (
                <div style={{width:'80%', height:'30%', backgroundColor:'purple',display:'inline-block',margin:'1em'}}>
                  <div style={{padding:'1em',display:'inline-block',width:'100%'}}>
                    <Typography variant="h5" className={classes.heading} style={{"color":'white',"paddingLeft":"10px", "textAlign":'left'}}>{index+4}. {rankings[key].team_name}</Typography>
                    <Typography component="p" className={classes.heading} style={{"color":'white',"paddingLeft":"10px", "textAlign":'right'}}>Credits: {rankings[key].credit} pts</Typography>    
                  </div>
                </div>
              )
            )
          }
          </List>
        </Paper>
      </AdminLayout>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    currentevent: state.firestore.data.currentevent,
    auth: state.firebase.auth,
    isAuthenticated: state.auth.isAuthenticated,
    user: state.firestore.data.user,
    rankings : state.firestore.data.rankings,
  }
};

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
  firestoreConnect((props) => [
    {
      collection:'events',doc:`${props.match.params.id}`,storeAs:`currentevent`
    },
    {
      collection: 'users',
      storeAs: 'user',
      doc: `${props.auth.uid}`,
    },
    {
      collection:'events',doc:`${props.match.params.id}`, subcollections: [{ collection: 'teams' , orderBy: ['credit','desc'],}], storeAs:'rankings'
    },
    ]),
  firebaseConnect(),
  withSnackbar,
  withRouter,
)(PointSystem);
