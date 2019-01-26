import React from 'react';
import { Formik, Form, Field } from 'formik';
import {
  MenuItem,
  Button,
} from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { withSnackbar } from 'notistack';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getFirestore } from 'redux-firestore';

import * as util from '../../../helper/util';
import TextField from '../../../components/UI/TextField/TextField';
import Dropdown from '../../../components/UI/Dropdown/Dropdown';
import Select from '../../../components/UI/Select/Select';


const initialValues = {
  firstName: '',
  lastName: '',
  mobile: '',
  type: '',
  email: '',
  password: '',
  school: {},
};

const AddUserForm = ({
  auth, enqueueSnackbar, schools,
}) => (
  <Formik
    initialValues={initialValues}
    validationSchema={Yup.object({
      firstName: Yup.string().required('Required'),
      lastName: Yup.string().required('Required'),
      mobile: Yup.number().moreThan(60000000, 'Enter a valid phone number')
        .lessThan(100000000, 'Enter a valid phone number')
        .required('Required'),
      email: Yup.string()
        .email('Email not valid')
        .required('Required'),
      password: Yup.string()
        .min(8, 'Password must be 8 characters or longer')
        .required('Required'),
      school: Yup.mixed(),
    })}
    onSubmit={(values, { setSubmitting, resetForm }) => {
      const firestore = getFirestore();
      const now = new Date();
      // update user values
      const addValues = {
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        initials: values.firstName[0] + values.lastName[0],
        mobile: values.mobile,
        created_at: now,
        type: values.type,
      };
      if (typeof (values.school.value) !== 'undefined') {
        addValues.school_id = values.school.value;
      }

      const transaction = {
        user_id: auth.uid,
        transaction_type: 'ADD_USER',
        data: addValues,
      }
            
      firestore.collection('transactions').add(transaction).then(() => {
        resetForm();
        enqueueSnackbar('Creating user... It may take a few minutes.', {
          variant: 'success',
        });
      }).catch((err) => {
        console.log(err);
        enqueueSnackbar('Invalid Credentials for New User. Please try again.', {
          variant: 'error',
        });
      }).finally(() => {
        setSubmitting(false);
      });
    }}
  >
    {({
      values,
      errors,
      touched,
      handleSubmit,
      /* and other goodies */
    }) => (
      <Form onSubmit={handleSubmit}>
        <Field
          required
          name="firstName"
          label="First Name"
          type="text"
          component={TextField}
        />
        <Field
          required
          name="lastName"
          label="Last Name"
          type="text"
          component={TextField}
        />
        <Field
          required
          name="mobile"
          label="Mobile Number"
          type="text"
          component={TextField}
        />
        <Field
          required
          name="type"
          label="Type of User"
          component={Dropdown}
        >
          <MenuItem value="orion">Orion Member</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="teacher">Secondary School Teacher</MenuItem>
        </Field>
        {values.type === 'teacher' ? (
          <Field
            required
            name="school"
            label="School"
            options={schools}
            component={Select}
          />
        ) : (
          null
        )}
        <Field
          required
          name="email"
          label="Email"
          type="email"
          component={TextField}
        />
        <Field
          required
          name="password"
          label="Password"
          type="password"
          component={TextField}
        />
        <div className="align-right">
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            component={Link}
            to="/users"
          >
            <ArrowBack />
            BACK TO USERS
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={util.isFormValid(errors, touched)}
          >
            ADD USER
          </Button>
        </div>
      </Form>
    )}
  </Formik>
);

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
  };
};

AddUserForm.propTypes = {
  auth: PropTypes.objectOf(PropTypes.string).isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
};

export default withSnackbar(connect(mapStateToProps)(AddUserForm));
