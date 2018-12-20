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
  IconButton,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import * as Yup from 'yup';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes, { number } from 'prop-types';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { withSnackbar } from 'notistack';
import { firebaseConnect } from 'react-redux-firebase';

import TextField from './TextField';
import ErrorMessage from './ErrorMessage';

const createStudent = ({
  firestore,
  enqueueSnackbar,
  match,
  minStudent,
  maxStudent,
}) => (
  <Formik
    initialValues={{
      team_name: '',
      students:[],
    }}
    validationSchema={Yup.object({
      team_name: Yup.string()
        .required('Required'),
      students: Yup.array()
      .of(
        Yup.object().shape({
          firstname: Yup.string()
            .min(1, 'too short')
            .required('First Name Required'), 
          lastname: Yup.string()
            .required('Last Name Required'), 
          phonenumber: Yup.number()
          .required('Phone Number Required'),
          email: Yup.string()
          .email('Invalid email')
          .required('Email Required'), 
          badgename: Yup.string(),
          dietaryrestriction: Yup.string(),
          remarks: Yup.string(),
        })
        )
      .required('Must have members') 
      .min(minStudent, `Minimum of ${minStudent} member`)
    })}
    onSubmit={(values, {resetForm, setSubmitting}) => {
      
      const eventuid = match.params.id;
      var teamRef = firestore.collection("events").doc(eventuid).collection("teams");
      var query = teamRef.where("team_name","==", `${values.team_name}`);
      var students = values.students;
      query.get().then(querySnapshot => {
          if (querySnapshot.empty == false){
            const teamuid = querySnapshot.docs[0].id;
            for (var i = 0; i < students.length; i++) {
              firestore.collection("events").doc(eventuid).collection("teams").doc(teamuid).collection("students").add({
                first_name: students[i]['firstname'],
                last_name: students[i]['lastname'],
                phone_number: students[i]['phonenumber'],
                email: students[i]['email'],
                badge_name: students[i]['badgename'],
                dietary_restriction: students[i]['dietaryrestriction'],
                remarks: students[i]['remarks'],
              }).then(()=>{
                enqueueSnackbar('Added 1 student...', {
                  variant: 'info',
                });
                resetForm();
                setSubmitting(false);
                if (i == students.length){
                  enqueueSnackbar('Students Added Successfully', {
                    variant: 'success',
                  });
                }
              })
            }
          }
          else{
            firestore.collection("events").doc(match.params.id).collection("teams").add({
              team_name: values.team_name,
              credit:0,
              
            }).then((docRef)=>{
              enqueueSnackbar('Added Team...', {
                variant: 'info',
              });
              for (var i = 0; i < students.length; i++) {
                firestore.collection("events").doc(match.params.id).collection("teams").doc(docRef.id).collection("students").add({
                  first_name: students[i]['firstname'],
                  last_name: students[i]['lastname'],
                  phone_number: students[i]['phonenumber'],
                  email: students[i]['email'],
                  badge_name: students[i]['badgename'],
                  dietary_restriction: students[i]['dietaryrestriction'],
                  remarks: students[i]['remarks'],
                }).then(()=>{
                  enqueueSnackbar('Added 1 student...', {
                    variant: 'info',
                  });
                  resetForm();
                  setSubmitting(false);
                  if (i == students.length){
                    enqueueSnackbar('Team Created Successfully', {
                      variant: 'success',
                    });
                  }
                })
              }
            })    
          }
        }
      )}}
  >
    {({
      values,
      handleSubmit,
      isSubmitting,
      errors,
      touched,
    }) => {
      let content = <CircularProgress />;
      if (!isSubmitting) {
        content = (
          <Form onSubmit={handleSubmit}>
            <p>Minimum of {minStudent} students</p>
            <Field
              required
              name="team_name"
              label="Name of the new team or existing team (Cap-Sensitive)"
              type="text"
              component={TextField}
              style={{width:'500px'}}
              index = {-1}
            />
            <FieldArray
              name="students"
              render={arrayHelpers => (
                <div>
                  {values.students.map((students,index) => (
                    <div key={index} style={{background:'#E6E6FA', paddingLeft:'10px'}}>
                      <p>Student #{index+1}</p>
                      <div>
                      <Field
                      name={`students[${index}].firstname`}
                      required
                      type="text"
                      label="First Name"
                      component={TextField}
                      style={{paddingRight:'50px'}}
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
                      style={{paddingRight:'50px'}}
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
                      style={{paddingRight:'50px'}}
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
                      name={`students[${index}].remarks`}
                      type="text"
                      label="Remarks"
                      component={TextField}
                      index={index}
                      />
                      </div>
                      <div>
                      <ErrorMessage name={`students[${index}].firstname`}/>
                      <ErrorMessage name={`students[${index}].lastname`}/>
                      <ErrorMessage name={`students[${index}].phonenumber`}/>
                      <ErrorMessage name={`students[${index}].email`}/>
                      <ErrorMessage name={`students[${index}].badgename`}/>
                      <ErrorMessage name={`students[${index}].dietaryrestriction`}/>
                      <ErrorMessage name={`students[${index}].remarks`}/>
                      </div>
                      <IconButton type="button" onClick={() => arrayHelpers.remove(index)}>
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                    </div>
                  ))}
                  <IconButton
                    type="button"
                    onClick={() => {arrayHelpers.push({firstname:''})}}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
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

const mapStateToProps = state => ({
  authError: state.auth.authError,
  auth: state.firebase.auth,
  firestore: state.firestore,
  firebase: state.firebase,
});

createStudent.defaultProps = {
  authError: '',
};

export default compose(
  connect(mapStateToProps),
  withSnackbar, 
  firebaseConnect(),
  firestoreConnect(),
  withRouter,
)(createStudent);
