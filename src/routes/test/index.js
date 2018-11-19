import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const testForm = () => (
  <div className="addGameForm">
    <h1>Working with Formik</h1>
    <Formik
      validationSchema={Yup.object().shape({
        title: Yup.string()
          .min(3, 'Title must be at least 3 characters long.')
          .required('Title is required.'),
      })}
      initialValues={{
        title: 'asdf',
        releaseYear: '',
        genre: '',
        price: '12',
      }}
      onSubmit={(values, actions) => {
        // this could also easily use props or other
        // local state to alter the behavior if needed
        // this.props.sendValuesToServer(values)

        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          actions.setSubmitting(false);
        }, 1000);
      }}
      render={({ values, touched, errors, dirty, isSubmitting }) => (
        <Form>
          <Field
            type="text"
            name="title"
            label="Title"
          />
          <Field
            type="text"
            name="releaseYear"
            label="Release Year"
          />
          <Field
            type="text"
            name="genre"
            label="Genre"
          />
          <Field
            type="text"
            name="price"
            label="Price"
          />
          <button
            type="submit"
            className="btn btn-default"
            disabled={isSubmitting || !dirty}
          >
            Add Game
          </button>
        </Form>
      )}
    />
  </div>
);
export default testForm;
