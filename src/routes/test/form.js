import React, { Component } from 'react';
import {
  Formik, Form,
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
              <TextField
                required
                name="email"
                label="Email"
                type="email"
                autoComplete="username"
                touched={touched}
                onChange={handleChange}
                onBlur={handleBlur}
                values={values}
                errors={errors}
              />
              <br />
              <TextField
                required
                name="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                touched={touched}
                onChange={handleChange}
                onBlur={handleBlur}
                values={values}
                errors={errors}
              />
              <br />
              <Dropdown
                required
                name="age"
                label="Age"
                touched={touched}
                onChange={handleChange}
                onBlur={handleBlur}
                values={values}
                errors={errors}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="10">Ten</MenuItem>
                <MenuItem value="20">Twenty</MenuItem>
                <MenuItem value="30">Thirty</MenuItem>
              </Dropdown>
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
