import React from 'react';
// import { Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import Button from '@material-ui/core/Button';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'; // lazy do :(

import { logIn, logOut } from '../../store/actions/authActions';
import TextField from '../../components/UI/TextField/TextField';


const initialValues = {
  email: '',
  password: '',
};

const Login = ({
  authError, auth, logIn, logOut,
}) => (
  <React.Fragment>
    <h1>Login!</h1>
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object({
        email: Yup.string().email('Email not valid').required('Email is required'),
        password: Yup.string()
          .min(8, 'Password must be 8 characters or longer')
          .required('Password is required'),
      })}
      onSubmit={(values, { setErrors, setSubmitting, resetForm }) => {
        setTimeout(() => {
          // alert(JSON.stringify(values, null, 2));
          // login user
          logIn(values);
          if (authError) {
            setErrors({ form: authError });
          } else {
            resetForm();
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
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        /* and other goodies */
      }) => (
        <Form onSubmit={handleSubmit}>
          <TextField
            required
            name="email"
            label="Email"
            type="email"
            onChange={handleChange}
            touched={touched}
            onBlur={handleBlur}
            values={values}
            errors={errors}
          />
          <br />
          <TextField
            required
            name="password"
            label="Password"
            type="password"
            onChange={handleChange}
            touched={touched}
            onBlur={handleBlur}
            values={values}
            errors={errors}
          />
          <br />
          <br />
          <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
            Submit
          </Button>
          <Button type="button" variant="contained" color="primary" href="/signIn" onClick={() => { logOut(); }}>
            Logout
          </Button>
          <div>
            {authError ? <font color="red">{authError}</font> : null}
          </div>
        </Form>
      )}
    </Formik>
  </React.Fragment>
);

const mapStateToProps = (state) => {
  console.log(state);
  return {
    authError: state.auth.authError,
    auth: state.firebase.auth,
  };
};

const mapDispatchToProps = dispatch => ({
  logIn: creds => dispatch(logIn(creds)),
  logOut: () => dispatch(logOut()),
});

Login.propTypes = {
  auth: PropTypes.object,
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
