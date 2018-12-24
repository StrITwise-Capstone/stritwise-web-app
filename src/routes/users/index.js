import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import {
  Grid,
  Button,
  CircularProgress,
} from '@material-ui/core';

import CustomTable from '../../components/UI/Table/Table';

class Users extends Component {

  state = {
    userList: [],
    size: 0,
    page: 0,
    rowsPerPage: 5,
    lastVisible: null,
    firstVisible: null,
  }

  componentWillMount = () => {
    const { firestore } = this.props;
    firestore.collection('users').get().then((snap) => {
      const size = snap.size; // will return the collection size
      this.setState({ size }); 
    });

    this.getData();
  }

  getData = () => {
    const { firestore, schools } = this.props;
    const { rowsPerPage } = this.state;
    const first = firestore.collection('users')
      .orderBy('firstName')
      .limit(rowsPerPage);
    const userList = [];

    first.get().then((documentSnapshot) => {
      // Get the last visible document
      const lastVisible = documentSnapshot.docs[documentSnapshot.docs.length - 1];
      documentSnapshot.forEach((doc) => {
        userList.push({
          uid: doc.id,
          data: doc.data(),
        });
      });
      //const rowsUserList = this.createRows(userList, schools);
      this.setState({ userList, lastVisible });
    });
  }

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value }, () => {
      this.getData();
    });
  };

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

  getSchoolName = (schools, userSchoolId) => {
    if (schools) {
      const currentSchool = schools.find(schoolElement => (schoolElement.id === userSchoolId));
      if (currentSchool) {
        return currentSchool.name;
      }
      return 'N.A.';
    }
    return 'Loading...';
  }

  createRows = (userList, schools) => {
    let data = [];
    if (userList !== null && schools !== null) {
      const toUserData = user => ({
        id: user.uid,
        Name: `${user.data.firstName} ${user.data.lastName}`,
        Mobile: user.data.mobile,
        Type: user.data.type,
        School: this.getSchoolName(schools, user.data.school_id),
      });
      data = userList.map(toUserData);
    }
    return data;
  }

  render() {
    let content = <CircularProgress />;
    const { users, auth, schools } = this.props;
    const { userList, size, rowsPerPage, page } = this.state;
    console.log(this.state);
    let data = [];
    // console.log(this.props);
    if (schools !== null && userList.length !== null) {
      data = this.createRows(userList, schools);
    }
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
            page={page}
            rowsPerPage={rowsPerPage}
            size={size}
            handleChangeRowsPerPage={this.handleChangeRowsPerPage}
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
}

const mapStateToProps = (state) => {
  return {
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
    { collection: 'schools' },
  ]),
)(Users);
