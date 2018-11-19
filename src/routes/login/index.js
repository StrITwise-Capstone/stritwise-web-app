import React from 'react';
import { withRouter , Link } from 'react-router-dom';
import { withFormik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { logIn, logOut, retrieveUser } from '../../store/actions/authActions';


const loginForm = ({
  errors,
  touched,
  isSubmitting,
  logOut,
  authError,
}) => (
  <Form>
    <h1>LOGIN</h1>
    <div>
      {touched.email && errors.email && <p>{errors.email}</p>}
      <Field type="email" name="email" placeholder="Enter Email" />
    </div>
    <div>
      {touched.password && errors.password && <p>{errors.password}</p>}
      <Field type="password" name="password" placeholder="Enter password" />
    </div>
    <Link to="/signup">Sign Up Now!</Link>
    <div />
    <div>
      <button type="submit" disabled={isSubmitting}>
        Submit
      </button>
    </div>
    <div>
      <button type="button" href="/signIn" onClick={logOut}>
        Logout
      </button>
      <div>
        {authError ? <font color="red">{authError}</font> : null}
      </div>
    </div>

  </Form>
);

const Login = compose(withRouter, withFormik({
  mapPropsToValues({ email, password }) {
    return {
      email: email || '',
      password: password || '',
    };
  },

  validationSchema: Yup.object().shape({
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
      // login user
      props.logIn(values);
      if (props.authError) {
        setErrors({ form: props.authError });
      } else {
        resetForm();
        props.history.push('/');
      }
      setSubmitting(false);
    }, 2000);
    console.log(values);
  },
}))(loginForm);


const mapStateToProps = (state) => {
  console.log(state);
  return {
    authError: state.auth.authError,
    auth: state.firebase.auth,
    user: state.auth.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logIn: creds => dispatch(logIn(creds)),
    logOut: () => dispatch(logOut()),
    retrieveUser: auth => dispatch(retrieveUser(auth)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
