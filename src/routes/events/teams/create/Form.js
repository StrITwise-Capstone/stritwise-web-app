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

const createTeam = ({
  firestore,
  enqueueSnackbar,
  match,
  minStudent,
  maxStudent,
  schools,
  teacherId,
  schoolId,
}) => (
  <Formik
    initialValues={{
      team_name: '',
      students: Array.apply(null, Array(minStudent)).map(function () {return null;}),
      schools,
      teacherId: teacherId ? teacherId : 'null',
      lengthStudents: minStudent,
      schoolId: schoolId ? schoolId : '',
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
            mobilenumber: yup.number('Invalid Mobile Number')
              .required('Mobile Number Required')
              .typeError('Invalid Phone Number')
              .max(99999999,'Phone number is too long')
              .min(9999999, 'Phone number is too short'),
            email: yup.string()
              .email('Invalid email')
              .required('Email Required'),
            password: yup.string()
              .required('Password Required')
              .test('password', 'Password should contain at least 1 digit, 1 lower case, 1 upper case and at least 8 characters', value => value && /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(value)),
            confirmPassword: yup.string()
              .required('Confirm Password Required')
              .oneOf([yup.ref('password')], 'Passwords do not match')
              .test('password', 'Password should contain at least 1 digit, 1 lower case, 1 upper case and at least 8 characters', value => value && /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(value)),
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
      let schoolValue = '';
      if (schoolId !== '') {
        schoolValue = schoolId;
      } else {
        schoolValue = values.school_id.value;
      }
      const eventuid = match.params.id;
      const { students } = values;
      firestore.collection('events').doc(match.params.id).collection('teams').add({
        team_name: values.team_name,
        school_id: schoolValue,
        credit: 0,
        created_at: new Date(Date.now()),
        modified_at: new Date(Date.now()),
        teacher_id: teacherId,
      }).then((docRef) => {
        enqueueSnackbar('Added Team...', {
          variant: 'info',
        });
        students.map((student, index) => {
          return firestore.collection('events').doc(eventuid).collection('students').add({
            team_id: docRef.id,
            first_name: students[index].first_name,
            last_name: students[index].last_name,
            mobile: students[index].mobilenumber,
            email: students[index].email,
            password: students[index].password,
            badge_name: students[index].badgename,
            dietary_restriction: students[index].dietaryrestriction,
            remarks: students[index].remarks,
            emergency_contacts: {
              name: students[index].emergency_contact_name,
              mobile: students[index].emergency_contact_mobile,
              relation: students[index].emergency_contact_relation,
            },
            created_at: new Date(Date.now()),
            modified_at: new Date(Date.now()),
          }).then(() => {
            enqueueSnackbar('Added 1 student...', {
              variant: 'info',
            });
            resetForm();
            setSubmitting(false);
            if (index === students.length) {
              enqueueSnackbar('Team Created Successfully', {
                variant: 'success',
              });
            }
          });
        });
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
            {schoolId === '' && (
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
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                      >
                        <p>
                          Student #
                          {index + 1}
                        </p>
                        { values.lengthStudents > minStudent &&
                        (<Button style={{ float: 'right' }} type="button" size="small" color="primary" onClick={() => {arrayHelpers.remove(index); values.lengthStudents = values.lengthStudents -1; }}>
                          Delete
                        </Button>)
                        }
                      </div>
                      <div>
                        <Field
                          name={`students[${index}].first_name`}
                          required
                          type="text"
                          label="First Name"
                          placeholder="Guang Yao"
                          component={TextField}
                          style={{ paddingRight: '50px' }}
                        />
                        <Field
                          name={`students[${index}].last_name`}
                          required
                          type="text"
                          placeholder="Zeng"
                          label="Last Name"
                          component={TextField}
                        />
                      </div>
                      <div>
                        <Field
                          name={`students[${index}].email`}
                          type="text"
                          label="Email"
                          placeholder="guangyao@gmail.com"
                          component={TextField}
                          style={{ paddingRight: '50px' }}
                          required
                        />
                        <Field
                          name={`students[${index}].mobilenumber`}
                          type="text"
                          label="Mobile Number"
                          placeholder="98745123"
                          component={TextField}
                          required
                        />
                      </div>
                      <div>
                        <Field
                            name={`students[${index}].password`}
                            type="password"
                            label="Password"
                            placeholder="Test1234"
                            component={TextField}
                            style={{ paddingRight: '50px' }}
                            required
                        />
                        <Field
                            name={`students[${index}].confirmPassword`}
                            type="password"
                            label="Confirm Password"
                            placeholder="Test1234"
                            component={TextField}
                            style={{ paddingRight: '50px' }}
                            required
                        />
                      </div>
                      <div>
                        <Field
                          name={`students[${index}].badgename`}
                          type="text"
                          label="Badge Name"
                          placeholder="GuangYao"
                          component={TextField}
                          style={{ paddingRight: '50px' }}
                        />
                        <Field
                          name={`students[${index}].dietaryrestriction`}
                          type="text"
                          label="Dietary Restriction"
                          placeholder="Nil / Halal / Vegetarian"
                          component={TextField}
                        />
                      </div>
                      <div>
                        <Field
                          name={`students[${index}].emergency_contact_name`}
                          type="text"
                          label="Emergency Contact Name"
                          placeholder="Zhang Melvin"
                          component={TextField}
                          style={{ paddingRight: '50px' }}
                        />
                        <Field
                          name={`students[${index}].emergency_contact_mobile`}
                          type="text"
                          label="Mobile"
                          placeholder="98745123"
                          component={TextField}
                          style={{ paddingRight: '50px' }}
                        />
                        <Field
                          name={`students[${index}].emergency_contact_relation`}
                          type="text"
                          placeholder="Father"
                          label="Relation"
                          component={TextField}
                        />
                      </div>
                      <div>
                        <Field
                          name={`students[${index}].remarks`}
                          type="text"
                          label="Remarks"
                          placeholder="Nil"
                          component={TextField}
                          index={index}
                        />
                      </div>
                      <div>
                        <ErrorMessage name={`students[${index}].first_name`} />
                        <ErrorMessage name={`students[${index}].last_name`} />
                        <ErrorMessage name={`students[${index}].mobilenumber`} />
                        <ErrorMessage name={`students[${index}].email`} />
                        <ErrorMessage name={`students[${index}].password`} />
                        <ErrorMessage name={`students[${index}].confirmPassword`} />
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
                    onClick={() => { arrayHelpers.push({ first_name: '' }); values.lengthStudents = values.lengthStudents + 1;}}
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
                CREATE TEAM
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
  }
};

createTeam.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  minStudent: PropTypes.number.isRequired,
  maxStudent: PropTypes.number.isRequired,
  teacherId: PropTypes.string,
  schoolId: PropTypes.string,
  /* eslint-disable react/forbid-prop-types */
  firestore: PropTypes.any.isRequired,
  match: PropTypes.any.isRequired,
  schools: PropTypes.any,
  /* eslint-enable */
};

createTeam.defaultProps = {
  teacherId: '',
  schoolId: '',
  schools: null,
};

export default compose(
  connect(mapStateToProps),
  withSnackbar,
  firebaseConnect(),
  firestoreConnect(),
  withRouter,
)(createTeam);
