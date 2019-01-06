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
  points: yup.number().positive().integer().required('Required'),
  action: yup.mixed()
    .singleSelectRequired('Required'),
});

const EditTeamPtsForm = ({
  history, enqueueSnackbar, teamRef, match
}) => (
  <Formik
    enableReinitialize={true}
    initialValues={{
      action: '',
      points: 0,
    }}
    validationSchema={validationSchema}
    onSubmit={(values, { setSubmitting }) => {
      // console.log(values);
      const now = new Date();
      const timestamp = now.getTime();
      
      teamRef.get().then((doc) => {
        const currentPoints = doc.data().credit;

        let newPoints = 0;
        if (values.action === 'add') {
          newPoints = currentPoints + values.points;
        } else if (values.action === 'subtract') {
          newPoints = currentPoints - values.points;
        }
        // update team points
        const updateValues = {
          credit: newPoints,
          modified_at: timestamp,
        };
        teamRef.update({ ...updateValues }).then(() => {
          enqueueSnackbar('Points successfully updated.', {
            variant: 'success',
          });
          history.push(`/events/${match.params.id}/Points`);
          console.log("Document successfully updated!");
        }).catch((error) => {
          // The document probably doesn't exist.
          enqueueSnackbar('Something went wrong. Points was not updated.', {
            variant: 'error',
          });
          console.error('Error updating document: ', error);
        }).finally(() => {
          setSubmitting(false);
        });

      }).catch((error) => {
        console.log('Error getting document:', error);
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
                to={`/events/${match.params.id}/volunteers`}
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
  /* eslint-disable react/forbid-prop-types */
  enqueueSnackbar: PropTypes.any.isRequired,
  history: PropTypes.any.isRequired,
  firebase: PropTypes.any.isRequired,
  firestore: PropTypes.any.isRequired,
  /* eslint-enable */
};

EditTeamPtsForm.defaultProps = {
};

export default compose(
  connect(mapStateToProps),
  withSnackbar,
  withRouter,
  withFirebase,
  withFirestore,
)(EditTeamPtsForm);
