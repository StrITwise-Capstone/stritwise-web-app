import React, { Component } from 'react';
import {
  Formik,
  Form,
  Field,
  FieldArray,
} from 'formik';
import {
  Button,
  CircularProgress,
  Typography,
} from '@material-ui/core';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import {
  firestoreConnect,
  firebaseConnect,
} from 'react-redux-firebase';
import { compose } from 'redux';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';

import TextField from '../../../../components/UI/TextField/TextField';
import ErrorMessage from '../../../../components/UI/ErrorMessage/ErrorMessage';
import Select from '../../../../components/UI/Select/Select';
import yup from '../../../../instances/yup';

// initialValues for team object
const initialValues = (team, minStudent, students) => {
  return {
    team_name: team.team_name,
    students,
    school_id: {
      label: `${team.school_name}`,
      value: team.school_id,
    },
    deleteArray: [],
    lengthStudents: students.length,
  };
};

// validationSchema for team object
const validationSchema = (minStudent, teams, teamName, studentsEmail) => {
  return yup.object({
    team_name: yup.string()
      .required('Required')
      .test('team name', 'There is an existing team name', 
        (value) => {
          if (value !== teamName) {
            return (!(teams.indexOf(value) > -1));
          }
          return true;
        }),
    students: yup.array()
      .of(
        yup.object().shape({
          first_name: yup.string()
            .min(1, 'too short')
            .required('First Name Required'),
          last_name: yup.string()
            .required('Last Name Required'),
          email: yup.string()
            .email('Invalid email')
            .required('Email Required')
            .test('Existing Email name', 'There is an existing email', 
              function validateEmail(value) {
                if (this.parent.key === '') {
                  return !(studentsEmail.indexOf(value) > -1);
                }
                return true;
              },
            ),
          dietaryrestriction: yup.string(),
          remarks: yup.string(),
          emergency_contact_name: yup.string(),
          emergency_contact_mobile: yup.number()
            .moreThan(60000000, 'Enter a valid phone number')
            .lessThan(100000000, 'Enter a valid phone number')
            .required('Required')
            .typeError('Invalid Phone Number'),
          emergency_contact_relation: yup.string(),
          shirt_size: yup.string().required('Required shirt size'),
        }),
      )
      .required('Must have members')
      .min(minStudent, `Minimum of ${minStudent} member`),
  });
};

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


/**
 * Class representing the EditTeamForm component.
 * @param {Object[]} schools - An array of objects containing school name and Id
 * @param {Object} team - A team document
 * @param {Object} students - An array of student object
 * @param {Number} minStudent - A number of minimum students for the team
 * @param {Number} maxStudent - A number of maximum students for the team
 * @param {Function} updatePage - A function to refresh the page
 * @param {Object[]} teams - An array of string which are team names
 * @param {Object[]} teamsEmail - An array of string which are student emails
 * @param {String} teacherId - A string of teacherId
 */
class EditTeamForm extends Component {

  render() {
    const {
      firestore,
      enqueueSnackbar,
      match,
      minStudent,
      schools,
      team,
      students,
      updatePage,
      maxStudent,
      auth,
      teams,
      teamName,
      studentsEmail,
      teacherId,
    } = this.props;
    return (
      <Formik
        enableReinitialize={true}
        initialValues={initialValues(team, minStudent, students)}
        validationSchema={validationSchema(minStudent, teams, teamName, studentsEmail)}
        onSubmit={(values, { resetForm, setSubmitting }) => {
          const { eventId, teamId } = match.params;
          const {
            students,
            deleteArray,
          } = values;
          
          const deleteStudents = () => {
            deleteArray.map((student, index) => firestore.collection('events').doc(match.params.eventId).collection('students').doc(deleteArray[index]).delete());
          };

          
          /**
          * Update the current team
          */
          const updateTeam = () => {
            return firestore.collection('events').doc(eventId).collection('teams').doc(teamId).update({
              team_name: values.team_name,
              school_id: values.school_id.value,
              credit: 0,
              modified_at: new Date(Date.now()),
            });
          };

          /**
          * Update all the students in the current team
          */
          const updateStudents = (student, index) => firestore.collection('events').doc(eventId).collection('students').doc(student.key).update({
            first_name: student.first_name,
            last_name: student.last_name,
            email: student.email,
            dietary_restriction: student.dietary_restriction ? student.dietary_restriction : '',
            remarks: student.remarks ? student.remarks : '',
            emergency_contacts: {
              name: student.emergency_contact_name,
              mobile: student.emergency_contact_mobile,
              relation: student.emergency_contact_relation,
            },
            modified_at: new Date(Date.now()),
            shirt_size: student.shirt_size,
          }).then(() => {
            enqueueSnackbar('Updated 1 student...', {
              variant: 'info',
            });
            resetForm();
            setSubmitting(false);
            if (index === students.length) {
              enqueueSnackbar('Team Updated Successfully', {
                variant: 'success',
              });
              updatePage();
            }
            updatePage();
          });

          /**
          * Add all the new students in the current team
          */
          const addNewStudent = (student) => {
            const randomstring = Math.random().toString(36).slice(-8);
            const data = {
              team_id: teamId,
              first_name: student.first_name,
              last_name: student.last_name,
              email: student.email,
              password: randomstring,
              dietary_restriction: student.dietaryrestriction ? student.dietaryrestriction : '',
              remarks: student.remarks ? student.remarks : '',
              emergency_contacts: {
                name: student.emergency_contact_name,
                mobile: student.emergency_contact_mobile,
                relation: student.emergency_contact_relation,
              },
              created_at: new Date(Date.now()),
              modified_at: new Date(Date.now()),
              shirt_size: student.shirt_size,
            };

            data.eventId = eventId;
            const transaction = {
              user_id: auth.uid,
              transaction_type: 'ADD_STUDENT',
              data,
            };
            return firestore.collection('transactions').add(transaction).then((docRef) => {
              enqueueSnackbar('Added 1 student...', {
                variant: 'info',
              });
              enqueueSnackbar('Refresh the page to see the updates', {
                variant: 'info',
              });
              resetForm();
              setSubmitting(false);
            });
          };

          /**
           * Call back Action
           */
          const callbackAction = (value) => { 
            if (value === true) {
              enqueueSnackbar('There are users with same email', {
                variant: 'error',
              });
              setSubmitting(false);
            }

            if (value === false) {
              deleteStudents();
              updateTeam(eventId, teamId, values).then((docRef) => {
                enqueueSnackbar('Updated Team...', {
                  variant: 'info',
                });
                if (students) {
                  students.map((key, index) => {
                    const student = students[index];
                    if (student !== undefined && student !== null) {
                      if (student.key !== '') {
                        updateStudents(student, index);
                      }
                      if (student.key === '') {
                        addNewStudent(student);
                      }
                    }
                    return null;
                  });
                }
              });
            }
          };

          /**
           * Validate email
           */
          const validateEmail = () => {
            const array = [];
            values.students.map((student, index) => {
              array.push(values.students[index].email);
              if (values.students.length === index + 1) {
                const right = hasDuplicates(array);
                callbackAction(right);
              }
              return null;
            });
          };

          validateEmail();
        }}
      >
        {({
          values,
          handleSubmit,
          isSubmitting,
        }) => {
          let content = <CircularProgress />;
          if (!isSubmitting) {
            content = (
              <Form onSubmit={handleSubmit}>
                <p>
                  {`Minimum of ${minStudent} students`}
                </p>
                <Field
                  required
                  name="team_name"
                  label='Name of the team'
                  type="text"
                  component={TextField}
                  style={{ width: '500px' }}
                  index={-1}
                />
                {typeof (team.school_id) !== 'undefined' && teacherId === ''
                && (
                <Field
                  required
                  name="school_id"
                  label="School"
                  options={schools}
                  component={Select}
                />)
                }
                <FieldArray
                  name="students"
                  render={arrayHelpers => (
                    <div>
                      {values.students.map((student, index) => (
                        <div
                          key={index}
                          style={{
                            background: '#E6E6FA',
                            marginBottom: '10px',
                            padding: '10px',
                            paddingLeft: '15px',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p>
                              Student #
                              {index + 1}
                            </p>
                            { values.lengthStudents > minStudent
                              && (
                              <Button style={{ float: 'right' }} type="button" size="small" color="primary" 
                                onClick={() => {
                                  if (values.students[index] && values.students[index].key !== '' ) 
                                  { values.deleteArray.push(values.students[index].key); }
                                  arrayHelpers.remove(index);
                                  values.lengthStudents -= 1;
                                  }}
                                >
                                Delete
                              </Button>
                              )
                            }
                          </div>
                          { values.students[index].key === '' && (
                            <div>
                              <Typography>Require reset of password upon creation</Typography>
                            </div>)
                          }
                          <div>
                            <Field
                              name={`students[${index}].first_name`}
                              required
                              type="text"
                              label="First Name"
                              placeholder="Guang Yao"
                              component={TextField}
                              style={{ marginRight: '50px', width: '200px' }}
                            />
                            <Field
                              name={`students[${index}].last_name`}
                              required
                              type="text"
                              label="Last Name"
                              placeholder="Zhang"
                              component={TextField}
                              style={{ width: '200px' }}
                            />
                          </div>
                          <div>
                            {values.students[index].key !== '' && (
                            <Field
                              disabled
                              name={`students[${index}].email`}
                              type="text"
                              label="Email"
                              component={TextField}
                              style={{ marginRight: '50px', width: '200px' }}
                              required
                            />)
                            }
                            {values.students[index].key === '' && (
                            <Field
                              name={`students[${index}].email`}
                              type="text"
                              label="Email"
                              placeholder="guangyao@gmail.com"
                              component={TextField}
                              style={{ marginRight: '50px', width: '200px' }}
                              required
                            />)
                            }
                          </div>
                          <div>
                            <Field
                              name={`students[${index}].dietary_restriction`}
                              type="text"
                              label="Dietary Restriction"
                              component={TextField}
                              placeholder="Nil / Halal / Vegetarian"
                              style={{ width: '200px', marginRight:'50px' }}
                            />
                            <Field
                              required
                              name={`students[${index}].shirt_size`}
                              type="text"
                              label="Shirt Size"
                              component={TextField}
                              placeholder="XS/S/M/L/XL"
                              style={{ width: '200px', marginRight: '50px' }}
                            />
                          </div>
                          <div>
                            <Field
                              name={`students[${index}].emergency_contact_name`}
                              type="text"
                              required
                              label="Emergency Contact Name"
                              component={TextField}
                              placeholder="Zhang Watt"
                              style={{ marginRight: '50px', width: '200px' }}
                            />
                            <Field
                              name={`students[${index}].emergency_contact_mobile`}
                              type="text"
                              label="Mobile"
                              required
                              component={TextField}
                              placeholder="92130832"
                              style={{ marginRight: '50px', width: '200px' }}
                            />
                            <Field
                              name={`students[${index}].emergency_contact_relation`}
                              type="text"
                              label="Relation"
                              placeholder="Mother"
                              required
                              component={TextField}
                              style={{ width: '200px' }}
                            />
                          </div>
                          <div>
                            <Field
                              name={`students[${index}].remarks`}
                              type="text"
                              label="Remarks"
                              component={TextField}
                              index={index}
                              placeholder="nil"
                              style={{ width: '200px' }}
                            />
                          </div>
                          <div>
                            <ErrorMessage name={`students[${index}].first_name`} />
                            <ErrorMessage name={`students[${index}].last_name`} />
                            <ErrorMessage name={`students[${index}].email`} />
                            <ErrorMessage name={`students[${index}].dietaryrestriction`} />
                            <ErrorMessage name={`students[${index}].shirt_size`} />
                            <ErrorMessage name={`students[${index}].remarks`} />
                            <ErrorMessage name={`students[${index}].emergency_contact_mobile`} />
                            <ErrorMessage name={`students[${index}].emergency_contact_name`} />
                            <ErrorMessage name={`students[${index}].emergency_contact_relation`} />
                          </div>
                        </div>
                      ))}
                      { values.lengthStudents < maxStudent
                      && (
                      <Button
                        type="button"
                        onClick={() => {
                          arrayHelpers.push({
                            first_name: '',
                            last_name: '',
                            email: '',
                            dietary_restriction: '',
                            remarks: '',
                            emergency_contact_name: '',
                            emergency_contact_mobile: '',
                            emergency_contact_relation: '',
                            key:'',
                          });
                          values.lengthStudents += 1;
                        }}
                        size="small"
                        color="primary"
                      >
                        Add Student
                      </Button>)
                      }
                    </div>
                  )}
                />
                <div className="align-right">
                  <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                    Update
                  </Button>
                </div>
              </Form>
            );
          }
          return content;
        }}
      </Formik>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authError: state.auth.authError,
    auth: state.firebase.auth,
    firestore: state.firestore,
    firebase: state.firebase,
    schoolsList: state.firestore.schoolsList,
  };
};

EditTeamForm.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  minStudent: PropTypes.number.isRequired,
  maxStudent: PropTypes.number.isRequired,
  schools: PropTypes.arrayOf(PropTypes.string).isRequired,
  teams: PropTypes.arrayOf(PropTypes.string),
  teamName: PropTypes.string.isRequired,
  studentsEmail: PropTypes.arrayOf(PropTypes.string),
  teacherId: PropTypes.string.isRequired,
  /* eslint-disable react/forbid-prop-types */
  firestore: PropTypes.any.isRequired,
  match: PropTypes.any.isRequired,
  auth: PropTypes.any.isRequired,
  team: PropTypes.any,
  students: PropTypes.any,
  /* eslint-enable */
};

EditTeamForm.defaultProps = {
  team: null,
  students: null,
  teams: null,
  studentsEmail: null,
};


export default compose(
  connect(mapStateToProps),
  withSnackbar,
  firebaseConnect(),
  firestoreConnect(),
  withRouter,
)(EditTeamForm);
