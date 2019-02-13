import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
import Table from '../../components/UI/Table/Table';

/**
 * Class representing the Users component.
 */
class Users extends Component {
  state = {
    // Filter option.
    filter: 'all',
    // search value
    search: '',
  }

  /**
   * Function that is invoked to perform update operation on the data.
   */
  handleEdit = (userID) => {
    const { history } = this.props;
    history.push(`/users/${userID}/edit`);
  }

  /**
   * Function that is invoked to perform delete operation on the data.
   */
  handleDelete = (userID) => {
    const { firestore, auth } = this.props;
    const transaction = {
      user_id: auth.uid,
      transaction_type: 'DELETE_USER',
      data: userID,
    };
    return firestore.collection('transactions').add(transaction);
  }

  /**
   * Function that is invoked to map documents to the intended format.
   */
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
        Email: user.data.email,
      }
    ));
    return data;
  }

  /**
   * Function that is invoked to apply the filter to the filterRef variable in state.
   */
  handleCustomFilter = (collection, filter, search) => {
    if (filter === 'type') {
      collection = collection.where(filter, '==', search.toUpperCase());
    } else if (filter === 'school') {
      const { schools } = this.props;
      const school = schools.find(schElement => (schElement.name === search.toUpperCase()));
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
        >
          Add User
        </Button>
      </React.Fragment>
    );
    return (
      <AdminLayout
        title="Users"
        // subtitle="Some longer subtitle here"
        action={action}
      >
        <Table
          // title="Users"
          colRef={colRef}
          handleDocsList={this.handleDocsList}
          enableEdit
          handleEdit={this.handleEdit}
          enableDelete
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
        </Table>
      </AdminLayout>
    );
  }
}

const mapStateToProps = state => ({
  schools: state.firestore.ordered.schools,
  auth: state.firebase.auth,
});


Users.propTypes = {
  schools: PropTypes.arrayOf(PropTypes.shape({})),
  firestore: PropTypes.shape({}).isRequired,
  auth: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
};

Users.defaultProps = {
  schools: [],
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    { collection: 'schools' },
  ]),
)(Users);
