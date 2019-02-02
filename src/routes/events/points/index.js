import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import {
  Button,
  MenuItem,
} from '@material-ui/core';
import PropTypes from 'prop-types';

import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import * as util from '../../../helper/util';
import TextField from '../../../components/UI/TextField/TextField';
import Dropdown from '../../../components/UI/Dropdown/Dropdown';
import AdminLayout from '../../../hoc/Layout/AdminLayout';
import CustomTable from '../../../components/UI/Table/Table';

class Points extends Component {
  state = {
    filter: 'all',
    search: '',
  }

  // if (!auth.uid) return <Redirect to="/auth/login" />
  handleEdit = (teamID) => {
    const { history, match } = this.props;
    history.push(`/events/${match.params.eventId}/points/${teamID}/edit`);
  }

  handleDocsList = (docsList) => {
    let data = [];
    const { schools } = this.props;
    if (!schools) {
      return null;
    }
    const schoolsMap = schools.reduce((map, obj) => {
      // Disabled eslint error for performance reasons
      /* eslint no-param-reassign: "off" */
      map[obj.id] = obj.name;
      /* eslint-enable */
      return map;
    }, {});
    data = docsList.map(team => (
      {
        id: team.uid,
        'Team Name': team.data.team_name,
        School: schoolsMap[team.data.school_id],
        Credits: team.data.credit,
      }
    ));
    return data;
  }

  action = () => {
    const { match } = this.props;
    return (
      <React.Fragment>
        <Button
          type="button"
          variant="contained"
          color="secondary"
          component={Link}
          to={`/events/${match.params.eventId}/pointsystem`}
        >
          Presentation View
        </Button>
      </React.Fragment>);
  }


  // Non-custom filter implmentation
  handleCustomFilter = (collection, filter, search) => {
    // check if Filter has been changed
    if (filter === 'name') {
      collection = collection.where('team_name', '==', search);
    } else if (filter === 'school') {
      const { schools } = this.props;
      const school = schools.find(schElement => (schElement.name === search));
      if (school !== undefined) {
        collection = collection.where('school_id', '==', school.id);
      } else {
        collection = collection.where('school_id', '==', '1');
      }
    }
    return collection;
  }


  render() {
    const { firestore, match } = this.props;
    const { filter, search } = this.state;
    const colRef = firestore.collection('events').doc(match.params.eventId).collection('teams');
    return (
      <AdminLayout
        title="Points"
        //subtitle="Some longer subtitle here"
        action={this.action()}
      >
        <CustomTable
          // For Table
          // title="Volunteers"
          colRef={colRef}
          handleDocsList={this.handleDocsList}
          enableEdit={true}
          handleEdit={this.handleEdit}
          enableDelete={false}
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
                      <MenuItem value="school">School</MenuItem>
                      <MenuItem value="name">Team Name</MenuItem>
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
        </CustomTable>
      </AdminLayout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    schools: state.firestore.ordered.schools,
    auth: state.firebase.auth,
  };
};


Points.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  match: PropTypes.any.isRequired,
  history: PropTypes.any.isRequired,
  firestore: PropTypes.any.isRequired,
  schools: PropTypes.any,
  /* eslint-enable */
};

Points.defaultProps = {
  schools: null,
};


export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    { collection: 'schools' },
  ]),
)(Points);
