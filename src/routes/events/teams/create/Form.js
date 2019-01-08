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

import TextField from './TextField';
import ErrorMessage from './ErrorMessage';
import Select from '../../../../components/UI/Select/Select';
import yup from '../../../../instances/yup';

const createTeam = ({
  firestore,
  enqueueSnackbar,
  match,
  minStudent,
  schools,
  teacherId,
}) => (
  <Formik
    initialValues={{
      team_name: '',
      students: Array.apply(null, Array(minStudent)).map(function () {return;}),
      schools,
    }}
    validationSchema={yup.object({
      team_name: yup.string()
        .required('Required'),
      students: yup.array()
        .of(
          yup.object().shape({
            firstname: yup.string()
              .min(1, 'too short')
              .required('First Name Required'),
            lastname: yup.string()
              .required('Last Name Required'),
            phonenumber: yup.number()
              .required('Phone Number Required'),
            email: yup.string()
              .email('Invalid email')
              .required('Email Required'),
            badgename: yup.string(),
            dietaryrestriction: yup.string(),
            remarks: yup.string(),
          }),
        )
        .required('Must have members')
        .min(minStudent, `Minimum of ${minStudent} member`),
    })}
    onSubmit={(values, { resetForm, setSubmitting }) => {
      const eventuid = match.params.id;
      var students = values.students;
      firestore.collection('events').doc(match.params.id).collection('teams').add({
        team_name: values.team_name,
        school_id: values.school_id.value,
        credit: 0,
        created_At: new Date(Date.now()),
        modified_At: new Date(Date.now()),
        teacher_id: teacherId,
      }).then((docRef) => {
        enqueueSnackbar('Added Team...', {
          variant: 'info',
        });
        students.map((student,index) => {
          return firestore.collection('events').doc(eventuid).collection('students').add({
            team_id: docRef.id,
            first_name: students[index].firstname,
            last_name: students[index].lastname,
            mobile: students[index].phonenumber,
            email: students[index].email,
            badge_name: students[index].badgename,
            dietary_restriction: students[index].dietaryrestriction,
            remarks: students[index].remarks,
            emergency_contacts: {
              name: students[index].emergency_contact_name,
              mobile: students[index].emergency_contact_mobile,
              relation: students[index].emergency_contact_relation,
            },
            created_At: new Date(Date.now()),
            modified_At: new Date(Date.now()),
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
              Minimum of 
              {minStudent}
              students
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
            <Field
              name="school_id"
              label="School"
              options={schools}
              component={Select}
            />
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
                        <Button style={{ float: 'right' }} type="button" size="small" color="primary" onClick={() => arrayHelpers.remove(index)}>
                          Delete
                        </Button>
                      </div>
                      <div>
                        <Field
                          name={`students[${index}].firstname`}
                          required
                          type="text"
                          label="First Name"
                          component={TextField}
                          style={{ paddingRight: '50px' }}
                        />
                        <Field
                          name={`students[${index}].lastname`}
                          required
                          type="text"
                          label="Last Name"
                          component={TextField}
                        />
                      </div>
                      <div>
                        <Field
                          name={`students[${index}].email`}
                          type="text"
                          label="Email"
                          component={TextField}
                          style={{ paddingRight: '50px' }}
                          required
                        />
                        <Field
                          name={`students[${index}].phonenumber`}
                          type="text"
                          label="Phone Number"
                          component={TextField}
                          required
                        />
                      </div>
                      <div>
                        <Field
                          name={`students[${index}].badgename`}
                          type="text"
                          label="Badge Name"
                          component={TextField}
                          style={{ paddingRight: '50px' }}
                        />
                        <Field
                          name={`students[${index}].dietaryrestriction`}
                          type="text"
                          label="Dietary Restriction"
                          component={TextField}
                        />
                      </div>
                      <div>
                        <Field
                          name={`students[${index}].emergency_contact_name`}
                          type="text"
                          label="Emergency Contact Name"
                          component={TextField}
                          style={{ paddingRight: '50px' }}
                        />
                        <Field
                          name={`students[${index}].emergency_contact_mobile`}
                          type="text"
                          label="Mobile"
                          component={TextField}
                          style={{ paddingRight: '50px' }}
                        />
                        <Field
                          name={`students[${index}].emergency_contact_relation`}
                          type="text"
                          label="Relation"
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
                        <ErrorMessage name={`students[${index}].firstname`} />
                        <ErrorMessage name={`students[${index}].lastname`} />
                        <ErrorMessage name={`students[${index}].phonenumber`} />
                        <ErrorMessage name={`students[${index}].email`} />
                        <ErrorMessage name={`students[${index}].badgename`} />
                        <ErrorMessage name={`students[${index}].dietaryrestriction`} />
                        <ErrorMessage name={`students[${index}].remarks`} />
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() => { arrayHelpers.push({ firstname: '' }); }}
                    size="small"
                    color="primary"
                  >
                    Add Student
                  </Button>
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

createTeam.defaultProps = {
  authError: '',
};

export default compose(
  connect(mapStateToProps),
  withSnackbar,
  firebaseConnect(),
  firestoreConnect(),
  withRouter,
)(createTeam);
