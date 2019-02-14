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
import PropTypes from 'prop-types';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { withSnackbar } from 'notistack';
import { withRouter } from 'react-router';

import DeleteButton from './DeleteButton/DeleteButton';
import yup from '../../../../../../../instances/yup';
import TextField from '../../../../../../../components/UI/TextField/TextField';

// initialValues for student object
const initialValues = (
  student,
  studentId,
  eventId,
  teamId,
  deleteValue,
) => {
  return {
    firstname: student.first_name,
    lastname: student.last_name,
    badgename: student.badge_name,
    dietary_restriction: student.dietary_restriction,
    remarks: student.remarks,
    email: student.email,
    studentId,
    eventId,
    teamId,
    deleteValue,
    emergency_contact_name: student.emergency_contact_name,
    emergency_contact_mobile: student.emergency_contact_mobile,
    emergency_contact_relation: student.emergency_contact_relation,
}}

// validationSchema for student object
const validationSchema = yup.object({
  firstname: yup.string()
    .required('Required'),
  lastname: yup.string()
    .required('Required'),
  badge_name: yup.string(),
  email: yup.string().email('Email is not valid'),
});

/**
 * Class representing the EditStudentForm component.
 * @param {Object} student - A specific student document
 * @param {string} studentId - A string of the student Id
 * @param {string} eventId - A string of the event Id
 * @param {teamId} teamId - A string of the team Id
 * @param {Function} updatePage - A function to update the page
 * @param {Boolean} deleteValue - A boolean whether can delete Student or not
*/
const EditStudentForm = ({
  firestore,
  enqueueSnackbar,
  student,
  studentId,
  eventId,
  teamId,
  deleteValue,
  match,
  updatePage,
}) => (
  <Formik
    enableReinitialize={true}
    initialValues={initialValues(student, studentId, eventId, teamId, deleteValue)}
    validationSchema={validationSchema}
    onSubmit={(values, { setSubmitting }) => {
      /**
      * Update current student
      */
      const updateStudent = () => {
        return firestore.collection('events').doc(match.params.eventId).collection('students').doc(studentId).update({
          first_name: values.firstname,
          last_name: values.lastname,
          badge_name: values.badgename,
          dietary_restriction: values.dietary_restriction,
          remarks: values.remarks,
          email: values.email,
          modified_at: new Date(Date.now()),
        });
      };

      updateStudent().then(() => {
        enqueueSnackbar('Student Updated', {
          variant: 'success',
        });
        setSubmitting(false);
      }).catch((err) => {
        enqueueSnackbar('Student Not Updated', {
          variant: 'error',
        });
        console.log(err);
        setSubmitting(false);
      });
    }}
  >
    {({
      handleSubmit,
      isSubmitting,
      initialValues,
    }) => {
      let content = <CircularProgress />;
      if (!isSubmitting) {
        content = (
          <Form
            onSubmit={handleSubmit}
            style={{ width: '550px' }}
          >
            <Field
              required
              name="firstname"
              label="First Name"
              type="text"
              component={TextField}
            />
            <Field
              required
              name="lastname"
              label="Last Name"
              type="text"
              component={TextField}
            />
            <Field
              required
              disabled
              name="email"
              label="Email"
              type="text"
              component={TextField}
            />
            <Field
              name="badgename"
              label="Badge Name"
              type="text"
              component={TextField}
            />
            <Field
              name="dietary_restriction"
              label="Dietary Restriction"
              type="text"
              component={TextField}
            />
            <Field
              required
              name="emergency_contact_name"
              label="Emergency Contact Name"
              type="text"
              component={TextField}
            />
            <Field
              required
              name="emergency_contact_mobile"
              label="Emergency Contact Mobile Number"
              type="text"
              component={TextField}
            />
            <Field
              required
              name="emergency_contact_relation"
              label="Emergency Contact Relation"
              type="text"
              component={TextField}
            />
            <Field
              name="remarks"
              label="Remarks"
              type="text"
              component={TextField}
            />
            <div className="align-right">
              {<Button type="submit" color="primary">Update</Button>}
            </div>
            <div className="align-right">
              {initialValues.deleteValue
              && (
                <DeleteButton
                  teamId={initialValues.teamId}
                  studentId={initialValues.studentId}
                  updatePage={updatePage}
                />)
              }
            </div>
          </Form>
        );
      }
      return content;
    }}
  </Formik>
);

EditStudentForm.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  eventId: PropTypes.string,
  studentId: PropTypes.string.isRequired,
  teamId: PropTypes.string.isRequired,
  deleteValue: PropTypes.bool.isRequired,
  /* eslint-disable react/forbid-prop-types */
  firestore: PropTypes.any.isRequired,
  student: PropTypes.any,
  match: PropTypes.any.isRequired,
  /* eslint-enable */
};

EditStudentForm.defaultProps = {
  student: null,
  eventId: null,
};

export default compose(
  withSnackbar,
  firestoreConnect(),
  withRouter,
)(EditStudentForm);
