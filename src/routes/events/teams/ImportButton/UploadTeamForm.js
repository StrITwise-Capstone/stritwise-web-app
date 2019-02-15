import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import { connect } from 'react-redux';
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

import * as util from '../../../../helper/util';
import Select from '../../../../components/UI/Select/Select';
import yup from '../../../../instances/yup';

// regExpression
const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})");

// initialValues for the form
const initialValues = {
  file: '',
  school: '',
};

// validationSchema for the form
const validationSchema = (teams, minStudent, maxStudent) => yup.array().of(yup.object().shape({
  key: yup.string().required('Team Name is required').min(1, 'Team Name is too short'),
  values: yup.array().of(
    yup.object().shape({
      'Team Name': yup.string().required('Team Name is required').min(2, 'Team name is too short').test('team name', 'There is an existing team name', value => value && !(teams.indexOf(value) > -1)),
      'First Name': yup.string().required('First Name is required').min(2, 'First name is too short'),
      'Last Name': yup.string().required('Last Name is required').min(2, 'Last name is too short'),
      Email: yup.string().email('Email is invalid').required().min(2, 'Email is too short'),
      Password: yup.string().required('Password is required').min(2).test('password', 'Password should contain at least 1 digit, 1 lower case, 1 upper case and at least 8 characters', value => value && mediumRegex.test(value)),
      'Emergency Contact Name': yup.string().required('Emergency Contact Name is required').min(2, 'Emergency contact name is too short'),
      'Emergency Contact Mobile': yup.string().required('Emergency Contact Mobile is required').min(2, 'Emergency contact mobile is too short'),
      'Relation to Participant': yup.string().required('Relation to Participant is required').min(2, 'Relation to participant is too short'),
      'Dietary Restrictions': yup.string().required('Dietary Restrictions is required'),
      Remarks: yup.string().required('Remarks is required (You can put nil)'),
    }),
  ).min(minStudent, 'Not enough students in a team').max(maxStudent, 'Too many students in a team'),
}));

/**
* Convert data from string to objects
*/
const parseData = (unParsedContents) => {
  let array = [];
  return Papa.parse(unParsedContents, {
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
};

/**
* Validate Data for Team objects
*/
const validateData = (teamsData, teams, minStudent, maxStudent) => {
  let isValid = true;
  if (!validationSchema(teams, minStudent, maxStudent).isValidSync(teamsData)) {
    isValid = false;
    return isValid;
  }
  return isValid;
};

/**
 * Class representing the UploadTeamForm component.
 * @param {Object[]} schools - An array of objects containing school name and Id
 * @param {string} teacherId - A string of the teacher Id
 * @param {string} eventId - A string of event Id
 * @param {Function} updatePage - A function to update the page
 * @param {Function} handleClose - A function to close the dialog
 */
class UploadTeamForm extends Component {
  state = {
    minStudent: 0,
    maxStudent: 0,
  }
  componentDidMount() {
    this.getMinStudent();
  }

  getMinStudent = () => {
    const { firestore, eventId } = this.props;
    firestore.collection('events').doc(`${eventId}`).get().then((docRef) => {
      this.setState({ minStudent:  docRef.data().min_student, maxStudent: docRef.data().max_student });
    });
  }

  handleSubmit = (values) => {
    const {
      firestore,
      eventId,
      handleClose,
      updatePage,
      teacherId,
      auth,
      teams,
      enqueueSnackbar,
    } = this.props;
    const {
      minStudent,
      maxStudent,
    } = this.state;
    
    values.minStudent = minStudent;
    values.maxStudent = maxStudent;

    const snackbarMessage = (message) => {
      enqueueSnackbar(message, {
        variant: 'error',
      });
    };

    const uploadTeams = (dataByTeamName, school_id) => {
      Object.keys(dataByTeamName).map((TeamIndex) => {
        const team = dataByTeamName[TeamIndex];
        return firestore.collection('events').doc(eventId).collection('teams').add({
          team_name: team.key,
          credit: 0,
          teacher_id: teacherId || '',
          created_at: new Date(Date.now()),
          modified_at: new Date(Date.now()),
          school_id,
        }).then((docRef) => {
          enqueueSnackbar('Added 1 Team...', {
            variant: 'info',
          });
          for (let i = 0; i < team.values.length; i++) {
            const data = {
              team_id: docRef.id,
              school_id,
              first_name: team.values[i]['First Name'],
              last_name: team.values[i]['Last Name'],
              email: team.values[i].Email,
              dietary_restriction: team.values[i]['Dietary Restrictions'],
              remarks: team.values[i].Remarks,
              emergency_contacts: {
                name: team.values[i]['Emergency Contact Name'],
                mobile: team.values[i]['Emergency Contact Mobile'],
                relation: team.values[i]['Relation to Participant'],
              },
              created_at: new Date(Date.now()),
              modified_at: new Date(Date.now()),
            };
            data.password = team.values[i].Password;
            data.eventId = eventId;
            const transaction = {
              user_id: auth.uid,
              transaction_type: 'ADD_STUDENT',
              data,
            };
            firestore.collection('transactions').add(transaction);
          }
          handleClose();
          if (parseInt(TeamIndex) + 1 === dataByTeamName.length) updatePage();
        });
      });
    };
    const input = values.file;
    if (!input) {
      return;
    }
    const reader = new FileReader();
    reader.onload = function readFile(event) {
      const unParsedContents = event.target.result;
      const school_id = values.school.value;
      let teamsData = parseData(unParsedContents).data;
      teamsData = d3.nest()
        .key(function(d) { return d['Team Name']; })
        .entries(teamsData);
      if (validateData(teamsData, teams, values.minStudent, values.maxStudent)) {
        uploadTeams(teamsData, school_id);
      }
      if (!validateData(teamsData, teams, values.minStudent, values.maxStudent)) {
        enqueueSnackbar('Error Adding Team...', {
          variant: 'error',
        });
        validationSchema(teams, values.minStudent, values.maxStudent).validate(teamsData).catch((value) => {
          snackbarMessage(value.errors);
        });
      }
    };
    reader.readAsText(input);
  };

  render() {
    const { schools } = this.props;
    return (
      <Formik
        initialValues={initialValues}
        onSubmit={this.handleSubmit}
        render={props => (
          <Form>
            <Field
              required
              name="school"
              label="School"
              options={schools}
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

UploadTeamForm.propTypes = {
  eventId: PropTypes.string.isRequired,
  updatePage: PropTypes.func.isRequired,
  teacherId: PropTypes.string,
  enqueueSnackbar: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  teams: PropTypes.arrayOf(PropTypes.string),
  /* eslint-disable react/forbid-prop-types */
  schools: PropTypes.any.isRequired,
  firestore: PropTypes.any.isRequired,
  auth: PropTypes.any.isRequired,
  /* eslint-enable */
};

UploadTeamForm.defaultProps = {
  teams: null,
};

UploadTeamForm.defaultProps = {
  teacherId: '',
};

const mapStateToProps = state => ({
  auth: state.firebase.auth,
});

export default compose(withSnackbar, firestoreConnect(), connect(mapStateToProps))(UploadTeamForm);
