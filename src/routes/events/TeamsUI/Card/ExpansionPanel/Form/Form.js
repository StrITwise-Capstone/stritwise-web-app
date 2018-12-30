import React from 'react';
import {
  Formik,
  Form,
  Field,
} from 'formik';
import {
  Button,
  CircularProgress,
  MenuItem,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { withSnackbar } from 'notistack';

import TextField from '../../../../../../components/UI/TextField/TextField';
import Dropdown from '../../../../../../components/UI/Dropdown/Dropdown';
import DeleteButton from './DeleteButton/DeleteButton';
import yup from '../../../../../../instances/yup';

const editStudent = ({
  auth,
  firestore,
  enqueueSnackbar,
  student,
  studentuid,
  eventuid,
  teamuid,
  deletevalue,
  school,
  schoolsList,
}) => (
  <Formik
    enableReinitialize={true}
    initialValues={{
        firstname: student.first_name,
        lastname: student.last_name,
        badgename: student.badge_name,
        dietary_restriction: student.dietary_restriction,
        remarks: student.remarks,
        email: student.email,
        mobile : student.mobile,
        studentuid: studentuid,
        eventuid: eventuid,
        school: school ? school.name : '',
        schools: schoolsList ? schoolsList : null,
        teamuid: teamuid,
        deletevalue: deletevalue,
        emergency_contact_name: student.emergency_contacts ? student.emergency_contacts['name']: null,
        emergency_contact_mobile: student.emergency_contacts ? student.emergency_contacts['mobile'] : null,
        emergency_contact_relation: student.emergency_contacts ? student.emergency_contacts['relation'] : null,
    }}
    validationSchema={yup.object({
      firstname: yup.string()
        .required('Required'),
      lastname: yup.string()
        .required('Required'),
      badge_name: yup.string(),
      email: yup.string().email("Email is not valid"),
    })}
    onSubmit={(values, { setSubmitting }) => {
      var schoolRef = firestore.collection("schools");
      var schoolQuery = schoolRef.where("name",'==',`${values.school}`);
      schoolQuery.get().then((querySnapshot) =>{
        var school_id = '';
        querySnapshot.forEach((docRef)=>{
          school_id = docRef.id;
        })
      firestore.collection('events').doc(eventuid).collection('students').doc(studentuid).update({
          school_id: school_id,
          first_name: values.firstname,
          last_name: values.lastname,
          badge_name: values.badgename,
          mobile: values.mobile,
          dietary_restriction: values.dietary_restriction,
          remarks: values.remarks,
          email: values.email,
      }).then(() => {
          enqueueSnackbar('Student Updated',{
              variant: 'success',
          })
          setSubmitting(false);
      }).catch((err) => {
          enqueueSnackbar('Student Not Updated', {
              variant: 'error',
          });
          console.log(err);
          setSubmitting(false);
      });
     });
      }}
  >
    {({
      handleSubmit,
      isSubmitting,
      initialValues,
    }) => {
      let content = <CircularProgress />;
      if (!isSubmitting) {
        content = (
          <Form onSubmit={handleSubmit}  style={{width:"550px"}}>
            <Field
              required
              name="firstname"
              label="First Name"
              type="text"
              component={TextField}
            />
            <Field
              required
              name="lastname"
              label="Last Name"
              type="text"
              component={TextField}
            />
            <Field
              required
              name="email"
              label="Email"
              type="text"
              component={TextField}
            />
            <Field
              required
              name="mobile"
              label="Phone Number"
              type="text"
              component={TextField}
            />
            <Field
              required
              name="badgename"
              label="Badge Name"
              type="text"
              component={TextField}
            />
            <Field
              required
              name="school"
              label="School"
              children={initialValues.schools ? Object.keys(initialValues.schools).map(id => {
                return <MenuItem key={id} value={initialValues.schools[id].name}>{initialValues.schools[id].name}</MenuItem>
              }) : null}
              component={Dropdown}
            />
            <Field
              required
              name="dietary_restriction"
              label="Dietary Restriction"
              type="text"
              component={TextField}
            />
            <Field
              required
              name="emergency_contact_name"
              label="Emergency Contact Name"
              type="text"
              component={TextField}
            />
            <Field
              required
              name="emergency_contact_mobile"
              label="Emergency Contact Mobile Number"
              type="text"
              component={TextField}
            />
            <Field
              required
              name="emergency_contact_relation"
              label="Emergency Contact Relation"
              type="text"
              component={TextField}
            />
            <Field
              required
              name="remarks"
              label="Remarks"
              type="text"
              component={TextField}
            />
            <div className="align-right">
                {<Button type="submit" color="primary">Update</Button>}
            </div>
            <div className="align-right">
                {initialValues.deletevalue && <DeleteButton teamuid={initialValues.teamuid} studentuid={initialValues.studentuid} eventuid={initialValues.eventuid}/>}
            </div>
          </Form>
        );
      }
      return content;
    }}
  </Formik>
);

const mapStateToProps = state => {return({
  school: state.firestore.data.school,
  schoolsList: state.firestore.data.schoolsList,
})};

export default compose(withSnackbar,connect(mapStateToProps),
firestoreConnect((props) => {return[
  {
      collection:'schools', doc:`${props.student.school_id}`, storeAs: 'school'
  },
  ]}),
)(editStudent);
