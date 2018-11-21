import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Button } from '@material-ui/core';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import * as reduxAction from '../../../store/actions';
import TextField from '../../../components/UI/TextField/TextField';
import Spinner from '../../../components/UI/Spinner/Spinner';

const initialValues = {
  email: '',
  password: '',
};

const Login = ({
  authError, auth, logIn, logOut,
}) => (
  <Formik
    initialValues={initialValues}
    validationSchema={Yup.object({
      email: Yup.string()
        .email('Email not valid')
        .required('Required'),
      password: Yup.string()
        .min(8, 'Password must be 8 characters or longer')
        .required('Required'),
    })}
    onSubmit={(values, { setErrors, setSubmitting, resetForm }) => {
      // login user
      logIn(values);
      if (authError) {
        setErrors({ form: authError });
      } else {
        resetForm();
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
          <p>
            <Link to="/auth/forgot">Forgot your password?</Link>
          </p>
          <Button type="submit" variant="outlined" color="secondary">
            REGISTER AS TEACHER
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={isSubmitting && errors === {}}>
            LOGIN
          </Button>
        </div>
      </Form>
    )}
  </Formik>
);

const mapStateToProps = state => ({
  authError: state.auth.authError,
  auth: state.firebase.auth,
});

const mapDispatchToProps = dispatch => ({
  logIn: creds => dispatch(reduxAction.logIn(creds)),
  logOut: () => dispatch(reduxAction.logOut()),
});

Login.propTypes = {
  auth: PropTypes.objectOf(PropTypes.string),
  authError: PropTypes.string,
  logIn: PropTypes.func,
  logOut: PropTypes.func,
};

Login.defaultProps = {
  auth: {},
  authError: null,
  logIn: () => {},
  logOut: () => {},
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
