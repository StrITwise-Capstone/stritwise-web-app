import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { withRouter } from 'react-router';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import {
  Button,
  MenuItem,
  CircularProgress,
} from '@material-ui/core';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';

import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import * as util from '../../../helper/util';
import TextField from '../../../components/UI/TextField/TextField';
import Dropdown from '../../../components/UI/Dropdown/Dropdown';
import AdminLayout from '../../../hoc/Layout/AdminLayout';
import CustomTable from '../../../components/UI/Table/Table';
import Dialog from './ImportButton/Dialog';
import urlForDownloads from '../../../config/urlForDownloads';

/**
 * Class representing the Volunteers component.
 */
class Volunteers extends Component {
  state = {
    // Filter option.
    filter: 'all',
    // Search value.
    search: '',
    // Checks if retrieval of Table data is still running.
    isLoading: false,
  }

  /**
   * Function that is invoked to perform update operation on the data.
   */
  handleEdit = (volunteerID) => {
    const { history, match } = this.props;
    history.push(`/events/${match.params.eventId}/volunteers/${volunteerID}/edit`);
  }

  /**
   * Function that is invoked to perform delete operation on the data.
   */
  handleDelete = (volunteerId) => {
    const { firestore, match } = this.props;
    return firestore.collection('events').doc(match.params.eventId).collection('volunteers').doc(volunteerId).delete()
      .then(() => (console.log('Document is being deleted!')))
      .catch(error => (console.error('Error removing document: ', error)));
  }

  refreshState = () => {
    this.setState({isLoading: true});
    this.setState({isLoading: false});
  }

  /**
   * Function that is invoked to map documents to the intended format.
   */
  handleDocsList = (docsList) => {
    let data = [];
    const { teams } = this.props;
    if (!teams) {
      return null;
    }
    const teamsMap = teams.reduce((map, obj) => {
      // Disabled eslint error for performance reasons
      /* eslint no-param-reassign: "off" */
      map[obj.id] = obj.team_name;
      /* eslint-enable */
      return map;
    }, {});
    data = docsList.map(volunteer => (
      {
        id: volunteer.uid,
        Name: `${volunteer.data.first_name} ${volunteer.data.last_name}`,
        Mobile: volunteer.data.mobile,
        Type: volunteer.data.type,
        Team: teamsMap[volunteer.data.team_id] ? teamsMap[volunteer.data.team_id] : 'N.A.',
        School: volunteer.data.school,
        'Dietary Restrictions': volunteer.data.dietary_restriction ? volunteer.data.dietary_restriction : 'Nil',
        'Student Number': volunteer.data.student_no,
        Email: volunteer.data.email,
      }
    ));
    return data;
  }

  /**
   * Function that is invoked to apply the filter to the filterRef variable in state.
   */
  handleCustomFilter = (collection, filter, search) => {
    if (filter === 'type' || filter === 'school') {
      collection = collection.where(filter, '==', search);
    }
    return collection;
  }


  render() {
    const { firestore, match } = this.props;
    const { filter, search, isLoading } = this.state;
    const colRef = firestore.collection('events').doc(match.params.eventId).collection('volunteers');
    const action = (
      <div style={{ display: 'flex' }}>
        <Button
          type="button"
          variant="contained"
          color="secondary"
          component={Link}
          to={`/events/${match.params.eventId}/volunteers/create`}
        >
        Add Volunteer
        </Button>
        <Button
          type="button"
          variant="contained"
          color="secondary"
          href={urlForDownloads.volunteersTemplate}
        >
        Download Template
        </Button>
        <Dialog
          refreshState={this.refreshState}
          eventuid={match.params.eventId}
        />
      </div>
    );
    return (
      <AdminLayout
        title="Volunteers"
        // subtitle="Some longer subtitle here"
        action={action}
      >
        { isLoading && <CircularProgress /> }
        {!isLoading
        && (
        <CustomTable
          // For Table
          // title="Volunteers"
          colRef={colRef}
          handleDocsList={this.handleDocsList}
          enableEdit
          handleEdit={this.handleEdit}
          enableDelete
          handleDelete={this.handleDelete}
          handleCustomFilter={this.handleCustomFilter}
          filter={filter}
          search={search}
        >
          <div>
            <Formik
              enableReinitialize
              initialValues={{ search: '', filter: 'all' }}
              validationSchema={Yup.object({
                search: Yup.string(),
                filter: Yup.mixed()
                  .singleSelectRequired('Required'),
              })}
              onSubmit={(values, { setSubmitting }) => {
                this.setState({ search: values.search, filter: values.filter });
                setSubmitting(false);
              }}
            >
              {({
                errors,
                touched,
                handleSubmit,
                values,
              }) => (
                <Form onSubmit={handleSubmit}>
                  <div style={{ display: 'inline-block', minWidth: '200px', paddingRight: '5px' }}>
                    <Field
                      required
                      name="filter"
                      label="Filter"
                      component={Dropdown}
                    >
                      <MenuItem value="all">
                        <em>All</em>
                      </MenuItem>
                      <MenuItem value="type">Type</MenuItem>
                      <MenuItem value="school">School</MenuItem>
                    </Field>
                  </div>
                  {values.filter !== 'all' ? (
                    <div style={{ display: 'inline-block', minWidth: '200px', paddingRight: '5px' }}>
                      <Field
                        required
                        name="search"
                        label="Search"
                        type="text"
                        component={TextField}
                      />
                    </div>
                  ) : (
                    null
                  )}

                  <div style={{ display: 'inline-block', verticalAlign: 'bottom' }}>
                    <Button
                      type="submit"
                      variant="outlined"
                      color="primary"
                      disabled={util.isFormValid(errors, touched)}
                    >
                      Filter
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </CustomTable>)}
      </AdminLayout>
    );
  }
}

const mapStateToProps = state => ({
  teams: state.firestore.ordered.teams,
  auth: state.firebase.auth,
});


Volunteers.propTypes = {
  teams: PropTypes.arrayOf(PropTypes.shape({})),
  firestore: PropTypes.shape({}).isRequired,
  auth: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
};

Volunteers.defaultProps = {
  teams: [],
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => (
    [
      {
        collection: 'events', doc: `${props.match.params.eventId}`, subcollections: [{ collection: 'teams' }], storeAs: 'teams',
      },
    ]
  )),
  withRouter,
  withSnackbar,
)(Volunteers);
