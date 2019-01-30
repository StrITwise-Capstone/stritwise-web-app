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
import PropTypes from 'prop-types';
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

const SUPPORTED_FORMATS = [
  'image/jpg',
  'image/jpeg',
  'image/gif',
  'image/png',
];

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
      image: yup.mixed().required('Required').test('fileFormat', 'Unsupported Format', value => value && SUPPORTED_FORMATS.includes(value.type)),
      startdate: yup.date('Invalid date format').required('Required').default(() => (new Date())).typeError('Invalid date format'),
      enddate: yup.date('Invalid date format').required('Required').default(() => (new Date())).typeError('Invalid date format'),
      min_student: yup.number('Invalid number format').integer('Invalid number format').required('Required').typeError('Invalid number format'),
      max_student: yup.number('Invalid number format').integer('Invalid number format').required('Required').typeError('Invalid number format'),
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
            created_at: new Date(Date.now()),
            modified_at: new Date(Date.now()),
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
              type="date"
              component={DatePicker}
              placeholder="(e.g. 11/02/2019 03:00 PM)"
            />
            <Field
              required
              name="enddate"
              label="End Date"
              type="date"
              component={DatePicker}
              placeholder="(e.g. 11/02/2019 03:59 PM)"
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
              label="Minimum Student Per Team"
              type="text"
              component={TextField}
            />
            <Field
              required
              name="max_student"
              label="Maximum Student Per Team"
              type="text"
              component={TextField}
            />
            <p>Upload Event Image*</p>
            <Field
              required
              name="image"
              render={() => (
                <Input
                  type="file"
                  id="file"
                  name="image"
                  onChange={(event) => { setFieldValue('image', event.currentTarget.files[0]); }}
                />
              )}
            />
            { values.image && !(SUPPORTED_FORMATS.includes(values.image.type)) && (
              <div style={{ color: 'red' }}>Invalid file format</div>
            )}
            { values.image && SUPPORTED_FORMATS.includes(values.image.type) && (
              <div>
                <Thumb file={values.image} />
              </div>
            )}
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

createEvent.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  /* eslint-disable react/forbid-prop-types */
  auth: PropTypes.any.isRequired,
  firestore: PropTypes.any.isRequired,
  firebase: PropTypes.any.isRequired,
  /* eslint-enable */
};

createEvent.defaultProps = {
};

export default compose(
  connect(mapStateToProps),
  withSnackbar,
  firebaseConnect(),
  firestoreConnect(),
)(createEvent);
