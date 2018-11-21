import React from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Button,
  Paper,
  Grid,
  MenuItem,
  Typography,
} from '@material-ui/core';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as reduxAction from '../../../store/actions';
import TextField from '../../../components/UI/TextField/TextField';
import Dropdown from '../../../components/UI/Dropdown/Dropdown';


const initialValues = {
  firstName: '',
  lastName: '',
  mobile: '',
  email: '',
  password: '',
  age: '',
};

const SignUp = ({
  auth, authError, signUp, history,
}) => (
  <Formik
    initialValues={initialValues}
    validationSchema={Yup.object({
      firstName: Yup.string().required('Required'),
      lastName: Yup.string().required('Required'),
      mobile: Yup.string().min(8, 'Mobile phone number must be 8 characters long')
        .max(8, 'Mobile phone number must be 8 characters long')
        .required('Required'),
      email: Yup.string().email('Email not valid').required('Required'),
      password: Yup.string()
        .min(8, 'Password must be 8 characters or longer')
        .required('Required'),
    })}
    onSubmit={(values, { setErrors, setSubmitting, resetForm }) => {
      // alert(JSON.stringify(values, null, 2));
      // Create user
      signUp(values);
      if (authError) {
        setErrors({ form: authError });
      } else {
        resetForm();
        history.push('/login');
      }
      setSubmitting(false);
      console.log(values);
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
        <br />
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
          label="Lirst Name"
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
          name="age"
          label="Age"
          component={Dropdown}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="10">Ten</MenuItem>
          <MenuItem value="20">Twenty</MenuItem>
          <MenuItem value="30">Thirty</MenuItem>
        </Field>
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
        <br />
        <div>
          <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
            Register
          </Button>
        </div>
        <div>
          {authError ? <font color="red">{authError}</font> : null}
        </div>
      </Form>
    )}
  </Formik>
);

const mapStateToProps = (state) => {
  console.log(state);
  return {
    auth: state.firebase.auth,
    authError: state.auth.authError,
  };
};
const mapDispatchToProps = dispatch => ({
  signUp: newUser => dispatch(reduxAction.signUp(newUser)),
});

SignUp.propTypes = {
  auth: PropTypes.objectOf(PropTypes.string),
  authError: PropTypes.string,
  signUp: PropTypes.func,
};

SignUp.defaultProps = {
  auth: {},
  authError: null,
  signUp: () => {},
};


export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
