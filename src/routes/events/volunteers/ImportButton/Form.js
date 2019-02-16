import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Button,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import Input from '@material-ui/core/Input';
import Papa from 'papaparse';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import * as d3 from 'd3';
import yup from '../../../../instances/yup';

// validationSchema for volunteers
var validationSchema = yup.array().of(yup.object().shape({
  key: yup.string().required(),
  values: yup.array().of(
    yup.object().shape({
    'First Name': yup.string().required('First name is required'),
    'Last Name': yup.string().required('Last name is required'),
    'Mobile Number': yup.number()
        .moreThan(60000000, 'Enter a valid phone number')
        .lessThan(100000000, 'Enter a valid phone number')
        .required('Mobile number is required')
        .typeError('Invalid Phone Number'),
    'Email': yup.string().email('Email is required').required(),
    'Password': yup.string().required('Password is required'),
    'Dietary Restrictions': yup.string().required('Dietary Restriction is required'),
    'Student Number': yup.string().required('Student Number is required'),
    'Type of Volunteer': yup.string().required('Volunteer Type is required'),
    'School': yup.string().required('School is required'),
  }),
  ),
}
));

const parseData = (unParsedContents) => {
  const array = [];
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

const validateData = (volunteersData) => {
  let isValid = true;
  if (!validationSchema.isValidSync(volunteersData))
  {
    isValid = false;
  }
  return isValid;
}

// checkDuplicates
// return true if there's duplicates
function hasDuplicates(array) {
  var valuesSoFar = Object.create(null);
  for (var i = 0; i < array.length; ++i) {
      var value = array[i];
      if (value in valuesSoFar) {
          return true;
      }
      valuesSoFar[value] = true;
  }
  return false;
}

class ImportButtonForm extends Component {

  handleSubmit = (values) => {
    const {
      enqueueSnackbar,
    } = this.props;

    const uploadTeams = (volunteerData) => {
      const { 
        enqueueSnackbar,
        firestore,
        eventuid,
        refreshState,
        handleClose,
        auth,
      } = this.props;
      
      Object.keys(volunteerData).map((VolunteerIndex) => {
        const volunteer = volunteerData[VolunteerIndex].values[0];
        if (volunteer['Type of Volunteer'] === 'Group Leader') {
          volunteer['Type of Volunteer'] = 'GL';
        }
        if (volunteer['Type of Volunteer'] === 'Game Master') {
          volunteer['Type of Volunteer'] = 'GM';
        }
        const data = {
          first_name: volunteer['First Name'],
          last_name: volunteer['Last Name'],
          mobile: volunteer['Mobile Number'],
          school: volunteer.School,
          email: volunteer.Email,
          dietary_restrictions: volunteer['Dietary Restrictions'],
          initials: volunteer['First Name'][0] + volunteer['Last Name'][0],
          student_no: volunteer['Student Number'],
          type: volunteer['Type of Volunteer'],
          created_at: new Date(Date.now()),
          modified_at: new Date(Date.now()),
        };
        data.password = volunteer.Password;
        data.eventId = eventuid;
        const transaction = {
          user_id: auth.uid,
          transaction_type: 'ADD_VOLUNTEER',
          data,
        };
        if ( parseInt(VolunteerIndex) === volunteerData.length - 1) {
          enqueueSnackbar(`Added ${volunteerData.length} volunteers...`, {
            variant: 'info',
          });
          refreshState();
        }
        return firestore.collection('transactions').add(transaction);
      });
      handleClose();
    }
  
    const input = values.file;
    if (!input) {
      return;
    }

    const reader = new FileReader();
    reader.onload = function readFile(event) {
      const unParsedContents = event.target.result;
      let volunteersData = parseData(unParsedContents).data;
      volunteersData = d3.nest()
        .key(function(d) { return d['Email']; })
        .entries(volunteersData);
      if (volunteersData.length === 0) {
        enqueueSnackbar('Empty file', {
          variant: 'error',
        });
      }

      /**
       * Call back Action
       */
      const callbackAction = (value) => { 
        if (value === true) {
          enqueueSnackbar('There are users with same email', {
            variant: 'error',
          });
        }
        
        if (value === false) {
          if (validateData(volunteersData)) {
            uploadTeams(volunteersData);
          }
          if (!validateData(volunteersData)) {
            enqueueSnackbar('Error Adding Team...', {
              variant: 'error',
            });
            validationSchema.validate(volunteersData).catch((values) => {
              const row = values.path.split('.')[0][1];
              enqueueSnackbar(`${values.errors} for ${values.value[row].key}`, {
                variant: 'error',
              });
            });
          }
        };
      }

      /**
       * Validate email
       */
      const validateEmail = () => {
        const array = [];
        Object.keys(volunteersData).map((volunteer, index) => {
          volunteersData[index].values.map((volunteer2, index2) => {
            array.push(volunteersData[index].values[index2].Email);
            if ((volunteersData[index].values.length === index2 + 1) && (volunteersData.length === index + 1)) {
              const right = hasDuplicates(array);
              callbackAction(right);
            }
            return null;
          });
          return null;
        });
      };

      if (volunteersData.length !== 0 ) {
        validateEmail();
      }
    };
    reader.readAsText(input);
  }

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
  eventuid: PropTypes.string,
  refreshState: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  /* eslint-disable react/forbid-prop-types */
  firestore: PropTypes.any.isRequired,

  /*
   eslint-enable */
};

ImportButtonForm.defaultProps = {
  eventuid: null,
};

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
  };
};

export default compose(withSnackbar, firestoreConnect(), connect(mapStateToProps))(ImportButtonForm);
