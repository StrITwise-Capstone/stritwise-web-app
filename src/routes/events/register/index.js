import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
  Button, 
  withStyles,
  Paper,
  Divider, 
  CircularProgress,
  Grid,
} from '@material-ui/core';
import { compose } from 'redux';
import { 
  firestoreConnect,
  firebaseConnect 
} from 'react-redux-firebase';
import moment from 'moment';
import AddIcon from '@material-ui/icons/Add';
import { withSnackbar } from 'notistack';

import CardList from '../TeamsUI/CardList/CardList';
import ImportButton from './ImportButton/ImportButton';

const styles = () => ({
  button: {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
  }
});

class Dashboard extends Component {
  state = {
    open: false,
    event: null,
    isNotLoading: false,
  };
  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  createEvent = () => {
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

  render() {
    const { classes, currentevent, user } = this.props;
    const { imageFile, isNotLoading } = this.state;
    
    return (
      <React.Fragment>
      {isNotLoading == false && 
        <CircularProgress></CircularProgress>
      }
      {isNotLoading == true
        && 
        (<React.Fragment>
        <div>
        <Paper>
        <div style={{'marginLeft':'15px'}}>
        <h1>{currentevent && currentevent.name}</h1>
        <Grid container>
          <Grid item xs={6}>
            <div>
              <p>Start Date: {moment(currentevent.start_date.toDate()).calendar()}</p>
              <p>End Date: {moment(currentevent.end_date.toDate()).calendar()}</p>
              <p>Description: </p>
              <p>{currentevent.desc}</p>
            </div>
          </Grid>
          <Grid item xs={6}><img src={imageFile} style={{width:'500px',height:'300px'}} /> </Grid>
        </Grid>
        <Divider/>
        <ImportButton teacherid={this.props.auth.id} updatingStatus={bool => this.setState({isNotLoading:bool})} />
        </div>
        </Paper>
        <Paper style={{background:'#E6E6FA'}}>
        <div style={{'marginLeft':'15px'}}>
        <h1>Teams </h1>
        <div>
        <CardList eventuid={this.props.match.params.id} schooluid={user.school_id}/>
        </div>
        </div>
        </Paper>
        </div>
        <Button variant="fab" color="primary" aria-label="Add" onClick={() => {this.createEvent()}} className={classes.button}>
          <AddIcon />
        </Button>
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
)(Dashboard);