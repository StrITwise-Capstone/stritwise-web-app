import React from 'react';
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
    lengthStudents: minStudent,
  };
};

// validationSchema for team object
const validationSchema = (minStudent, teams, teamName) => {
  return yup.object({
    team_name: yup.string()
      .required('Required')
      .test('team name', 'There is an existing team name', value => value && ((value === teamName) || !(teams.indexOf(value) > -1))),
    students: yup.array()
      .of(
        yup.object().shape({
          first_name: yup.string()
            .min(1, 'too short')
            .required('First Name Required'),
          last_name: yup.string()
            .required('Last Name Required'),
          mobile: yup.number('Invalid Mobile Number')
            .required('Mobile Number Required')
            .max(99999999,'Phone number is too long')
            .min(9999999, 'Phone number is too short')
            .typeError('Invalid Phone Number'),
          email: yup.string()
            .email('Invalid email')
            .required('Email Required'),
          badgename: yup.string(),
          dietaryrestriction: yup.string(),
          remarks: yup.string(),
          emergency_contact_name: yup.string(),
          emergency_contact_mobile: yup.number('Invalid Mobile Number')
            .typeError('Invalid Phone Number')
            .max(99999999, 'Phone number is too long')
            .min(9999999, 'Phone number is too short'),
          emergency_contact_relation: yup.string(),
        }),
      )
      .required('Must have members')
      .min(minStudent, `Minimum of ${minStudent} member`),
  });
};

/**
 * Class representing the EditTeamForm component.
 * @param {Object[]} schools - An array of objects containing school name and Id
 * @param {Object} team - A team document
 * @param {Object} students - An array of student object
 * @param {Number} minStudent - A number of minimum students for the team
 * @param {Number} maxStudent - A number of maximum students for the team
 * @param {Function} updatePage - A function to refresh the page
 * @param {Object[]} teams - An array of string which are team names
 */
const EditTeamForm = ({
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
}) => (
  <Formik
    enableReinitialize={true}
    initialValues={initialValues(team, minStudent, students)}
    validationSchema={validationSchema(minStudent, teams, teamName)}
    onSubmit={(values, { resetForm, setSubmitting }) => {
      const { eventId, teamId } = match.params;
      const { students, deleteArray } = values;

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
      const updateStudents = (student, index) => {
        return firestore.collection('events').doc(eventId).collection('students').doc(student.key).update({
          first_name: student.first_name,
          last_name: student.last_name,
          mobile: student.mobile,
          email: student.email,
          badge_name: student.badge_name ? student.badge_name : '',
          dietary_restriction: student.dietary_restriction ? student.dietary_restriction : '',
          remarks: student.remarks ? student.remarks : '',
          emergency_contacts: {
            name: student.emergency_contact_name,
            mobile: student.emergency_contact_mobile,
            relation: student.emergency_contact_relation,
          },
          modified_at: new Date(Date.now()),
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
      };

      /**
      * Add all the new students in the current team
      */
      const addNewStudent = (student) => {
        const data = {
          team_id: teamId,
          first_name: student.first_name,
          last_name: student.last_name,
          mobile: student.mobile,
          email: student.email,
          password: 'Test1234',
          badge_name: student.badgename ? student.badgename : '',
          dietary_restriction: student.dietaryrestriction ? student.dietaryrestriction : '',
          remarks: student.remarks ? student.remarks : '',
          emergency_contacts: {
            name: student.emergency_contact_name,
            mobile: student.emergency_contact_mobile,
            relation: student.emergency_contact_relation,
          },
          created_at: new Date(Date.now()),
          modified_at: new Date(Date.now()),
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
          resetForm();
          setSubmitting(false);
        });
      }

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
              label="Name of team"
              type="text"
              component={TextField}
              style={{ width: '500px' }}
              index={-1}
            />
            {typeof (team.school_id) !== undefined
            && (
            <Field
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
                        { index + 1 > minStudent &&
                          (
                          <Button style={{ float: 'right' }} type="button" size="small" color="primary" onClick={() => {arrayHelpers.remove(index); if(students[index] && students[index].key) {values.deleteArray.push(students[index].key);} values.lengthStudents = values.lengthStudents -1; }}>
                            Delete
                          </Button>
                          )
                        }
                      </div>
                      { !students[index] && (
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
                          component={TextField}
                          style={{ marginRight: '50px', width: '200px' }}
                        />
                        <Field
                          name={`students[${index}].last_name`}
                          required
                          type="text"
                          label="Last Name"
                          component={TextField}
                          style={{ width: '200px' }}
                        />
                      </div>
                      <div>
                        {students[index] && (
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
                        {!students[index] && (
                        <Field
                          name={`students[${index}].email`}
                          type="text"
                          label="Email"
                          component={TextField}
                          style={{ marginRight: '50px', width: '200px' }}
                          required
                        />)
                        }
                        <Field
                          name={`students[${index}].mobile`}
                          type="text"
                          label="Phone Number"
                          component={TextField}
                          required
                          style={{ width: '200px' }}
                        />
                      </div>
                      <div>
                        <Field
                          name={`students[${index}].badge_name`}
                          type="text"
                          label="Badge Name"
                          component={TextField}
                          style={{ marginRight: '50px' , width: '200px' }}
                        />
                        <Field
                          name={`students[${index}].dietary_restriction`}
                          type="text"
                          label="Dietary Restriction"
                          component={TextField}
                          style={{ width: '200px' }}
                        />
                      </div>
                      <div>
                        <Field
                          name={`students[${index}].emergency_contact_name`}
                          type="text"
                          required
                          label="Emergency Contact Name"
                          component={TextField}
                          style={{ marginRight: '50px' , width: '200px'}}
                        />
                        <Field
                          name={`students[${index}].emergency_contact_mobile`}
                          type="text"
                          label="Mobile"
                          required
                          component={TextField}
                          style={{ marginRight: '50px', width: '200px' }}
                        />
                        <Field
                          name={`students[${index}].emergency_contact_relation`}
                          type="text"
                          label="Relation"
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
                          style={{ width: '200px' }}
                        />
                      </div>
                      <div>
                        <ErrorMessage name={`students[${index}].first_name`} />
                        <ErrorMessage name={`students[${index}].last_name`} />
                        <ErrorMessage name={`students[${index}].mobile`} />
                        <ErrorMessage name={`students[${index}].email`} />
                        <ErrorMessage name={`students[${index}].badge_name`} />
                        <ErrorMessage name={`students[${index}].dietaryrestriction`} />
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
                      arrayHelpers.push({ key: '' }); 
                      values.lengthStudents = values.lengthStudents + 1;
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
)

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
}


export default compose(
  connect(mapStateToProps),
  withSnackbar,
  firebaseConnect(),
  firestoreConnect(),
  withRouter,
)(EditTeamForm);
