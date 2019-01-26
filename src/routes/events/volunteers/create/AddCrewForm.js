import React from 'react';
import { Formik, Form, Field } from 'formik';
import {
  MenuItem,
  Button,
} from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { withSnackbar } from 'notistack';
import * as Yup from 'yup';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getFirestore } from 'redux-firestore';

import * as util from '../../../../helper/util';
//import * as reduxAction from '../../../store/actions';
import TextField from '../../../../components/UI/TextField/TextField';
import Dropdown from '../../../../components/UI/Dropdown/Dropdown';


const initialValues = {
  firstName: '',
  lastName: '',
  mobile: '',
  type: '',
  email: '',
  school: '',
  studentNo: '',
  dietary: '',
};

const AddCrewForm = ({
  enqueueSnackbar, match,
}) => (
  <Formik
    initialValues={initialValues}
    validationSchema={Yup.object({
      firstName: Yup.string().required('Required'),
      lastName: Yup.string().required('Required'),
      mobile: Yup.number().moreThan(60000000, 'Enter a valid phone number')
        .lessThan(100000000, 'Enter a valid phone number')
        .required('Required'),
      email: Yup.string()
        .email('Email not valid')
        .required('Required'),
      password: Yup.string()
        .required('Password Required')
        .test('password', 'Password should contain at least 1 digit, 1 lower case, 1 upper case and at least 8 characters', value => value && /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(value)),
      confirmPassword: Yup.string()
        .required('Confirm Password Required')
        .oneOf([Yup.ref('password')], 'Passwords do not match')
        .test('password', 'Password should contain at least 1 digit, 1 lower case, 1 upper case and at least 8 characters', value => value && /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(value)),
      school: Yup.string().required('Required'),
      studentNo: Yup.string().min(9, 'Enter a valid Student Number').required('Required'),
      dietary: Yup.string(),
      type: Yup.mixed()
        .singleSelectRequired('Required'),
    })}
    onSubmit={(values, { setSubmitting, resetForm }) => {
      const firestore = getFirestore();
      const now = new Date();

      // update user values
      const addValues = {
        first_name: values.firstName,
        last_name: values.lastName,
        initials: values.firstName[0] + values.lastName[0],
        mobile: values.mobile,
        password: values.password,
        created_at: now,
        type: values.type,
        school: values.school,
        email: values.email,
        student_no: values.studentNo,
      };
      if (typeof (values.dietary) !== 'undefined') {
        addValues.dietary_restriction = values.dietary;
      }
      
      firestore.collection('events').doc(match.params.id).collection('volunteers').add({ 
        ...addValues,
      }).then(() => {
        resetForm();
        enqueueSnackbar('New Volunteer Added. Hooray!', {
          variant: 'success',
        });
      }).catch((err) => {
        console.log(err);
        enqueueSnackbar('Invalid Credentials for New User. Please try again.', {
          variant: 'error',
        });
      }).finally(() => {
        setSubmitting(false);
      });
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
          name="studentNo"
          label="Student Number"
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
        <Field
          required
          name="type"
          label="Type of Volunteer"
          component={Dropdown}
        >
          <MenuItem value="GL">Group Leader</MenuItem>
          <MenuItem value="GM">Game Master</MenuItem>
        </Field>
        <Field
          required
          name="school"
          label="School"
          type="text"
          component={TextField}
        />
        <Field
          required
          name="email"
          label="Email"
          type="email"
          component={TextField}
        />
        <Field
          name="dietary"
          label="Dietary Restrictions"
          type="text"
          component={TextField}
        />
        <div className="align-right">
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            component={Link}
            to={`/events/${match.params.id}/volunteers`}
          >
            <ArrowBack />
            BACK TO VOLUNTEERS
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={util.isFormValid(errors, touched)}
          >
            ADD VOLUNTEER
          </Button>
        </div>
      </Form>
    )}
  </Formik>
);


AddCrewForm.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  /* eslint-disable react/forbid-prop-types */
  match: PropTypes.any.isRequired,
  /* eslint-enable */
};

export default withSnackbar(withRouter((AddCrewForm)));
