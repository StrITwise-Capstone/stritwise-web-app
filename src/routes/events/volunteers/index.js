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
import * as util from '../../../helper/util';
import TextField from '../../../components/UI/TextField/TextField';
import Dropdown from '../../../components/UI/Dropdown/Dropdown';
import AdminLayout from '../../../hoc/Layout/AdminLayout';
import CustomTable from '../../../components/UI/Table/Table';

class Volunteers extends Component {
  state = {
    filter: 'all',
    search: '',
  }

  // if (!auth.uid) return <Redirect to="/auth/login" />
  handleEdit = (volunteerID) => {
    const { history } = this.props;
    history.push(`/volunteers/${volunteerID}/edit`);
  }

  handleDelete = (volunteerID) => {
    const { firestore } = this.props;
    firestore.collection('volunteers').doc(volunteerID).delete().then(() => {
      console.log('Document successfully deleted!');
    }).catch((error) => {
      console.error('Error removing document: ', error);
    });
  }

  handleDocsList = (docsList) => {
    let data = [];
    data = docsList.map(volunteer => (
      {
        id: volunteer.uid,
        Name: `${volunteer.data.first_name} ${volunteer.data.last_name}`,
        Mobile: volunteer.data.mobile,
        Type: volunteer.data.type,
        School: volunteer.data.school,
        Dietary: volunteer.data.dietary_restriction ? volunteer.data.dietary_restriction : 'N.A.',
        StudentNo: volunteer.data.student_no,
        Email: volunteer.data.email,
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
    const colRef = firestore.collection('Volunteers');
    const action = (
      <React.Fragment>
        <Button
          type="button"
          variant="contained"
          color="secondary"
          component={Link}
          to="/Volunteers/create"
          //style={{ display: 'inline-block' }}
        >
          Add User
        </Button>
      </React.Fragment>
    );
    return (
      <AdminLayout
        title="Volunteers"
        //subtitle="Some longer subtitle here"
        action={action}
      >
        <CustomTable
          // For Table
          // title="Volunteers"
          colRef={colRef}
          dataHeader={[
            'Name',
            'Mobile',
            'Type',
            'School',
            'Dietary Restrictions',
            'Student Number',
            'Email',
          ]}
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
                search: Yup.string()
                  .required('Required'),
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
                      <MenuItem value="name">Nam e</MenuItem>
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


Volunteers.propTypes = {
};

Volunteers.defaultProps = {
};


export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    { collection: 'schools' },
  ]),
)(Volunteers);
