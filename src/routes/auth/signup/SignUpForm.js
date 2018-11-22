import React from 'react';
import { Formik, Form, Field } from 'formik';
import {
  MenuItem,
  Button,
  Typography,
} from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import * as util from '../../../helper/util';
import * as reduxAction from '../../../store/actions';
import TextField from '../../../components/UI/TextField/TextField';
import Dropdown from '../../../components/UI/Dropdown/Dropdown';

const initialValues = {
  firstName: '',
  lastName: '',
  mobile: '',
  school: '',
  email: '',
  password: '',
};

const SignUp = ({
  auth, authError, signUp, history,
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
        .matches(/.*\.edu\.sg$/, 'Only .edu.sg emails may be used')
        .required('Required'),
      password: Yup.string()
        .min(8, 'Password must be 8 characters or longer')
        .required('Required'),
    })}
    onSubmit={(values, { setErrors, setSubmitting, resetForm }) => {
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
          name="school"
          label="School"
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
        <Typography variant="body1" style={{ paddingTop: '10px' }}>
          By submitting this Form, you hereby agree to Ngee Ann Polytechnic&apos;s
          <a href="https://www.np.edu.sg/Pages/privacy.aspx"> Privacy </a>
          and
          <a href="https://www.np.edu.sg/Pages/terms.aspx"> Terms</a>
          .
        </Typography>
        <div className="align-right">
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            component={Link}
            to="/auth/login"
          >
            <ArrowBack />
            BACK TO LOGIN
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={util.isFormValid(errors, touched)}
          >
            REGISTER
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
