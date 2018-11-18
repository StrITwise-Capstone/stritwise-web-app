import React from 'react';
// import { Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'; // lazy do :(

import { signUp } from '../../store/actions/authActions';

const initialValues = {
  firstName: '',
  lastName: '',
  mobile: '',
  email: '',
  password: '',
};

const SignUp = ({
  auth, authError, signUp, history,
}) => (
  <div>
    <h1>Sign Up!</h1>
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object({
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        mobile: Yup.string().min(8, 'Mobile phone number must be 8 characters long')
          .max(8, 'Mobile phone number must be 8 characters long')
          .required('Mobile phone number is required'),
        email: Yup.string().email('Email not valid').required('Email is required'),
        password: Yup.string()
          .min(8, 'Password must be 8 characters or longer')
          .required('Password is required'),
      })}
      onSubmit={(values, { setErrors, setSubmitting, resetForm }) => {
        setTimeout(() => {
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
        }, 500);
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

          <div className="row">
            <div className="col">
              <Field type="text" name="firstName" placeholder="First Name" />
              {touched.firstName && errors.firstName && <div id="firstName">{errors.firstName}</div>}
            </div>
          </div>

          <div className="row">
            <div className="col">
              <Field type="text" name="lastName" placeholder="Last Name" />
              {touched.lastName && errors.lastName && <div id="lastName">{errors.lastName}</div>}
            </div>
          </div>

          <div className="row">
            <div className="col">
              <Field type="text" name="mobile" placeholder="Mobile Number" />
              {touched.mobile && errors.mobile && <p>{errors.mobile}</p>}
            </div>
          </div>

          <div className="row">
            <div className="col">
              <Field name="email" type="text" placeholder="Email" />
              {errors.email && touched.email && <p>{errors.email}</p>}
            </div>
          </div>

          <div className="row">
            <div className="col">
              <Field name="password" type="password" placeholder="Password" />
              {errors.password && touched.password && <p>{errors.password}</p>}
            </div>
          </div>
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
          <div>
            {authError ? <font color="red">{authError}</font> : null}
          </div>
        </Form>
      )}
    </Formik>
  </div>
);

const mapStateToProps = (state) => {
  console.log(state);
  return {
    auth: state.firebase.auth,
    authError: state.auth.authError,
  };
};
const mapDispatchToProps = dispatch => ({
  signUp: newUser => dispatch(signUp(newUser)),
});

SignUp.propTypes = {
  auth: PropTypes.object,
  authError: PropTypes.string,
  signUp: PropTypes.func,
};

SignUp.defaultProps = {
  auth: {},
  authError: null,
  signUp: () => {},
};


export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
