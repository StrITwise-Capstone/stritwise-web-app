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
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { withSnackbar } from 'notistack';

import TextField from '../../../../../../components/UI/TextField/TextField';
import DeleteButton from './DeleteButton/DeleteButton';
import yup from '../../../../../../instances/yup';

const editStudent = ({
  firestore,
  enqueueSnackbar,
  student,
  studentuid,
  eventuid,
  teamuid,
  deletevalue,
}) => (
  <Formik
    enableReinitialize={true}
    initialValues={{
      firstname: student.first_name,
      lastname: student.last_name,
      badgename: student.badge_name,
      dietary_restriction: student.dietary_restriction,
      remarks: student.remarks,
      email: student.email,
      mobile: student.mobile,
      studentuid,
      eventuid,
      teamuid,
      deletevalue,
      emergency_contact_name: student.emergency_contacts ? student.emergency_contacts.name : null,
      emergency_contact_mobile: student.emergency_contacts ? student.emergency_contacts.mobile : null,
      emergency_contact_relation: student.emergency_contacts ? student.emergency_contacts.relation : null,
    }}
    validationSchema={yup.object({
      firstname: yup.string()
        .required('Required'),
      lastname: yup.string()
        .required('Required'),
      badge_name: yup.string(),
      email: yup.string().email('Email is not valid'),
    })}
    onSubmit={(values, { setSubmitting }) => {
      firestore.collection('events').doc(eventuid).collection('students').doc(studentuid).update({
        first_name: values.firstname,
        last_name: values.lastname,
        badge_name: values.badgename,
        mobile: values.mobile,
        dietary_restriction: values.dietary_restriction,
        remarks: values.remarks,
        email: values.email,
        modified_at: new Date(Date.now()),
      }).then(() => {
        enqueueSnackbar('Student Updated',{
          variant: 'success',
        })
        setSubmitting(false);
      }).catch((err) => {
        enqueueSnackbar('Student Not Updated', {
          variant: 'error',
        });
        console.log(err);
        setSubmitting(false);
      });
    }
    }
  >
    {({
      handleSubmit,
      isSubmitting,
      initialValues,
    }) => {
      let content = <CircularProgress />;
      if (!isSubmitting) {
        content = (
          <Form onSubmit={handleSubmit}  style={{width:"550px"}}>
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
              name="email"
              label="Email"
              type="text"
              component={TextField}
            />
            <Field
              required
              name="mobile"
              label="Phone Number"
              type="text"
              component={TextField}
            />
            <Field
              required
              name="badgename"
              label="Badge Name"
              type="text"
              component={TextField}
            />
            <Field
              required
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
              required
              name="remarks"
              label="Remarks"
              type="text"
              component={TextField}
            />
            <div className="align-right">
              {<Button type="submit" color="primary">Update</Button>}
            </div>
            <div className="align-right">
              {initialValues.deletevalue && <DeleteButton teamuid={initialValues.teamuid} studentuid={initialValues.studentuid} eventuid={initialValues.eventuid} />}
            </div>
          </Form>
        );
      }
      return content;
    }}
  </Formik>
);

const mapStateToProps = (state, ownProps) => {
  return ({
    school: state.firestore.data[`school${ownProps.student.school_id}`],
  });
};

editStudent.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  eventuid: PropTypes.string.isRequired,
  studentuid: PropTypes.string.isRequired,
  teamuid: PropTypes.string.isRequired,
  deletevalue: PropTypes.bool.isRequired,
  /* eslint-disable react/forbid-prop-types */
  firestore: PropTypes.any.isRequired,
  student: PropTypes.any,
  /* eslint-enable */
};

editStudent.defaultProps = {
  student: null,
};

export default compose(
  withSnackbar,
  connect(mapStateToProps),
  firestoreConnect(),
)(editStudent);
