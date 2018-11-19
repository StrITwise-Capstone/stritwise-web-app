import React, { Component } from 'react';
import {
  Formik, Form, Field,
} from 'formik';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';

import TextField from '../../components/UI/TextField/TextField';
import Dropdown from '../../components/UI/Dropdown/Dropdown';

class TestForm extends Component {
  render() {
    return (
      <React.Fragment>
        <Formik
          initialValues={{ email: '', password: '', age: '' }}
          validate={(values) => {
            const errors = {};
            if (!values.email) {
              errors.email = 'Required';
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = 'Invalid email address';
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 400);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <Form>
              <Field
                required
                name="email"
                label="Email"
                type="email"
                autoComplete="username"
                component={TextField}
              />
              <br />
              <Field
                required
                name="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                component={TextField}
              />
              <br />
              <Field
                required
                name="age"
                label="Age"
                component={Dropdown}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="10">Ten</MenuItem>
                <MenuItem value="20">Twenty</MenuItem>
                <MenuItem value="30">Thirty</MenuItem>
              </Field>
              <br />
              <br />
              <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </React.Fragment>
    );
  }
}

export default TestForm;
