import React from 'react';
import {
  Formik,
  Form,
  Field,
} from 'formik';
import {
  Button,
  MenuItem,
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
import Dropdown from '../../../../components/UI/Dropdown/Dropdown';
import yup from '../../../../instances/yup';

const validationSchema = yup.object({
  points: yup.number().positive().integer().required('Required').typeError('Invalid number format'),
  action: yup.mixed()
    .singleSelectRequired('Required'),
});

/**
 * Class representing the EditCrewForm component.
 * @param {Object} teamRef -  Document referenece of specific team.
 */

const EditTeamPtsForm = ({
  auth, enqueueSnackbar, teamRef, match,
}) => (
  <Formik
    enableReinitialize
    initialValues={{
      action: '',
      points: '',
    }}
    validationSchema={validationSchema}
    onSubmit={(values, { setSubmitting, resetForm }) => {
      // console.log(values);
      const now = new Date();
      let creditModified = 0;
      if (values.action === 'add') {
        creditModified = (values.points * 1);
      } else if (values.action === 'subtract') {
        creditModified = -(values.points * 1);
      }
      // update team points
      const addValues = {
        user_id: auth.uid,
        credit_modified: creditModified,
        created_at: now,
      };
      teamRef.collection('credit_transactions').add({ ...addValues }).then(() => {
        resetForm();
        enqueueSnackbar('Updating points... It may take a few seconds..', {
          variant: 'success',
        });
      }).catch((error) => {
        // The document probably doesn't exist.
        enqueueSnackbar('Something went wrong. Points was not updated.', {
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
              name="action"
              label="Action"
              component={Dropdown}
            >
              <MenuItem value="add">Add</MenuItem>
              <MenuItem value="subtract">Subtract</MenuItem>
            </Field>
            <Field
              required
              name="points"
              label="Points"
              type="text"
              component={TextField}
            />
            <div className="align-right">
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                component={Link}
                to={`/events/${match.params.eventId}/points`}
              >
                <ArrowBack />
                BACK TO POINTS
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

EditTeamPtsForm.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  auth: PropTypes.shape({}).isRequired,
  teamRef: PropTypes.shape({}),
  match: PropTypes.shape({}).isRequired,
};

EditTeamPtsForm.defaultProps = {
  teamRef: null,
};

export default compose(
  connect(mapStateToProps),
  withSnackbar,
  withRouter,
  withFirebase,
  withFirestore,
)(EditTeamPtsForm);
