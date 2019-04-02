import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import {
  MenuItem,
  Button,
} from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { withSnackbar } from 'notistack';
import * as Yup from 'yup';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getFirestore } from 'redux-firestore';
import { connect } from 'react-redux';

import * as util from '../../../../helper/util';
import Select from '../../../../components/UI/Select/Select';
import TextField from '../../../../components/UI/TextField/TextField';
import Dropdown from '../../../../components/UI/Dropdown/Dropdown';
import yup from '../../../../instances/yup';


const initialValues = {
  firstName: '',
  lastName: '',
  mobile: '',
  type: '',
  team: {},
  email: '',
  school: '',
  studentNo: '',
  dietary: '',
  password: '',
  confirmPassword: '',
};

const validationSchema = Yup.object({
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  mobile: Yup.number().moreThan(60000000, 'Enter a valid phone number')
    .lessThan(100000000, 'Enter a valid phone number')
    .required('Required')
    .typeError('Invalid Mobile Number'),
  email: Yup.string()
    .email('Email not valid')
    .required('Required'),
  password: Yup.string()
    .required('Password Required')
    .test('password', 'Password should contain at least 1 digit, 1 lower case, 1 upper case and at least 8 characters', value => value && /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(value)),
  confirmPassword: Yup.string()
    .required('Confirm Password Required')
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .test('password', 'Password should contain at least 1 digit, 1 lower case, 1 upper case and at least 8 characters', value => value && /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(value)),
  school: Yup.string().required('Required'),
  studentNo: Yup.string().min(9, 'Enter a valid Student Number').required('Required'),
  dietary: Yup.string(),
  type: Yup.mixed()
    .singleSelectRequired('Required'),
  teams: yup.mixed(),
});

/**
 * Class representing the AddCrewForm component.
 * @param {Object[]} teams - List of team documents.
 */

class AddCrewForm extends Component {
  state = {
    transactionStatus: {},
  }

  /**
   * Enqueues a message to the Snackbar component based on the
   * transactionStatus object in the state.
   */
  componentDidUpdate(prevState) {
    const { transactionStatus } = this.state;
    const { enqueueSnackbar } = this.props;
    if (transactionStatus !== prevState.transactionStatus) {
      if (transactionStatus.completed) {
        enqueueSnackbar('Volunteer created successfully!', {
          variant: 'success',
        });
      } else if (transactionStatus.completed === false) {
        enqueueSnackbar(`An error occured: ${transactionStatus.errorMessage}`, {
          variant: 'error',
        });
      }
    }
  }

  render() {
    const {
      enqueueSnackbar, match, auth, teams,
    } = this.props;
    console.log(this.props);
    return (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          const firestore = getFirestore();
          const now = new Date();

          // update user values
          const addValues = {
            eventId: match.params.eventId,
            first_name: values.firstName,
            last_name: values.lastName,
            initials: values.firstName[0] + values.lastName[0],
            mobile: values.mobile,
            password: values.password,
            created_at: now,
            type: values.type,
            school: values.school,
            email: values.email,
            student_no: values.studentNo,
          };
          if (typeof (values.dietary) !== 'undefined') {
            addValues.dietary_restriction = values.dietary;
          }
          if (values.type === 'GL') {
            if (typeof (values.team.value) !== 'undefined') {
              addValues.team_id = values.team.value;
            }
          }
          const transaction = {
            user_id: auth.uid,
            transaction_type: 'ADD_VOLUNTEER',
            data: addValues,
          };
          firestore.collection('transactions').add(transaction).then((docRef) => {
            resetForm();
            enqueueSnackbar('Creating Volunteer... It may take a few minutes.', {
              variant: 'info',
            });
            firestore.collection('transactions').doc(docRef.id).onSnapshot((doc) => {
              const transactionStatus = {
                completed: doc.data().completed,
                errorMessage: doc.data().errorMessage,
              };
              this.setState({ transactionStatus });
            });
          }).catch((err) => {
            console.log(err);
            enqueueSnackbar('Invalid Credentials for New Volunteer. Please try again.', {
              variant: 'error',
            });
          }).finally(() => {
            setSubmitting(false);
          });
        }}
      >
        {({
          values,
          errors,
          touched,
          handleSubmit,
          /* and other goodies */
        }) => (
          <Form onSubmit={handleSubmit}>
            <Field
              required
              name="firstName"
              label="First Name"
              type="text"
              component={TextField}
            />
            <Field
              required
              name="lastName"
              label="Last Name"
              type="text"
              component={TextField}
            />
            <Field
              required
              name="studentNo"
              label="Student Number"
              type="text"
              component={TextField}
            />
            <Field
              required
              name="mobile"
              label="Mobile Number"
              type="text"
              component={TextField}
            />
            <Field
              required
              name="password"
              label="Password"
              type="password"
              component={TextField}
            />
            <Field
              required
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              component={TextField}
            />
            <Field
              required
              name="type"
              label="Type of Volunteer"
              component={Dropdown}
            >
              <MenuItem value="GL">Group Leader</MenuItem>
              <MenuItem value="GM">Game Master</MenuItem>
            </Field>
            {values.type === 'GL' ? (
              <Field
                required
                name="team"
                label="Team"
                options={teams}
                component={Select}
              />
            ) : (
              null
            )}
            <Field
              required
              name="school"
              label="School"
              type="text"
              component={TextField}
            />
            <Field
              required
              name="email"
              label="Email"
              type="email"
              component={TextField}
            />
            <Field
              name="dietary"
              label="Dietary Restrictions"
              type="text"
              component={TextField}
            />
            <div className="align-right">
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                component={Link}
                to={`/events/${match.params.eventId}/volunteers`}
              >
                <ArrowBack />
                BACK TO VOLUNTEERS
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={util.isFormValid(errors, touched)}
              >
                ADD VOLUNTEER
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.firebase.auth,
});

AddCrewForm.propTypes = {
  auth: PropTypes.shape({}).isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  teams: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  })),
  match: PropTypes.shape({}).isRequired,
};

AddCrewForm.defaultProps = {
  teams: [],
};

export default withSnackbar(withRouter(connect(mapStateToProps)(AddCrewForm)));
