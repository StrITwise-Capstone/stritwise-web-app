import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Button, CircularProgress } from '@material-ui/core';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import { getFirebase } from 'react-redux-firebase';
import { compose } from 'redux';

import * as util from '../../../helper/util';
import * as reduxAction from '../../../store/actions';
import TextField from '../../../components/UI/TextField/TextField';

const initialValues = {
  email: '',
  password: '',
};

const LoginForm = ({
  logOut, logIn, enqueueSnackbar, history,
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
    onSubmit={(values, { setSubmitting, resetForm }) => {
      const firebase = getFirebase();
      firebase.auth().signInWithEmailAndPassword(
        values.email,
        values.password,
      ).then(() => {
        const user = firebase.auth().currentUser;
        if (user != null) {
          if (user.emailVerified) {
            resetForm();
            logIn();
            enqueueSnackbar('Authenticated. Logging in...', {
              variant: 'success',
            });
            history.push('/events');
          } else {
            logOut();
            enqueueSnackbar('Please verify your email and try again.', {
              variant: 'error',
            });
          }
        } else {
          enqueueSnackbar('Something went wrong! Please contact an administrator.', {
            variant: 'error',
          });
        }
      }).catch(() => {
        enqueueSnackbar('Invalid Credentials. Please try again.', {
          variant: 'error',
        });
      }).finally(() => {
        setSubmitting(false);
      });
    }}
  >
    {({
      errors,
      touched,
      handleSubmit,
      isSubmitting,
    }) => {
      let content = <CircularProgress />;
      if (!isSubmitting) {
        content = (
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
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                component={Link}
                to="/auth/signup"
              >
                REGISTER AS TEACHER
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={util.isFormValid(errors, touched)}
              >
                LOGIN
              </Button>
            </div>
          </Form>
        );
      }
      return content;
    }}
  </Formik>
);

const mapDispatchToProps = dispatch => ({
  logIn: () => dispatch(reduxAction.logIn()),
  logOut: () => dispatch(reduxAction.logOut()),
});

LoginForm.propTypes = {
  logIn: PropTypes.func.isRequired,
  logOut: PropTypes.func.isRequired,
  /* eslint-disable react/forbid-prop-types */
  enqueueSnackbar: PropTypes.func.isRequired,
  /* eslint-enable */
  history: PropTypes.shape({}).isRequired,
};

export default compose(withSnackbar, connect(null, mapDispatchToProps), withRouter)(LoginForm);
