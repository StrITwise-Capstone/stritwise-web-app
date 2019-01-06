import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
  withStyles,
  CircularProgress,
} from '@material-ui/core';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { 
  firestoreConnect,
  firebaseConnect 
} from 'react-redux-firebase';
import { withSnackbar } from 'notistack';

import CardList from '../../TeamsUI/CardList/CardList';
import AdminLayout from '../../../../hoc/Layout/AdminLayout';
import Dialog from './ImportButton/Dialog';

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

class ViewTeams extends Component {
  state = {
    open: false,
    event: null,
    isNotLoading: true,
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
  refreshState = () =>{
    this.setState({});
  }
  componentDidMount() {
    const { firestore } = this.props;
    this.setState({isNotLoading: false})
    firestore.collection('schools').get().then((querySnapshot) => {
      const schools = [];
      querySnapshot.forEach((doc) => {
      schools.push({
          label: doc.data().name,
          value: doc.id,
        });
      });
      this.setState({ schools, isNotLoading: true});
    }).catch((error) => {
      console.log(error);
      });
  }

  render() {
    const { user,auth } = this.props;
    const { isNotLoading, schools } = this.state;
    var teacherId = '';
    if (user && user.type === 'teacher')
    {
      teacherId = auth.uid;
    }
    return (
      <React.Fragment>
      {isNotLoading === false && 
        <CircularProgress></CircularProgress>
      }
      {isNotLoading === true
        && 
        (<React.Fragment>
          <AdminLayout
            title="Teams"
            action={
            <Dialog 
              refreshState={()=>{this.refreshState()}}
              schools={schools}
              eventuid={this.props.match.params.id}
              teacherId={teacherId}
            />}
          >
          {schools && <CardList schools={schools} eventuid={this.props.match.params.id} schooluid={user.school_id}/>}
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
)(ViewTeams);