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
import AdminLayout from '../../hoc/Layout/AdminLayout';

const filterOptions = [
  { label: 'Type' },
  { label: 'School' },
  { label: 'Name' },
].map(option => ({
  label: option.label,
  value: option.label.toLowerCase(),
}));

class Users extends Component {
  state = {
    filter: 'all',
    search: '',
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

  handleDocsList = (docsList) => {
    let data = [];
    const { schools } = this.props;
    const schoolsMap = schools.reduce((map, obj) => {
      // Disabled eslint error for performance reasons
      /* eslint no-param-reassign: "off" */
      map[obj.id] = obj.name;
      /* eslint-enable */
      return map;
    }, {});
    data = docsList.map(user => (
      {
        id: user.uid,
        Name: `${user.data.firstName} ${user.data.lastName}`,
        Mobile: user.data.mobile,
        Type: user.data.type,
        School: schoolsMap[user.data.school_id] ? schoolsMap[user.data.school_id] : 'N.A.',
      }
    ));
    return data;
  }

  // Non-custom filter implmentation
  handleCustomFilter = (collection, filter, search) => {
    // check if Filter has been changed
    if (filter === 'type') {
      collection = collection.where(filter, '==', search.toLowerCase());
    } else if (filter === 'name') {
      const name = search.split(' ');
      if (name.length === 2) {
        collection = collection.where('firstName', '==', name[0])
          .where('lastName', '==', name[1]);
      } else {
        collection = collection.where('firstName', '==', name[0]);
      }
    }
    return collection;
  }


  render() {
    const { firestore } = this.props;
    const { filter, search } = this.state;
    const colRef = firestore.collection('users');
    return (
      <AdminLayout
        title="Users"
      >
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
            handleCustomFilter={this.handleCustomFilter}
            filter={filter}
            search={search}
          >

            <div>
              <Formik
                enableReinitialize
                initialValues={{ search: '', filter: 'all' }}
                validationSchema={Yup.object({
                  search: Yup.string()
                    .required('Required'),
                  filter: Yup.mixed()
                    .singleSelectRequired('Required'),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  this.setState({ search: values.search, filter: values.filter });
                  setSubmitting(false);
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
      </AdminLayout>
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
