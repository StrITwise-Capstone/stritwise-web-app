import React from 'react';
import {
  Formik,
  Form,
  Field,
} from 'formik';
import {
  Button,
  Input,
} from '@material-ui/core';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';

import { storage } from '../../config/fbConfig';
import TextField from '../../components/UI/TextField/TextField';
import DatePicker from '../../components/UI/DatePicker/DatePicker';
import Thumb from './Thumb';

const initialValues = {
  name: '',
  startdate: '',
  enddate:'',
  description:'',
  image:'',
};

const guid = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return `${s4() + s4()  }-${  s4()  }-${  s4()  }-${  s4()  }-${  s4()  }${s4()  }${s4()}`;
}

const createEvent = ({
  authError, auth, createEvent, firebase, firestore
}) => (
  <Formik
    initialValues={initialValues}
    validationSchema={Yup.object({
      name: Yup.string()
        .required('Required'),
      description: Yup.string()
        .required('Required'),
      image: Yup.mixed().required(),
      startdate: Yup.date().required('Required'),
      enddate: Yup.date().required('Required'),
    })}
    onSubmit={(values, { setErrors, setSubmitting, resetForm }) => {
      // login user
      const { image } = values;
      const imageuid = guid();
      const uploadTask = storage.ref(`images/${imageuid}`).put(image);
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          console.log(progress);
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
          }).then(() => {
            console.log('Event created');
              }).catch((err) => {
            console.log(`Event not created${  err}`);
          });
        });

      if (authError) {
        setErrors({ form: authError });
      } else {
        resetForm();
      }
      setSubmitting(false);
      console.log(values);
    }}
  >
    {({
      values,
      errors,
      touched,
      handleSubmit,
      isSubmitting,
      setFieldValue,
      /* and other goodies */
    }) => (
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
          component={TextField}
        />
        <p>Upload Event Image</p>
        <Field
          required
          render={ props => (
            <Input
              id="image"
              name="file"
              type="file"
              onChange={(event) => { setFieldValue('image', event.currentTarget.files[0]);}}
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
    )}
  </Formik>
);

const mapStateToProps = state => ({
  authError: state.auth.authError,
  auth: state.firebase.auth,
  firestore: state.firestore,
  firebase: state.firebase,
});

createEvent.propTypes = {
};

createEvent.defaultProps = {
};

export default compose(connect(mapStateToProps), firestoreConnect())(createEvent);
