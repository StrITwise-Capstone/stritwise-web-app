import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import {
  Button,
  MenuItem,
} from '@material-ui/core';

import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import * as util from '../../helper/util';
import TextField from '../../components/UI/TextField/TextField';
import Dropdown from '../../components/UI/Dropdown/Dropdown';
import AdminLayout from '../../hoc/Layout/AdminLayout';
import CustomTable from '../../components/UI/Table/Table';

class Users extends Component {
  state = {
    filter: 'all',
    search: '',
  }

  // if (!auth.uid) return <Redirect to="/auth/login" />
  handleEdit = (userID) => {
    const { history } = this.props;
    history.push(`/users/${userID}/edit`);
  }

  handleDelete = (userID) => {
    const { firestore, auth } = this.props;
    const transaction = {
      user_id: auth.uid,
      transaction_type: 'DELETE_USER',
      data: userID,
    }
    return firestore.collection('transactions').add(transaction)
      .then(() => (console.log('Document is being deleted!')))
      .catch(error => (console.error('Error removing document: ', error)));
  }

  handleDocsList = (docsList) => {
    let data = [];
    const { schools } = this.props;
    if (!schools) {
      return null;
    }
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
    } else if (filter === 'school') {
      const { schools } = this.props;
      const school = schools.find(schElement => (schElement.name === search));
      if (school !== undefined) {
        collection = collection.where('school_id', '==', school.id);
      } else {
        collection = collection.where('school_id', '==', '1');
      }
    }
    return collection;
  }


  render() {
    const { firestore } = this.props;
    const { filter, search } = this.state;
    const colRef = firestore.collection('users');
    const action = (
      <React.Fragment>
        <Button
          type="button"
          variant="contained"
          color="secondary"
          component={Link}
          to="/users/create"
          //style={{ display: 'inline-block' }}
        >
          Add User
        </Button>
      </React.Fragment>
    );
    return (
      <AdminLayout
        title="Users"
        //subtitle="Some longer subtitle here"
        action={action}
      >
        <CustomTable
          // For Table
          // title="Users"
          colRef={colRef}
          handleDocsList={this.handleDocsList}
          enableEdit={true}
          handleEdit={this.handleEdit}
          enableDelete={true}
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
                search: Yup.string(),
                filter: Yup.mixed()
                  .singleSelectRequired('Required'),
              })}
              onSubmit={(values, { setSubmitting }) => {
                this.setState({ search: values.search, filter: values.filter });
                setSubmitting(false);
              }}
            >
              {({
                errors,
                touched,
                handleSubmit,
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

          </div>
        </CustomTable>
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
