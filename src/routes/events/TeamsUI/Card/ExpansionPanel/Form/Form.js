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
import * as Yup from 'yup';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { withSnackbar } from 'notistack';

import TextField from '../../../../../../components/UI/TextField/TextField';
import DeleteButton from './DeleteButton/DeleteButton';

const editStudent = ({
  authError,
  auth,
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
        studentuid: studentuid,
        eventuid: eventuid,
        teamuid: teamuid,
        deletevalue: deletevalue,
    }}
    // validationSchema={Yup.object({
    //   name: Yup.string()
    //     .required('Required'),
    //   description: Yup.string()
    //     .required('Required'),
    //   image: Yup.mixed().required(),
    //   startdate: Yup.date().required('Required'),
    //   enddate: Yup.date().required('Required'),
    // })}
    onSubmit={(values, { setSubmitting }) => {
        console.log(`teamuid${teamuid}`);
        console.log(`studentuid${studentuid}`);
        console.log(`eventuid${eventuid}`);
        console.log(`teamuid${teamuid}`);
      firestore.collection('events').doc(eventuid).collection('teams').doc(teamuid).collection('students').doc(studentuid).update({
          first_name: values.firstname,
          last_name: values.lastname,
          badge_name: values.badgename,
          dietary_restriction: values.dietary_restriction,
          remarks: values.remarks,
          email: values.email,
      }).then(() => {
          enqueueSnackbar('Student Updated',{
              variant: 'success',
          })
          setSubmitting(false);
      }).catch(() => {
          enqueueSnackbar('Student Not Updated', {
              variant: 'error',
          });
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
              label="First Name"
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
              name="remarks"
              label="Remarks"
              type="text"
              component={TextField}
            />
            <div className="align-right">
                <Button type="submit" color="primary">Update</Button>
            </div>
            <div className="align-right">
                {initialValues.deletevalue && <DeleteButton teamuid={initialValues.teamuid} studentuid={initialValues.studentuid} eventuid={initialValues.eventuid}/>}
            </div>
          </Form>
        );
      }
      return content;
    }}
  </Formik>
);

const mapStateToProps = state => ({
  authError: state.auth.authError,
  auth: state.firebase.auth,
  firestore: state.firestore,
  firebase: state.firebase,
});

export default compose(withSnackbar,connect(mapStateToProps),firestoreConnect())(editStudent);
