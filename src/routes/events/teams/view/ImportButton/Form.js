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

import * as util from '../../../../../helper/util';
import Select from '../../../../../components/UI/Select/Select';
import yup from '../../../../../instances/yup';


var schema = yup.object().shape({
  'Team Name': yup.string().required(),
  'First Name': yup.string().required(),
  'Last Name': yup.string().required(),
  'Phone Number': yup.string().required(),
  'Email': yup.string().email().required(),
  'Emergency Contact Name': yup.string().required(),
  'Emergency Contact Mobile': yup.string().required(),
  'Relation to Participant': yup.string().required(),
  'Badge Name': yup.string().required(),
  'Dietary Restrictions': yup.string().required(),
  'Remarks': yup.string().required(),
});

class AddUserForm extends Component {
  uploadTeams = (dataByTeamName, school_id) => {
    // Query for school where school name matches
    Object.keys(dataByTeamName).map((TeamIndex) => {
      const { 
        enqueueSnackbar,
        firestore,
        eventuid,
        handleClose,
        refreshState,
        teacherId,
      } = this.props;
      const team = dataByTeamName[TeamIndex];
      // Do verification
      if (schema.isValid(team)) {
        return firestore.collection('events').doc(eventuid).collection('teams').add({
          team_name: team.key,
          credit: 0,
          teacher_id: teacherId ? teacherId : '',
          created_at: new Date(Date.now()),
          modified_at: new Date(Date.now()),
          school_id,
        }).then((docRef) => {
          enqueueSnackbar('Added 1 Team...', {
            variant: 'info',
          });
          for (var i = 0; i < team.values.length; i++) {
            firestore.collection('events').doc(eventuid).collection('students').add({
              team_id: docRef.id,
              school_id,
              first_name: team.values[i]['First Name'],
              last_name: team.values[i]['Last Name'],
              mobile: team.values[i]['Phone Number'],
              email: team.values[i].Email,
              badge_name: team.values[i]['Badge Name'],
              dietary_restriction: team.values[i]['Dietary Restrictions'],
              remarks: team.values[i].Remarks,
              emergency_contacts: {
                name: team.values[i]['Emergency Contact Name'],
                mobile: team.values[i]['Emergency Contact Mobile'],
                relation: team.values[i]['Relation to Participant'],
              },
              created_at: new Date(Date.now()),
              modified_at: new Date(Date.now()),
            }).finally(() => {
              if (i === team.values.length) {
                enqueueSnackbar(`Added ${i} student...`, {
                  variant: 'info',
                });
              refreshState();
              }
            })
          }
          handleClose();
        });
      }
    });
  }

  handleSubmit = (values) => {
    const setData = (result) => {
      const {
        enqueueSnackbar,
      } = this.props;
      const school_id = values.school.value;
      const dataByTeamName = d3.nest()
        .key(function(d) { return d['Team Name']; })
        .entries(result);
      let isValid = true;
      const validation = Object.keys(dataByTeamName).map((TeamIndex) => {
        const team = dataByTeamName[TeamIndex];
        let i = 0;
        for (i = 0; i < team.values.length; i++) {
          if (!schema.isValidSync(team.values[i])) {
            isValid = false;
            console.log(team);
          }
          return null;
        }
      });
      if (isValid) {
        this.uploadTeams(dataByTeamName, school_id);
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
              name="school"
              label="School"
              options={this.props.schools}
              component={Select}
            />
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
                disabled={util.isFormValid(props.errors, props.touched)}
              >
                Upload
              </Button>
            </div>
          </Form>
        )}
      />);
  }
}

AddUserForm.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
};

export default compose(withSnackbar, firestoreConnect())(AddUserForm);
