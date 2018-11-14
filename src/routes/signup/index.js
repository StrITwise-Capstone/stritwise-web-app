import React from 'react';
import { Link } from 'react-router-dom';
import { withFormik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'; // lazy do :(

import { signUp } from '../../store/actions/authActions';

const signUpForm = ({
  values, 
  errors, 
  touched, 
  isSubmitting,
  authError,
}) => (
  <Form>
    <h1>SIGN UP</h1>
    <div id="form">
      {touched.firstName && errors.firstName && <div id="firstName">{errors.firstName}</div>}
      <Field type="text" name="firstName" placeholder="Enter First Name" />
    </div>
    <div>
      {touched.lastName && errors.lastName && <div id="lastName">{errors.lastName}</div>}
      <Field type="text" name="lastName" placeholder="Enter Last Name" />
    </div>
    <div>
      {touched.mobile && errors.mobile && <p>{errors.mobile}</p>}
      <Field type="text" name="mobile" placeholder="Enter Mobile Number" />
    </div>
    <div>
      {touched.email && errors.email && <p>{errors.email}</p>}
      <Field type="email" name="email" placeholder="Enter Email" />
    </div>
    <div>
      {touched.password && errors.password && <p>{errors.password}</p>}
      <Field type="password" name="password" placeholder="Enter password" />
    </div>
    <div>
      <Link to="/login">Login Now!</Link>
    </div>
    <button type="submit" disabled={isSubmitting}>
        Register
    </button>
    <div>
      {authError ? <font color="red">{authError}</font> : null}
    </div>
  </Form>
);

const SignUp = withFormik({
  mapPropsToValues({
    firstName, lastName, mobile, email, password, authError,
  }) {
    return {
      firstName: firstName || '',
      lastName: lastName || '',
      mobile: mobile || '',
      email: email || '',
      password: password || '',
      authError: authError || null,
    };
  },

  validationSchema: Yup.object().shape({
    firstName: Yup.string()
      .required('First Name is required'),
    lastName: Yup.string()
      .required('Last Name is required'),
    mobile: Yup.string()
      .min(8, 'Mobile phone number must be 8 characters long')
      .max(8, 'Mobile phone number must be 8 characters long')
      .required('Mobile phone number is required'),
    email: Yup.string()
      .email('Email not valid')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be 8 characters or longer')
      .required('Password is required'),

  }),

  handleSubmit(values, {
    resetForm, setErrors, setSubmitting, props,
  }) {


    setTimeout(() => {
      // alert(JSON.stringify(values, null, 2)); // gives user a popup of the values
      // Create user
      props.signUp(values);
      if (values.authError) {
        setErrors({ form: values.authError });
      } else {
        resetForm();
      }
      setSubmitting(false);
    }, 2000);
    console.log(values);
  },
})(signUpForm);

const mapStateToProps = state => ({
  auth: state.firebase.auth,
  authError: state.auth.authError,
});
const mapDispatchToProps = (dispatch) => {
  return {
    signUp: newUser => dispatch(signUp(newUser)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
