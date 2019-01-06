import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
  Button, 
  withStyles,
  Paper,
  CircularProgress,
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
  image:{
    width:'50%',
    height:'40%',
    display:'block',
    margin:'auto',
    padding:'1em',
    borderRadius:'25px'
  },
});

class Overview extends Component {
  state = {
    open: false,
    event: null,
    isNotLoading: false,
    schools : null,
    imageFile: null,
  };
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
    if (imageFile === null && currentevent){
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
  action = () => {
    const { isAuthenticated,user,match } = this.props;
    if (isAuthenticated && (user.type === 'admin' || user.type === 'orion member'))
    {
      
    return(<React.Fragment>
      <Button
        type="button"
        variant="contained"
        color="secondary"
        component={Link}
        to={`/events/${match.params.id}/edit`}
      >Edit
      </Button>
      <Button
        type="button"
        variant="contained"
        color="secondary"
        onClick={()=>{this.deleteEvent()}}
      >Delete</Button>
    </React.Fragment>)
    }
  }

  deleteEvent = () => {
    const { match, firestore, history } = this.props;
    const db = firestore;
    this.setState({isNotLoading:false});
    db.collection('events').doc(match.params.id).delete().then(() => {
      this.props.enqueueSnackbar('Deleted Event', {
        variant: 'success',
      });
      history.push('/events')
    }).catch((error) => {
      console.error('Error moving document', error);
      this.props.enqueueSnackbar('Deleted Event Error', {
        variant: 'error',
      });
    });
  }

  render() {
    const { classes, currentevent,} = this.props;
    const { imageFile, isNotLoading,} = this.state;
    return (
    <React.Fragment>
      {isNotLoading === false && 
        <CircularProgress></CircularProgress>
      }
     {currentevent && isNotLoading &&
      (<React.Fragment>
          <AdminLayout
            title={currentevent.name}
            action={this.action()}
          >
          <Paper>
            <div className={classes.imageDiv}>
            <img className={classes.image} src={imageFile} alt="Event"/>
            </div>
              <div style={{'padding':'1em'}}>
                <Typography className={classes.p} component="p">{currentevent.desc}</Typography>
                <Typography className={classes.p} component="p">Start Date: {moment(currentevent.start_date.toDate()).calendar()}</Typography>
                <Typography className={classes.p} component="p">End Date: {moment(currentevent.end_date.toDate()).calendar()}</Typography>
              </div>
            </Paper>
          </AdminLayout>
      </React.Fragment>)}
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state,ownProps) => {
    return {
      currentevent: state.firestore.data[`currentevent${ownProps.match.params.id}`],
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
      collection:'events',doc:`${props.match.params.id}`,storeAs:`currentevent${props.match.params.id}`
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
)(Overview);