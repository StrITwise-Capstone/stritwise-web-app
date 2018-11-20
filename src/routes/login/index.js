import React from 'react';
// import { Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

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
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object({
        email: Yup.string().email('Email not valid').required('Required'),
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
        <div style={{ padding: '30px' }}>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Paper elevation={3}>
              <div style={{ padding: '30px' }}>
                <Typography variant="h3">Login!</Typography>
                <Form onSubmit={handleSubmit}>
                  <br />
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
                  <Button type="submit" variant="contained" color="primary" disabled={isSubmitting && errors === {}}>
                    Login
                  </Button>
                  <br />
                  <br />
                  <Button type="button" variant="contained" color="primary" href="/signIn" onClick={() => { logOut(); }}>
                    Logout
                  </Button>
                  <div>
                    {authError ? <font color="red">{authError}</font> : null}
                  </div>
                </Form>
              </div>
            </Paper>
          </Grid>
        </div>
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