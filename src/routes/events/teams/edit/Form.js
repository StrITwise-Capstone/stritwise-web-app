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

const editTeam = ({
  firestore,
  enqueueSnackbar,
  match,
  minStudent,
  schools,
  team,
  students,
  refreshState,
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
            mobile: yup.number()
              .required('Phone Number Required')
              .positive('Phone number is invalid.'),
            email: yup.string()
              .email('Invalid email')
              .required('Email Required'),
            badge_name: yup.string(),
            dietary_restriction: yup.string(),
            remarks: yup.string(),
            emergency_contact_mobile: yup.number(),
            emergency_contact_name: yup.string('Invalid format for Emergency Contact Name'),
            emergency_contact_relation: yup.string('Invalid format for Emergency Contact Relation'),
          }),
        )
        .required('Must have members')
        .min(minStudent, `Minimum of ${minStudent} member`),
    })}
    onSubmit={(values, { resetForm, setSubmitting }) => {
      const eventuid = match.params.id;
      var students = values.students;
      var deleteArray = values.deleteArray;
      deleteArray.map((student, index) => firestore.collection('events').doc(match.params.id).collection('students').doc(deleteArray[index]).delete());
      firestore.collection('events').doc(match.params.id).collection('teams').doc(match.params.teamid).update({
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
                  badge_name: students[index].badge_name,
                  dietary_restriction: students[index].dietary_restriction,
                  remarks: students[index].remarks,
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
              return firestore.collection('events').doc(eventuid).collection('students').add({
                team_id: match.params.teamid,
                first_name: students[index].first_name,
                last_name: students[index].last_name,
                mobile: students[index].mobile,
                email: students[index].email,
                badge_name: students[index].badge_name,
                dietary_restriction: students[index].dietary_restriction,
                remarks: students[index].remarks,
                emergency_contacts: {
                  name: students[index].emergency_contact_name,
                  mobile: students[index].emergency_contact_mobile,
                  relation: students[index].emergency_contact_relation,
                },
                modified_at: new Date(Date.now()),
              }).then(() => {
                enqueueSnackbar('Added 1 student...', {
                  variant: 'info',
                });
                resetForm();
                setSubmitting(false);
                if (index === students.length) {
                  enqueueSnackbar('Team Updated Successfully', {
                    variant: 'success',
                  });
                }
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
                        <Button style={{ float: 'right' }} type="button" size="small" color="primary" onClick={() => { arrayHelpers.remove(index); values.deleteArray.push(students[index].key); }}>
                          Delete
                        </Button>
                      </div>
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
                        <Field
                          name={`students[${index}].email`}
                          type="text"
                          label="Email"
                          component={TextField}
                          style={{ paddingRight: '50px' }}
                          required
                        />
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
                        <ErrorMessage name={`students[${index}].first_name`} />
                        <ErrorMessage name={`students[${index}].last_name`} />
                        <ErrorMessage name={`students[${index}].mobile`} />
                        <ErrorMessage name={`students[${index}].email`} />
                        <ErrorMessage name={`students[${index}].badge_name`} />
                        <ErrorMessage name={`students[${index}].dietary_restriction`} />
                        <ErrorMessage name={`students[${index}].remarks`} />
                        <ErrorMessage name={`students[${index}].emergency_contact_name`} />
                        <ErrorMessage name={`students[${index}].emergency_contact_mobile`} />
                        <ErrorMessage name={`students[${index}].emergency_contact_relation`} />
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() => { arrayHelpers.push({ key: '' }); }}
                    size="small"
                    color="primary"
                  >
                   Add
                  </Button>
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

editTeam.defaultProps = {
  authError: '',
};

export default compose(
  connect(mapStateToProps),
  withSnackbar,
  firebaseConnect(),
  firestoreConnect(),
  withRouter,
)(editTeam);
