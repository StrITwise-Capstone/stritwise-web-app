import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import {
  Grid,
  Paper,
  Button,
  CircularProgress,
  Typography,
  MenuItem,
} from '@material-ui/core';

import CustomTable from '../../components/UI/Table/Table';

import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import * as util from '../../helper/util';
import TextField from '../../components/UI/TextField/TextField';
import Select from '../../components/UI/Select/Select';
import Dropdown from '../../components/UI/Dropdown/Dropdown';

const filterOptions = [
  { label: 'Type' },
  { label: 'School' },
  { label: 'Name' },
].map(option => ({
  label: option.label,
  value: option.label.toLowerCase(),
}));

class Users extends Component {

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

  handleDocsList = (docsList) => {
    let data = [];
    if (docsList !== null) {
      const toUserData = user => ({
        id: user.uid,
        Name: `${user.data.firstName} ${user.data.lastName}`,
        Mobile: user.data.mobile,
        Type: user.data.type,
        School: user.data.school_id,
      });
      data = docsList.map(toUserData);
    }
    return data;
  }


  render() {
    //let content = <CircularProgress />;
    const { schools, firestore } = this.props;

    //console.log(this.state);
    // console.log(this.props);
    const colRef = firestore.collection('users');
    return (
      <Grid
        container
        spacing={24}
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Grid item xs={12} sm={10}>
          <CustomTable
            // For Table
            // title="Users"
            colRef={colRef}
            dataHeader={['Name', 'Mobile', 'Type', 'School']}
            handleDocsList={this.handleDocsList}
            handleEdit={this.handleEdit}
            handleDelete={this.handleDelete}
          >

            <div>
              <Formik
                enableReinitialize={true}
                initialValues={{ search: '', filter: 'all' }}
                validationSchema={Yup.object({
                  search: Yup.string()
                    .required('Required'),
                  filter: Yup.mixed()
                    .singleSelectRequired('Required'),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  const { search, filter } = values;
                  const { colRef, colSize, rowsPerPage } = this.state;
                  let newRef = colRef;
                  let newSize = colSize;

                  if (filter === 'type') {
                    console.log(filter, search);
                    newRef = newRef.where(filter, '==', search.toLowerCase());
                  } 
                  else if (filter === 'name') {
                    const name = search.split(' ');
                    console.log(name);
                    if (name.length === 2) {
                      newRef = newRef.where('firstName', '==', name[0])
                        .where('lastName', '==', name[1]);
                    } else {
                      console.log("name is length one");
                      newRef = newRef.where('firstName', '==', name[0]);
                    }
                  }


                  const filterRef = newRef.orderBy('created_at', 'asc').limit(rowsPerPage);
                  const docsList = [];
                  filterRef.get().then((documentSnapshot) => {
                    if (filter !== 'all') {
                      newSize = documentSnapshot.size;
                    }
                    // Get the last visible document
                    const lastVisible = documentSnapshot.docs[documentSnapshot.docs.length - 1];
                    const firstVisible = documentSnapshot.docs[0];
                    documentSnapshot.forEach((doc) => {
                      docsList.push({
                        uid: doc.id,
                        data: doc.data(),
                      });
                    });
                    console.log(docsList);
                    this.setState({ docsList, lastVisible, firstVisible, filterRef: newRef, filterSize: newSize });
                    //console.log(this.state);
                    setSubmitting(false);
                  });
                }}
              >
                {({
                  errors,
                  touched,
                  handleSubmit,
                  isSubmitting,
                  values,
                }) => (
                  <Form onSubmit={handleSubmit}>
                    <div style={{ display: 'inline-block', minWidth: '200px', paddingRight: '5px' }}>
                      <Field
                        required
                        name="filter"
                        label="Filter"
                        component={Dropdown}
                      >
                        <MenuItem value="all">
                          <em>All</em>
                        </MenuItem>
                        <MenuItem value="type">Type</MenuItem>
                        <MenuItem value="school">School</MenuItem>
                        <MenuItem value="name">Name</MenuItem>
                      </Field>
                    </div>
                    {values.filter !== 'all' ? (
                      <div style={{ display: 'inline-block', minWidth: '200px', paddingRight: '5px' }}>
                        <Field
                          required
                          name="search"
                          label="Search"
                          type="text"
                          component={TextField}
                        />
                      </div>
                    ) : (
                      null
                    )}

                    <div style={{ display: 'inline-block', verticalAlign: 'bottom' }}>
                      <Button
                        type="submit"
                        variant="outlined"
                        color="primary"
                        disabled={util.isFormValid(errors, touched)}
                      >
                        Filter
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
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
        <Grid item xs={12} sm={2}>
          <Paper style={{
            padding: 4,
            textAlign: 'center',
            color: 'secondary',
          }}
          >
            <Typography variant="h4" id="tableTitle">
              Filter
            </Typography>

          </Paper>
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
