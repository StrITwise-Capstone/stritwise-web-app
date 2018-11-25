import React, { Component } from 'react';
import {
  Formik, Form, Field,
} from 'formik';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from 'react-router-dom';
import { withSnackbar } from 'notistack';
import Select from '../../components/UI/Select/Select';

import TextField from '../../components/UI/TextField/TextField';
import Dropdown from '../../components/UI/Dropdown/Dropdown';

class TestForm extends Component {
  render() {
    const { enqueueSnackbar } = this.props;
    enqueueSnackbar('Successfully fetched the data.', {
      variant: 'success',
    });
    return (
      <React.Fragment>
        <Formik
          initialValues={{
            email: '',
            password: '',
            age: '',
          }}
          validate={(values) => {
            const errors = {};
            if (!values.email) {
              errors.email = 'Required';
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = 'Invalid email address';
            } else if (!values.mobile) {
              errors.mobile = 'Required';
            }
            if (values.select.length === 0) {
              errors.select = 'Required!';
            }
            console.log(values);
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            console.log('Submitting');
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
                options={[
                  { label: 'Afghanistan', value: 'Afghanistan' },
                  { label: 'Aland Islands', value: 'Aland Islands' },
                  { label: 'Albania', value: 'Albania' },
                  { label: 'Algeria', value: 'Algeria' },
                  { label: 'American Samoa', value: 'American Samoa' },
                ]}
                name="select"
                label="Select"
                component={Select}
                isMulti={false}
              />

              <Field
                required
                name="email"
                label="Email"
                type="email"
                autoComplete="username"
                component={TextField}
              />
              <Field
                required
                name="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                component={TextField}
              />
              {/*
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
              */}
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

export default withSnackbar(TestForm);
