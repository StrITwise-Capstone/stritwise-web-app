import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Button, CircularProgress } from '@material-ui/core';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { ArrowBack } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import { getFirebase } from 'react-redux-firebase';

import * as util from '../../../helper/util';
import * as reduxAction from '../../../store/actions';
import TextField from '../../../components/UI/TextField/TextField';

const initialValues = {
  email: '',
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Email not valid')
    .required('Required'),
});

const ForgotForm = ({
  enqueueSnackbar,
}) => (
  <Formik
    initialValues={initialValues}
    validationSchema={validationSchema}
    onSubmit={(values, { setSubmitting, resetForm }) => {
      const firebase = getFirebase();
      firebase.auth().sendPasswordResetEmail(values.email).then(() => {
        enqueueSnackbar('Reset email sent.', {
          variant: 'success',
        });
      }).catch(() => {
        enqueueSnackbar('Email address not found.', {
          variant: 'error',
        });
      }).finally(() => {
        resetForm();
        setSubmitting(false);
      });
    }}
  >
    {({
      errors,
      touched,
      handleSubmit,
      isSubmitting,
      /* and other goodies */
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
                SEND PASSWORD RESET
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

ForgotForm.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
};

export default withSnackbar(connect(null, mapDispatchToProps)(ForgotForm));
