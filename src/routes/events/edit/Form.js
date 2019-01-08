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
import moment from 'moment';

import TextField from '../../../components/UI/TextField/TextField';
import DatePicker from '../../../components/UI/DatePicker/DatePicker';
import Thumb from '../../../components/UI/Thumb/Thumbnail';
import yup from '../../../instances/yup';

function timeConverter(UNIX_timestamp) {
  return moment(new Date(UNIX_timestamp.seconds * 1000)).format('YYYY-MM-DDTHH:mm');
}

const initialValues = (event) => {
  if (event != null) {
    return {
      name: event.name,
      startdate: timeConverter(event.start_date),
      enddate: timeConverter(event.end_date),
      description: event.desc,
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

const editEvent = ({
  auth,
  firestore,
  enqueueSnackbar,
  event,
  eventuid,
  firebase,
}) => {
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues(event)}
      validationSchema={yup.object({
        name: yup.string()
          .required('Required'),
        description: yup.string()
          .required('Required'),
        image: yup.mixed(),
        startdate: yup.date().required('Required'),
        enddate: yup.date().required('Required'),
      })}

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
            modified_At: new Date(Date.now()),
          }).then(() => {
            // console.log('Event created');
            enqueueSnackbar('Event Updated', {
              variant: 'success',
            });
            resetForm();
            setSubmitting(false);
          }).catch(() => {
            // console.log(`Event not created: ${err}`);
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
                modified_At: new Date(Date.now()),
              }).then(() => {
                enqueueSnackbar('Event Updated', {
                  variant: 'success',
                });
                resetForm();
                setSubmitting(false);
              }).catch(() => {
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
              <p>Upload Event Image</p>
              <Field
                required
                render={() => (
                  <Input
                    id="image"
                    name="file"
                    type="file"
                    onChange={ (event) => { setFieldValue('image', event.currentTarget.files[0]); }}
                  />
                )}
              />
              <div>
                <Thumb file={values.image} />
              </div>

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

editEvent.defaultProps = {
  authError: '',
};

export default compose(
  withSnackbar,
  connect(mapStateToProps),
  firebaseConnect(),
  firestoreConnect(),
)(editEvent);
