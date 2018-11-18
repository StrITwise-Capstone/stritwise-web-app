import React from 'react';
// import { Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';

const initialValues = {
  firstName: '',
  lastName: '',
  mobile: '',
  email: '',
  password: '',
};

const signUpForm = () => (
  <div>
    <h1>Sign Up!</h1>
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object({
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        mobile: Yup.string().min(8, 'Mobile phone number must be 8 characters long')
          .max(8, 'Mobile phone number must be 8 characters long')
          .required('Mobile phone number is required'),
        email: Yup.string().email('Email not valid').required('Email is required'),
        password: Yup.string()
          .min(8, 'Password must be 8 characters or longer')
          .required('Password is required'),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          // alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 500);
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
          <div className="row">
            <div className="col">
              <Field name="email" type="text" placeholder="Email" />
            </div>
          </div>
          {errors.email && touched.email && <p>{errors.email}</p>}
          <div className="row">
            <div className="col">
              <Field name="password" type="password" placeholder="Password" />
            </div>
          </div>
          {errors.password && touched.password && <p>{errors.password}</p>}
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  </div>
);

export default signUpForm;
