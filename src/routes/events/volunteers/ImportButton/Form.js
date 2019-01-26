import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Button,
} from '@material-ui/core';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import Input from '@material-ui/core/Input';
import Papa from 'papaparse';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import * as d3 from 'd3';

import yup from '../../../../instances/yup';

var schema = yup.object().shape({
  'First Name': yup.string().required(),
  'Last Name': yup.string().required(),
  'Mobile Number': yup.string().required(),
  'Email': yup.string().email().required(),
  'Password': yup.string().required(),
  'Dietary Restrictions': yup.string().required(),
  'Student Number': yup.string().required(),
  'Type of Volunteer': yup.string().required(),
  'School': yup.string().required(),
});

class ImportButtonForm extends Component {
  uploadTeams = (data) => {
    const { 
      enqueueSnackbar,
      firestore,
      eventuid,
      refreshState,
      handleClose,
    } = this.props;
    console.log(data);
    // Query for school where school name matches
    Object.keys(data).map((VolunteerIndex) => {
      const volunteer = data[VolunteerIndex].values[0];
      if (volunteer['Type of Volunteer'] === 'Group Leader') {
        volunteer['Type of Volunteer'] = 'GL';
      }
      if (volunteer['Type of Volunteer'] === 'Game Master') {
        volunteer['Type of Volunteer'] = 'GM';
      }
      return firestore.collection('events').doc(eventuid).collection('volunteers').add({
        first_name: volunteer['First Name'],
        last_name: volunteer['Last Name'],
        mobile: volunteer['Mobile Number'],
        school: volunteer.School,
        email: volunteer.Email,
        password: volunteer.Password,
        dietary_restrictions: volunteer['Dietary Restrictions'],
        initials: volunteer['First Name'][0] + volunteer['Last Name'][0],
        student_no: volunteer['Student Number'],
        type: volunteer['Type of Volunteer'],
        created_at: new Date(Date.now()),
        modified_at: new Date(Date.now()),
      }).then((docRef) => {
        if ( parseInt(VolunteerIndex) === data.length - 1) {
          enqueueSnackbar(`Added ${data.length} volunteers...`, {
            variant: 'info',
          });
          refreshState();
        }
      });
    });
    handleClose();
  }

  handleSubmit = (values) => {
    const setData = (result) => {
      const {
        enqueueSnackbar,
      } = this.props;
      const data = d3.nest()
        .key(function(d) { return d['Student Number']; })
        .entries(result);
      let isValid = true;
      console.log(data);
      Object.keys(data).map((VolunteerIndex) => {
        const volunteer = data[VolunteerIndex];
        if (!schema.isValidSync(volunteer.values[0])) {
          isValid = false;
        }
        return null;
      });
      if (isValid) {
        this.uploadTeams(data);
      }
      if (!isValid) {
        enqueueSnackbar('Error Adding Team...', {
          variant: 'error',
        });
      }
    };
    const input = values.file;
    if (!input) {
      return;
    }
    const reader = new FileReader();
    reader.onload = function readFile(event) {
      const contents = event.target.result;
      let array = [];
      const result = Papa.parse(contents, {
        delimiter: "", // auto-detect
        newline: "", // auto-detect
        quoteChar: '"',
        escapeChar: '"',
        header: true,
        preview: 0,
        encoding: '',
        worker: false,
        comments: false,
        skipEmptyLines: 'greedy',
        complete: function getResults(results) {
          return array;
        },
      });
      setData(result.data);
    };
    reader.readAsText(input);
  };

  render() {
    return (
      <Formik
        initialValues={{
        }}
        onSubmit={this.handleSubmit}
        render={props => (
          <Form>
            <Field
              required
              name="file"
              label="Choose file to upload"
              type="file"
              component={Input}
              onChange={(event) => {
                props.setFieldValue('file', event.currentTarget.files[0]);
              }}
            />
            <div className="align-right">
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Upload
              </Button>
            </div>
          </Form>
        )}
      />);
  }
}

ImportButtonForm.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  
};

export default compose(withSnackbar, firestoreConnect())(ImportButtonForm);
