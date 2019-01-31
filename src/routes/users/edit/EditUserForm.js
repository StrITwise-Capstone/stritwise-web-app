import React from 'react';
import {
  Formik,
  Form,
  Field,
} from 'formik';
import {
  Button,
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
import TextField from '../../../components/UI/TextField/TextField';
import Select from '../../../components/UI/Select/Select';
import yup from '../../../instances/yup';

const validationSchema = yup.object({
  firstName: yup.string().required('Required'),
  lastName: yup.string().required('Required'),
  mobile: yup.number().moreThan(60000000, 'Enter a valid phone number')
    .lessThan(100000000, 'Enter a valid phone number')
    .required('Required')
    .typeError('Invalid Mobile Number'),
  school: yup.mixed()
    .singleSelectRequired('Required'),
});

const EditUser = ({
  history, schools, firebase, firestore, enqueueSnackbar, user,
}) => (
  <Formik
    enableReinitialize={true}
    initialValues={{
      firstName: `${user.firstName}`,
      lastName: `${user.lastName}`,
      mobile: `${user.mobile}`,
      school: {
        label: `${user.school.label}`,
        value: `${user.school.value}`,
      },
    }}
    validationSchema={validationSchema}
    onSubmit={(values, { setSubmitting }) => {
      // console.log(values);
      const now = new Date();

      const userRef = firestore.collection('users').doc(user.id);
      // update user values
      const updateValues = {
        firstName: values.firstName,
        lastName: values.lastName,
        initials: values.firstName[0] + values.lastName[0],
        mobile: values.mobile,
        modified_at: now,
      };
      if (typeof (user.school.value) !== 'undefined') {
        updateValues.school_id = values.school.value;
      }
      userRef.update({ ...updateValues }).then(() => {
        enqueueSnackbar('User successfully updated.', {
          variant: 'success',
        });
        history.push('/users');
        console.log('Document successfully updated!');
      }).catch((error) => {
        // The document probably doesn't exist.
        enqueueSnackbar('Something went wrong. User was not updated.', {
          variant: 'error',
        });
        console.error('Error updating document: ', error);
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
            {typeof (user.school.value) !== 'undefined' && (
              <Field
                name="school"
                label="School"
                options={schools}
                component={Select}
              />
            )}
            <div className="align-right">
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                component={Link}
                to="/users"
              >
                <ArrowBack />
                BACK TO USERS
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={util.isFormValid(errors, touched)}
              >
                Save
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

EditUser.propTypes = {
  schools: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  })),
  /* eslint-disable react/forbid-prop-types */
  enqueueSnackbar: PropTypes.any.isRequired,
  history: PropTypes.any.isRequired,
  firebase: PropTypes.any.isRequired,
  firestore: PropTypes.any.isRequired,
  /* eslint-enable */
};

EditUser.defaultProps = {
  schools: { },
};

export default compose(
  connect(mapStateToProps),
  withSnackbar,
  withRouter,
  withFirebase,
  withFirestore,
)(EditUser);
