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
import moment from 'moment';

import TextField from '../../../components/UI/TextField/TextField';
import DatePicker from '../../../components/UI/DatePicker/DatePicker';
import Thumb from '../../../components/UI/Thumb/Thumbnail';
import yup from '../../../instances/yup';

function timeConverter(UNIX_timestamp) {
  return moment(new Date(UNIX_timestamp.seconds * 1000)).format('YYYY-MM-DDTHH:mm');
}

const SUPPORTED_FORMATS = [
  'image/jpg',
  'image/jpeg',
  'image/gif',
  'image/png',
];

const initialValues = (event) => {
  if (event != null) {
    return {
      name: event.name,
      startdate: timeConverter(event.start_date),
      enddate: timeConverter(event.end_date),
      description: event.desc,
      min_student: `${event.min_student}`,
      max_student: `${event.max_student}`,
      image: '',
    };
  }
  if (event == null) {
    return {
      name: '',
      startdate: '',
      enddate: '',
      description: '',
      image: '',
      min_student: '',
      max_student: '',
    };
  }
  return null;
};

const guid = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};

const validationSchema = yup.object({
  name: yup.string()
    .required('Required'),
  description: yup.string()
    .required('Required'),
  image: yup.mixed()
    .test('fileFormat', 'Unsupported Format', value => value ? SUPPORTED_FORMATS.includes(value.type) : true),
  startdate: yup.date('Invalid date format')
    .required('Required')
    .default(() => (new Date()))
    .typeError('Invalid date format'),
  enddate: yup.date('Invalid date format')
    .required('Required').default(() => (new Date()))
    .typeError('Invalid date format'),
  min_student: yup.number('Invalid number format')
    .integer('Invalid number format')
    .required('Required')
    .typeError('Invalid number format'),
  max_student: yup.number('Invalid number format')
    .integer('Invalid number format')
    .required('Required')
    .typeError('Invalid number format'),
});

const editEvent = ({
  auth,
  firestore,
  enqueueSnackbar,
  event,
  eventuid,
  firebase,
  refreshState,
}) => {
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues(event)}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        // login user
        const { image } = values;
        if (image === '') {
          firestore.collection('events').doc(eventuid).update({
            created_by: auth.uid,
            name: values.name,
            desc: values.description,
            start_date: new Date(values.startdate),
            end_date: new Date(values.enddate),
            modified_at: new Date(Date.now()),
            min_student: parseInt(values.min_student),
            max_student: parseInt(values.max_student),
          }).then(() => {
            // console.log('Event created');
            enqueueSnackbar('Event Updated', {
              variant: 'success',
            });
            resetForm();
            setSubmitting(false);
            refreshState();
          }).catch((err) => {
            console.log(`Event not created: ${err}`);
            enqueueSnackbar('Event Not Updated', {
              variant: 'error',
            });
            setSubmitting(false);
            resetForm();
          });
        }
        if (image !== '') {
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
              firestore.collection('events').doc(eventuid).update({
                created_by: auth.uid,
                name: values.name,
                desc: values.description,
                start_date: new Date(values.startdate),
                end_date: new Date(values.enddate),
                image_path: `images/${imageuid}`,
                modified_at: new Date(Date.now()),
                min_student: parseInt(values.min_student),
                max_student: parseInt(values.max_student),
              }).then(() => {
                enqueueSnackbar('Event Updated', {
                  variant: 'success',
                });
                resetForm();
                setSubmitting(false);
                refreshState();
              }).catch((err) => {
                console.log(err);
                enqueueSnackbar('Event Not Updated', {
                  variant: 'error',
                });
                setSubmitting(false);
                resetForm();
              });
            });
        }
      }}
    >
      {({
        values,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        /* and other goodies */
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
              <Field
                required
                name="description"
                label="Description"
                type="text"
                multiline
                component={TextField}
              />
              <p>Upload Event Image</p>
              <Field
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
                  UPDATE EVENT
                </Button>
              </div>
            </Form>
          );
        }
        return content;
      }}
    </Formik>
  );
};

const mapStateToProps = state => ({
  authError: state.auth.authError,
  auth: state.firebase.auth,
  firestore: state.firestore,
  firebase: state.firebase,
});

editEvent.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  eventuid: PropTypes.string.isRequired,
  refreshState: PropTypes.func.isRequired,
  /* eslint-disable react/forbid-prop-types */
  auth: PropTypes.any.isRequired,
  firestore: PropTypes.any.isRequired,
  firebase: PropTypes.any.isRequired,
  event: PropTypes.any,
  /* eslint-enable */
};

editEvent.defaultProps = {
  event: null,
};

export default compose(
  withSnackbar,
  connect(mapStateToProps),
  firebaseConnect(),
  firestoreConnect(),
)(editEvent);
