import React, { Component } from 'react';
import {
  Button,
  Typography,
  Paper,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase'

import AdminLayout from '../../hoc/Layout/AdminLayout';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

class Layout extends Component {
  state = {
    userSchool : null,
  }

  componentDidMount(){
    const { user, firestore,isAuthenticated } = this.props;
    const callback = (name) => {
      this.setState({ userSchool : name})
    }
    if (isAuthenticated) {
      if (user.type == 'teacher')
      {
        firestore.collection('schools').doc(user.school_id).get().then(function(doc){
          if (doc.exists){
            const name = doc.data().name
            callback(name);
          }
        })
      }
    }
  }
  render() {
    const { isAuthenticated , user , auth } = this.props;
    const { userSchool } = this.state;
    return (
      <AdminLayout
        title="Profile"
      >
        <Paper style={{ minHeight: '1000px' , textAlign:'center'}}>
        <div style={{'position':'center'}}>
          <img src='/assets/profile.png' style={{display: 'block', 'marginLeft':'auto', 'marginRight':'auto','position':'center','paddingTop':'50px'}}></img>
        { isAuthenticated !== true &&  
        (
          <Typography variant="h5" component="h3" style={{'position':'relative'}}>
            User is not logged in. 
          </Typography>
        )}
        { isAuthenticated && user && (user.type == 'admin' || user.type == 'orion member') && 
        (<div>
          <Typography variant="h5" component="h3" style={{'paddingTop':'20px'}}>
            Name : {user.firstName+ ' '+ user.lastName} 
          </Typography>
          <Typography variant="h5" component="h3" style={{'paddingTop':'20px'}}>
            Email : {auth.email} 
          </Typography>
          <Typography variant="h5" component="h3" style={{'paddingTop':'20px'}}>
            Mobile : {user.mobile} 
          </Typography>
          <Typography variant="h5" component="h3" style={{'paddingTop':'20px'}}>
            Role : {capitalizeFirstLetter(user.type)} 
          </Typography>
          </div>
        )}
        { isAuthenticated && user && user.type == 'teacher' && userSchool &&
        (
          <div>
          <Typography variant="h5" component="h3" style={{'paddingTop':'20px'}}>
            Name : {user.firstName+ ' '+ user.lastName} 
          </Typography>
          <Typography variant="h5" component="h3" style={{'paddingTop':'20px'}}>
            Email : {auth.email} 
          </Typography>
          <Typography variant="h5" component="h3" style={{'paddingTop':'20px'}}>
            Mobile : {user.mobile} 
          </Typography>
          <Typography variant="h5" component="h3" style={{'paddingTop':'20px'}}>
            School : {userSchool} 
          </Typography>
          <Typography variant="h5" component="h3" style={{'paddingTop':'20px'}}>
            Role : {capitalizeFirstLetter(user.type)} 
          </Typography>
          </div>
        )}
        </div>
        </Paper>
      </AdminLayout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    isAuthenticated: state.auth.isAuthenticated,
    user: state.firestore.data.user,
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps),
  firestoreConnect(props => [
    {
      collection: 'users',
      storeAs: 'user',
      doc: `${props.auth.uid}`,
    },
  ]),
)(Layout);
