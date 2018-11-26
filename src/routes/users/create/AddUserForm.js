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

const AddUserForm = ({
  auth, logOut, enqueueSnackbar
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
    })}
    onSubmit={(values, { setSubmitting, resetForm }) => {
      const firebase = getFirebase();
      const firestore = getFirestore();
      firebase.auth().createUserWithEmailAndPassword(
        values.email,
        values.password,
      ).then(resp => firestore.collection('users').doc(resp.user.uid).set({
        firstName: values.firstName,
        lastName: values.lastName,
        initials: values.firstName[0] + values.lastName[0],
        mobile: values.mobile,
        type: values.type,
      })).then(() => {
        const user = firebase.auth().currentUser;
        if (user != null) {
          user.sendEmailVerification().then(() => {
          // Email sent.
            resetForm();
            enqueueSnackbar('New User Added. Hooray!', {
              variant: 'success',
            });
          }).catch(() => {
            // An error happened.
            enqueueSnackbar('New User was not sent Verfication Email...', {
              variant: 'error',
            });
          });
        }
      })
        .then(() => {
          logOut();
        })
        .catch((err) => {
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
      isSubmitting,
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
            component={Dropdown}
          >
            <MenuItem value="10">TKSS</MenuItem>
            <MenuItem value="20">Anglican High</MenuItem>
            <MenuItem value="30">Some other School</MenuItem>
          </Field>
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
  console.log(state);
  return {
    auth: state.firebase.auth,
  };
};

const mapDispatchToProps = dispatch => ({
  logOut: () => dispatch(reduxAction.logOut()),
});

AddUserForm.propTypes = {
  // auth: PropTypes.objectOf(PropTypes.string).isRequired,
  logOut: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
};

export default withSnackbar(connect(mapStateToProps, mapDispatchToProps)(AddUserForm));
