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

import TextField from './TextField';
import ErrorMessage from '../../../../components/UI/ErrorMessage/ErrorMessage';
import Select from '../../../../components/UI/Select/Select';
import yup from '../../../../instances/yup';

const editTeam = ({
  firestore,
  enqueueSnackbar,
  match,
  minStudent,
  schools,
  team,
  students,
  refreshState,
  maxStudent,
  auth,
}) => (
  <Formik
    enableReinitialize={true}
    initialValues={{
      team_name: team.team_name,
      students,
      school_id: {
        label: `${team.school_name}`,
        value: team.school_id,
      },
      deleteArray: [],
      lengthStudents: minStudent,
    }}
    validationSchema={yup.object({
      team_name: yup.string()
        .required('Required'),
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
              .max(99999999,'Phone number is too long')
              .min(9999999, 'Phone number is too short'),
            emergency_contact_relation: yup.string(),
          }),
        )
        .required('Must have members')
        .min(minStudent, `Minimum of ${minStudent} member`),
    })}
    onSubmit={(values, { resetForm, setSubmitting }) => {
      const eventuid = match.params.id;
      const teamId = match.params.teamid;
      var students = values.students;
      var deleteArray = values.deleteArray;
      deleteArray.map((student, index) => firestore.collection('events').doc(match.params.id).collection('students').doc(deleteArray[index]).delete());
      firestore.collection('events').doc(match.params.id).collection('teams').doc(teamId).update({
        team_name: values.team_name,
        school_id: values.school_id.value,
        credit: 0,
        modified_at: new Date(Date.now()),
      }).then((docRef) => {
        enqueueSnackbar('Updated Team...', {
          variant: 'info',
        });
        if (students) {
          students.map((student, index) => {
            if (students[index] !== undefined && students[index] !== null) {
              if (students[index].key !== '') {
                return firestore.collection('events').doc(eventuid).collection('students').doc(students[index].key).update({
                  first_name: students[index].first_name,
                  last_name: students[index].last_name,
                  mobile: students[index].mobile,
                  email: students[index].email,
                  badge_name: students[index].badge_name ? students[index].badge_name : '',
                  dietary_restriction: students[index].dietary_restriction ? students[index].dietary_restriction : '',
                  remarks: students[index].remarks ? students[index].remarks : '',
                  emergency_contacts: {
                    name: students[index].emergency_contact_name,
                    mobile: students[index].emergency_contact_mobile,
                    relation: students[index].emergency_contact_relation,
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
                    refreshState();
                  }
                  refreshState();
                });
              }
            }
            if (students[index].key === '') {
              const data = {
                team_id: teamId,
                first_name: students[index].first_name,
                last_name: students[index].last_name,
                mobile: students[index].mobile,
                email: students[index].email,
                password: 'Test1234',
                badge_name: students[index].badgename ? students[index].badgename : '',
                dietary_restriction: students[index].dietaryrestriction ? students[index].dietaryrestriction : '',
                remarks: students[index].remarks ? students[index].remarks : '',
                emergency_contacts: {
                  name: students[index].emergency_contact_name,
                  mobile: students[index].emergency_contact_mobile,
                  relation: students[index].emergency_contact_relation,
                },
                created_at: new Date(Date.now()),
                modified_at: new Date(Date.now()),
              }
              data.eventId = eventuid;
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
            return null;
          });
        }
        return null;
      });
    }
    }
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
                        { values.lengthStudents > minStudent &&
                          (
                          <Button style={{ float: 'right' }} type="button" size="small" color="primary" onClick={() => {arrayHelpers.remove(index); values.lengthStudents = values.lengthStudents -1; }}>
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
                          style={{ paddingRight: '50px' }}
                        />
                        <Field
                          name={`students[${index}].last_name`}
                          required
                          type="text"
                          label="Last Name"
                          component={TextField}
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
                          style={{ paddingRight: '50px' }}
                          required
                        />)
                        }
                        {!students[index] && (
                        <Field
                          name={`students[${index}].email`}
                          type="text"
                          label="Email"
                          component={TextField}
                          style={{ paddingRight: '50px' }}
                          required
                        />)
                        }
                        <Field
                          name={`students[${index}].mobile`}
                          type="text"
                          label="Phone Number"
                          component={TextField}
                          required
                        />
                      </div>
                      <div>
                        <Field
                          name={`students[${index}].badge_name`}
                          type="text"
                          label="Badge Name"
                          component={TextField}
                          style={{ paddingRight: '50px' }}
                        />
                        <Field
                          name={`students[${index}].dietary_restriction`}
                          type="text"
                          label="Dietary Restriction"
                          component={TextField}
                        />
                      </div>
                      <div>
                        <Field
                          name={`students[${index}].emergency_contact_name`}
                          type="text"
                          required
                          label="Emergency Contact Name"
                          component={TextField}
                          style={{ paddingRight: '50px' }}
                        />
                        <Field
                          name={`students[${index}].emergency_contact_mobile`}
                          type="text"
                          label="Mobile"r
                          required
                          component={TextField}
                          style={{ paddingRight: '50px' }}
                        />
                        <Field
                          name={`students[${index}].emergency_contact_relation`}
                          type="text"
                          label="Relation"
                          required
                          component={TextField}
                        />
                      </div>
                      <div>
                        <Field
                          name={`students[${index}].remarks`}
                          type="text"
                          label="Remarks"
                          component={TextField}
                          index={index}
                        />
                      </div>
                      <div>
                        <ErrorMessage name={`students[${index}].first_name`} />
                        <ErrorMessage name={`students[${index}].last_name`} />
                        <ErrorMessage name={`students[${index}].mobile`} />
                        <ErrorMessage name={`students[${index}].email`} />
                        <ErrorMessage name={`students[${index}].badgename`} />
                        <ErrorMessage name={`students[${index}].dietaryrestriction`} />
                        <ErrorMessage name={`students[${index}].remarks`} />
                        <ErrorMessage name={`students[${index}].emergency_contact_mobile`} />
                        <ErrorMessage name={`students[${index}].emergency_contact_name`} />
                        <ErrorMessage name={`students[${index}].emergency_contact_relation`} />
                      </div>
                    </div>
                  ))}
                  { values.lengthStudents < maxStudent && (<Button
                    type="button"
                    onClick={() => { arrayHelpers.push({ key: '' }); values.lengthStudents = values.lengthStudents + 1;}}
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

const mapStateToProps = (state) => {
  return {
    authError: state.auth.authError,
    auth: state.firebase.auth,
    firestore: state.firestore,
    firebase: state.firebase,
    schoolsList: state.firestore.schoolsList,
  };
};

editTeam.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  minStudent: PropTypes.number.isRequired,
  maxStudent: PropTypes.number.isRequired,
  schools: PropTypes.arrayOf(PropTypes.string).isRequired,
  /* eslint-disable react/forbid-prop-types */
  firestore: PropTypes.any.isRequired,
  match: PropTypes.any.isRequired,

  /* eslint-enable */
};


export default compose(
  connect(mapStateToProps),
  withSnackbar,
  firebaseConnect(),
  firestoreConnect(),
  withRouter,
)(editTeam);
