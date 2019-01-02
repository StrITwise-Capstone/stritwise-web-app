import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
  Button, 
  withStyles,
  Paper,
  Divider, 
  CircularProgress,
  Grid,
  Typography,
} from '@material-ui/core';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { 
  firestoreConnect,
  firebaseConnect 
} from 'react-redux-firebase';
import moment from 'moment';
import { withSnackbar } from 'notistack';
import { Link } from 'react-router-dom';

import CardList from '../TeamsUI/CardList/CardList';
import ImportButton from './ImportButton/ImportButton';
import AdminLayout from '../../../hoc/Layout/AdminLayout';

const styles = () => ({
  button: {
    backgroundColor:"#7b1fa2",
    color:"white",
    float:'right',
  },
  p:{
    paddingTop:'10px',
  },
  gridItem:{
    paddingTop:'20px'
  },
  paper:{
    marginLeft:'20px',
    paddingLeft:'15px',
    paddingRight:'15px',

  },
});

class Dashboard extends Component {
  state = {
    open: false,
    event: null,
    isNotLoading: false,
    schools : null,
  };

  action = () => {
    const { isAuthenticated,user, match } = this.props;
    // if (isAuthenticated)
    // {
      
    return(<React.Fragment>
      <Button
        type="button"
        variant="contained"
        color="secondary"
        component={Link}
        to={`/events/${match.params.id}/pointsystem`}
      >Point System</Button>
    </React.Fragment>)
    //}
  }
  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  createTeam = () => {
    const { history, match } = this.props;
    history.push(`/events/${match.params.id}/teams/create`)
  }
  componentDidUpdate(){
    const { firebase, currentevent } = this.props;
    const { imageFile } = this.state;
    if (imageFile == null && currentevent){
    firebase.storage().ref(`${currentevent.image_path}`).getDownloadURL().then((img) => {
      const imageFile = img;
      this.setState({
        imageFile,
        isNotLoading: true,
      });
    }).catch((error) => {
      console.log(`Unable to retreive${error}`);
    });
    }
  }

  componentDidMount() {
    const { firestore } = this.props;
    
    firestore.collection('schools').get().then((querySnapshot) => {
      const schools = [];
      querySnapshot.forEach((doc) => {
      schools.push({
          label: doc.data().name,
          value: doc.id,
        });
      });
      this.setState({ schools });
    }).catch((error) => {
      console.log(error);
      });
  }

  render() {
    const { classes, currentevent, user } = this.props;
    const { imageFile, isNotLoading, schools } = this.state;
    
    return (
      <React.Fragment>
      {isNotLoading == false && 
        <CircularProgress></CircularProgress>
      }
      {isNotLoading == true
        && 
        (<React.Fragment>
          <AdminLayout
            title={currentevent.name}
            action={this.action()}
          >
            <Paper className={classes.paper}>
              <Grid container >
                <Grid item xs={6} className={classes.gridItem}>
                  <div>
                    <Typography className={classes.p} component="p">Start Date: {moment(currentevent.start_date.toDate()).calendar()}</Typography>
                    <Typography className={classes.p} component="p">End Date: {moment(currentevent.end_date.toDate()).calendar()}</Typography>
                    <Typography className={classes.p} component="p">Description: </Typography>
                    <Typography className={classes.p} component="p">{currentevent.desc}</Typography>
                  </div>
                </Grid>
                <Grid item xs={6} className={classes.gridItem}><img src={imageFile} style={{maxWidth:'100%', 'maxHeight':'100%'}} /> </Grid>
              </Grid>
              <Divider/>
              {schools && <ImportButton schools={schools} eventuid={this.props.match.params.id} teacherid={this.props.auth.id} updatingStatus={bool => this.setState({isNotLoading:bool})} />}
            </Paper>
            <div style={{height:'20px'}}></div>
            <Paper className={classes.paper} style={{background:'#E6E6FA'}}>
            <Typography variant="h5" component="h1">Teams  
              <Button size="small" onClick={() => {this.createTeam()}} className={classes.button}>
                Create Teams
              </Button>
            </Typography>
            {schools && <CardList schools={schools} eventuid={this.props.match.params.id} schooluid={user.school_id}/>}
            </Paper>
          </AdminLayout>
      </React.Fragment>)
    }
    </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
    return {
      currentevent: state.firestore.data.currentevent,
      auth: state.firebase.auth,
      isAuthenticated: state.auth.isAuthenticated,
      user: state.firestore.data.user,
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
    ]),
  firebaseConnect(),
  withSnackbar,
  withRouter,
)(Dashboard);