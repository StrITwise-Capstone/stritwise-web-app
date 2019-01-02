import React from 'react';
import {
  Formik,
  Form,
  Field,
} from 'formik';
import {
  Button,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withFirebase, withFirestore } from 'react-redux-firebase';
import { withSnackbar } from 'notistack';

import * as util from '../../../helper/util';
import * as reduxAction from '../../../store/actions';
import TextField from '../../../components/UI/TextField/TextField';
import Select from '../../../components/UI/Select/Select';
import yup from '../../../instances/yup';

const initialValues = {
  firstName: '',
  lastName: '',
  mobile: '',
  school: [],
  email: '',
  password: '',
};

const validationSchema = yup.object({
  firstName: yup.string().required('Required'),
  lastName: yup.string().required('Required'),
  mobile: yup.number().moreThan(60000000, 'Enter a valid phone number')
    .lessThan(100000000, 'Enter a valid phone number')
    .required('Required'),
  school: yup.mixed()
    .singleSelectRequired('Required'),
  email: yup.string()
    .email('Email not valid')
    .matches(/.*\.edu\.sg$/, 'Only .edu.sg emails may be used')
    .required('Required'),
  password: yup.string()
    .min(8, 'Password must be 8 characters or longer')
    .required('Required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Password does not match')
    .required('Required'),
});

const SignUp = ({
  logOut, history, schools, firebase, firestore, enqueueSnackbar,
}) => (
  <Formik
    initialValues={initialValues}
    validationSchema={validationSchema}
    onSubmit={(values, { setSubmitting }) => {
      const now = new Date();
      const timestamp = now.getTime();

      firebase.auth().createUserWithEmailAndPassword(
        values.email,
        values.password,
      ).then(resp => firestore.set(`users/${resp.user.uid}`, {
        firstName: values.firstName,
        lastName: values.lastName,
        initials: values.firstName[0] + values.lastName[0],
        mobile: values.mobile,
        school: values.school.value,
        type: 'teacher',
        created_at: timestamp,
      })).then(() => {
        const user = firebase.auth().currentUser;
        if (user != null) {
          user.sendEmailVerification().then(() => {
            enqueueSnackbar('Verification email sent.', {
              variant: 'success',
            });
          }).catch(() => {
            enqueueSnackbar('Verification email failed to send. Please contact an administrator.', {
              variant: 'error',
            });
          });
        }
      }).then(() => {
        logOut();
        enqueueSnackbar('Account registered.', {
          variant: 'success',
        });
        history.push('/');
      }).catch((err) => {
        if (err.code === 'auth/email-already-in-use') {
          enqueueSnackbar(err.message, {
            variant: 'warning',
          });
        } else {
          enqueueSnackbar('Something went wrong. Please try again.', {
            variant: 'error',
          });
        }
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
              options={schools}
              component={Select}
            />
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
            <Field
              required
              name="confirmPassword"
              label="Confirm Password"
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
        );
      }
      return content;
    }}
  </Formik>
);

const mapStateToProps = state => ({
  auth: state.firebase.auth,
});

const mapDispatchToProps = dispatch => ({
  logOut: () => dispatch(reduxAction.logOut()),
});

SignUp.propTypes = {
  logOut: PropTypes.func.isRequired,
  schools: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  /* eslint-disable react/forbid-prop-types */
  enqueueSnackbar: PropTypes.any.isRequired,
  history: PropTypes.any.isRequired,
  firebase: PropTypes.any.isRequired,
  firestore: PropTypes.any.isRequired,
  /* eslint-enable */
};

SignUp.defaultProps = {
  schools: { },
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withSnackbar,
  withRouter,
  withFirebase,
  withFirestore,
)(SignUp);
