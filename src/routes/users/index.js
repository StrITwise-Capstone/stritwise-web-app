import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import {
  Grid,
  Button,
} from '@material-ui/core';

import CustomTable from '../../components/UI/Table/Table';

class Users extends Component {

  state = {
    page: 0,
    rowsPerPage: 5,
  }

  // if (!auth.uid) return <Redirect to="/auth/login" />
  handleEdit = (userID) => {
    this.props.history.push(`/users/${userID}/edit`);
  }

  handleDelete = (userID) => {
    const { firestore } = this.props;
    firestore.collection('users').doc(userID).delete().then(() => {
      console.log("Document successfully deleted!");
    }).catch((error) => {
      console.error("Error removing document: ", error);
    });
  }

  getSchoolName = (schools, user) => {
    if (schools) {
      const currentSchool = schools.find(schoolElement => (schoolElement.id === user.school_id));
      if (currentSchool) {
        return currentSchool.name;
      }
      return 'N.A.';
    }
    return 'Loading...';
  }

  createTable = (users, schools) => {
    let data = [];
    if (users && schools) {
      const toUserData = user => ({
        id: user.id,
        Name: `${user.firstName} ${user.lastName}`,
        Mobile: user.mobile,
        Type: user.type,
        School: this.getSchoolName(schools, user),
      });
      data = users.map(toUserData);
    }
    return data;
  }

  render() {
    const { users, auth, schools } = this.props;
    // console.log(this.props);
    const data = this.createTable(users, schools);
    return (
      <Grid
        container
        spacing={16}
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Grid item xs={8}>
          <CustomTable
            title="Users"
            dataHeader={['Name', 'Mobile', 'Type', 'School']}
            data={data}
            handleEdit={this.handleEdit}
            handleDelete={this.handleDelete}
          >
            <div>
              <Button 
                variant="contained"
                size="small"
                color="primary"
                component={Link}
                to="/users/create"
                style={{ display: 'inline-block' }}
              >
                Add User
              </Button>
              <Button variant="contained" size="small" color="primary" href="/gifts" style={{ display: 'inline-block' }}>
                Gift User
              </Button>
            </div>
          </CustomTable>
        </Grid>
      </Grid>
  
    );
  }
};

const mapStateToProps = (state) => {
  return {
    users: state.firestore.ordered.users,
    schools: state.firestore.ordered.schools,
    auth: state.firebase.auth,
  };
};


Users.propTypes = {
};

Users.defaultProps = {
};


export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    { collection: 'users' },
    { collection: 'schools' },
  ]),
)(Users);
