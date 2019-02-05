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

const initialValues = {
  file: '',
  school: '',
}

var validationSchema = yup.array().of(yup.object().shape({
  key: yup.string().required().min(1),
  values: yup.array().of(
    yup.object().shape({
    'Team Name': yup.string().required().min(2),
    'First Name': yup.string().required().min(2),
    'Last Name': yup.string().required().min(2),
    'Phone Number': yup.string().required().min(2),
    'Email': yup.string().email().required().min(2),
    'Password': yup.string().required().min(2),
    'Emergency Contact Name': yup.string().required().min(2),
    'Emergency Contact Mobile': yup.string().required().min(2),
    'Relation to Participant': yup.string().required().min(2),
    'Badge Name': yup.string().required(),
    'Dietary Restrictions': yup.string().required(),
    'Remarks': yup.string().required(),
    })
  )
}));

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
}

const validateData = (teamsData) => {
  let isValid = true;
  if (!validationSchema.isValidSync(teamsData)) {
    isValid = false;
  }
  return isValid;
}

class UploadTeamForm extends Component {
  handleSubmit = (values) => {
    const {
      enqueueSnackbar,
    } = this.props;
    
    const uploadTeams = (dataByTeamName, school_id) => {
      Object.keys(dataByTeamName).map((TeamIndex) => {
        const {
          firestore,
          eventuid,
          handleClose,
          refreshState,
          teacherId,
          auth,
        } = this.props;
        const team = dataByTeamName[TeamIndex];
        console.log(team);
        // Do verification
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
          for (let i = 0; i < team.values.length; i++) {
            const data = {
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
            };
            data.password = team.values[i].Password;
            data.eventId = eventuid;
            const transaction = {
              user_id: auth.uid,
              transaction_type: 'ADD_STUDENT',
              data,
            };
            firestore.collection('transactions').add(transaction);
          }
          handleClose();
          if (parseInt(TeamIndex) + 1 === dataByTeamName.length) refreshState();
        });
      }
      );
    }
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
      
      if (validateData(teamsData)) {
        uploadTeams(teamsData, school_id);
      }
      if (!validateData(teamsData)) {
        enqueueSnackbar('Error Adding Team...', {
          variant: 'error',
        });
      }
    };
    reader.readAsText(input);
  };

  render() {
    return (
      <Formik
        initialValues={initialValues}
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

UploadTeamForm.propTypes = {
  eventuid: PropTypes.string.isRequired,
  refreshState: PropTypes.func.isRequired,
  teacherId: PropTypes.string,
  enqueueSnackbar: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  /* eslint-disable react/forbid-prop-types */
  schools: PropTypes.any.isRequired,
  /* eslint-enable */
};

UploadTeamForm.defaultProps = {
  teacherId: '',
};

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
  };
};

export default compose(withSnackbar, firestoreConnect(), connect(mapStateToProps))(UploadTeamForm);
