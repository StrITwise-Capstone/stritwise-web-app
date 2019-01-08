import React from 'react';
import {
  Formik,
  Form,
  Field,
} from 'formik';
import {
  Button,
  Input,
  CircularProgress,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { firestoreConnect, firebaseConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { withSnackbar } from 'notistack';

import TextField from '../../../components/UI/TextField/TextField';
import DatePicker from '../../../components/UI/DatePicker/DatePicker';
import Thumb from '../../../components/UI/Thumb/Thumbnail';
import yup from '../../../instances/yup';

const initialValues = {
  name: '',
  startdate: '',
  enddate: '',
  description: '',
  image: '',
  max_student: '',
  min_student: '',
};

const guid = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};

const createEvent = ({
  auth,
  firestore,
  enqueueSnackbar,
  firebase,
}) => (
  <Formik
    initialValues={initialValues}
    validationSchema={yup.object({
      name: yup.string()
        .required('Required'),
      description: yup.string()
        .required('Required'),
      image: yup.mixed().required(),
      startdate: yup.date().required('Required'),
      enddate: yup.date().required('Required'),
      min_student: yup.number().integer().required('Required'),
      max_student: yup.number().integer().required('Required'),
    })}
    onSubmit={(values, { setSubmitting, resetForm }) => {
      // login user
      const { image } = values;
      const imageuid = guid();
      const uploadTask = firebase.storage().ref(`images/${imageuid}`).put(image);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          console.log(progress);
          enqueueSnackbar('Uploading Image...', {
            variant: 'info',
          });
        },
        (error) => {
          console.log(error);
        }, () => {
          firestore.collection('events').add({
            created_by: auth.uid,
            name: values.name,
            desc: values.description,
            start_date: new Date(values.startdate),
            end_date: new Date(values.enddate),
            image_path: `images/${imageuid}`,
            min_student: parseInt(values.min_student),
            max_student: parseInt(values.max_student),
            created_At: new Date(Date.now()),
            modified_At: new Date(Date.now()),
          }).then(() => {
            enqueueSnackbar('Event Created', {
              variant: 'success',
            });
            resetForm();
            setSubmitting(false);
          }).catch(() => {
            enqueueSnackbar('Event Not Created', {
              variant: 'error',
            });
            resetForm();
            setSubmitting(false);
          });
        });
    }}
  >
    {({
      values,
      handleSubmit,
      isSubmitting,
      setFieldValue,
    }) => {
      let content = <CircularProgress />;
      if (!isSubmitting) {
        content = (
          <Form onSubmit={handleSubmit}>
            <Field
              required
              name="name"
              label="Name of the event"
              type="text"
              component={TextField}
            />
            <Field
              required
              name="startdate"
              label="Start Date"
              type="text"
              component={DatePicker}
            />
            <Field
              required
              name="enddate"
              label="End Date"
              type="text"
              component={DatePicker}
            />
            <Field
              required
              name="description"
              label="Description"
              type="text"
              multiline
              component={TextField}
            />
            <Field
              required
              name="min_student"
              label="Minimum Student Per Team (Numbers only)"
              type="text"
              component={TextField}
            />
            <Field
              required
              name="max_student"
              label="Maximum Student Per Team (Numbers only)"
              type="text"
              component={TextField}
            />
            <p>Upload Event Image</p>
            <Field
              required
              render={() => (
                <Input
                  id="image"
                  name="file"
                  type="file"
                  onChange={(event) => { setFieldValue('image', event.currentTarget.files[0]); }}
                />
              )}
            />
            <div>
              <Thumb file={values.image} />
            </div>

            <div className="align-right">
              <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                CREATE EVENT
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

createEvent.defaultProps = {
  authError: '',
};

export default compose(
  connect(mapStateToProps),
  withSnackbar,
  firebaseConnect(),
  firestoreConnect(),
)(createEvent);
