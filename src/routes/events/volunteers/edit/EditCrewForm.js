import React from 'react';
import {
  Formik,
  Form,
  Field,
} from 'formik';
import {
  Button,
  CircularProgress,
} from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withFirebase, withFirestore } from 'react-redux-firebase';
import { withSnackbar } from 'notistack';

import * as util from '../../../../helper/util';
import TextField from '../../../../components/UI/TextField/TextField';
import Select from '../../../../components/UI/Select/Select';
import yup from '../../../../instances/yup';

const validationSchema = yup.object({
  firstName: yup.string().required('Required'),
  lastName: yup.string().required('Required'),
  mobile: yup.number().moreThan(60000000, 'Enter a valid phone number')
    .lessThan(100000000, 'Enter a valid phone number')
    .required('Required'),
  team: yup.mixed()
    .singleSelectRequired('Required'),
  school: yup.string().required('Required'),
  studentNo: yup.string().required('Required'),
  dietary: yup.string(),

});

const EditCrewForm = ({
  history, enqueueSnackbar, volunteer, volunteerRef, match, teams
}) => (
  <Formik
    enableReinitialize={true}
    initialValues={{
      firstName: `${volunteer.firstName}`,
      lastName: `${volunteer.lastName}`,
      studentNo: `${volunteer.studentNo}`,
      mobile: `${volunteer.mobile}`,
      team: {
        label: `${volunteer.team.label}`,
        value: `${volunteer.team.value}`,
      },
      school: `${volunteer.school}`,
      dietary: `${volunteer.dietary}`,
    }}
    validationSchema={validationSchema}
    onSubmit={(values, { setSubmitting }) => {
      // console.log(values);
      const now = new Date();
      // update user values
      const updateValues = {
        first_name: values.firstName,
        last_name: values.lastName,
        initials: values.firstName[0] + values.lastName[0],
        mobile: values.mobile,
        modified_at: now,
        school: values.school,
        student_no: values.studentNo,
      };
      if (typeof (values.dietary) !== 'undefined') {
        updateValues.dietary_restriction = values.dietary;
      }
      if (typeof (volunteer.team.value) !== 'undefined' || volunteer.type === 'GL') {
        updateValues.team_id = values.team.value;
      }
      volunteerRef.update({ ...updateValues }).then(() => {
        enqueueSnackbar('Volunteer successfully updated.', {
          variant: 'success',
        });
        history.push(`/events/${match.params.id}/volunteers`);
        console.log('Document successfully updated!');
      }).catch((error) => {
        // The document probably doesn't exist.
        enqueueSnackbar('Something went wrong. User was not updated.', {
          variant: 'error',
        });
        console.error('Error updating document: ', error);
      }).finally(() => {
        setSubmitting(false);
      });
    }}
  >
    {({
      errors,
      touched,
      handleSubmit,
      isSubmitting,
    }) => {
      let content = <CircularProgress />;
      if (!isSubmitting) {
        content = (
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
            {typeof (volunteer.team.value) !== 'undefined' || volunteer.type === 'GL' ? (
              <Field
                name="team"
                label="Team"
                options={teams}
                component={Select}
              />
            ) : (null)}
            <Field
              required
              name="school"
              label="School"
              type="text"
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
                to={`/events/${match.params.id}/volunteers`}
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
                Save
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
  auth: state.firebase.auth,
});

EditCrewForm.propTypes = {
  school: PropTypes.string,
  /* eslint-disable react/forbid-prop-types */
  enqueueSnackbar: PropTypes.any.isRequired,
  history: PropTypes.any.isRequired,
  firebase: PropTypes.any.isRequired,
  firestore: PropTypes.any.isRequired,
  volunteer: PropTypes.any.isRequired,
  volunteerRef: PropTypes.any.isRequired,
  match: PropTypes.any.isRequired,
  /* eslint-enable */
};

EditCrewForm.defaultProps = {
  schools: '',
};

export default compose(
  connect(mapStateToProps),
  withSnackbar,
  withRouter,
  withFirebase,
  withFirestore,
)(EditCrewForm);
