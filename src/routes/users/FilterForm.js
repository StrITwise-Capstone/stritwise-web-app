import React from 'react';
import { Formik, Form, Field } from 'formik';
import {
  MenuItem,
  Button,
  Typography,
} from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { withSnackbar } from 'notistack';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getFirebase } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';

import * as util from '../../../helper/util';
import * as reduxAction from '../../../store/actions';
import TextField from '../../../components/UI/TextField/TextField';
import Dropdown from '../../../components/UI/Dropdown/Dropdown';


const initialValues = {
  firstName: '',
  lastName: '',
  mobile: '',
  type: '',
  email: '',
  password: '',
};

const FilterForm = ({

}) => (
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
      const { colRef, colSize } = this.state;
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
);


export default FilterForm;
