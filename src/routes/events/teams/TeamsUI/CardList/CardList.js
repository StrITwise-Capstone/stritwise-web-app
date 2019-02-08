import React, { Component, Fragment } from 'react';
import {
  Grid,
  CircularProgress,
  Table,
  Button,
  Typography,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { firestoreConnect, isEmpty } from 'react-redux-firebase';
import TablePagination from '@material-ui/core/TablePagination';
import { Formik, Form, Field } from 'formik';

import * as Yup from 'yup';
import * as util from '../../../../../helper/util';
import TablePaginationActions from './TablePaginationActions';
import TeamCard from '../Card/TeamCard';
import TextField from '../../../../../components/UI/TextField/TextField';
import Select from '../../../../../components/UI/Select/Select';

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
});

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
  TablePaginationActions,
);

/**
 * Class representing the CardList component.
 * @param {Object} event - A specific event document
 * @param {teamId} teacherId - A string of the teacher Id
*/
class CardList extends Component {
  state = {
    page: 0,
    lastVisible: null,
    firstVisible: null,
    isLoading: true,
    search: '',
  }

  /**
   * Get the next five teams sorted by team_name
  */
  handleChangePage = (event, newPage) => {
    const { firestore, eventId } = this.props;
    const { lastVisible, firstVisible, search, page } = this.state;
    this.setState({ isLoading: true });
    const callback = (array, lastVisible, page, firstVisible) => {
      this.setState({
        teamsList: array,
        lastVisible,
        page,
        firstVisible,
        isLoading: false,
      });
    };
    var array = [];
    var first = null;
    if (newPage > page) {
      first = this.handleCustomFilter(firestore.collection('events').doc(eventId).collection('teams'), search)
        .orderBy('team_name', 'asc')
        .limit(5)
        .startAfter(lastVisible);
      this.setState({ isLoading: true, teamsList: null });
      first.get().then((documentSnapshots) => {
      // Get the last visible document
        const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
        const firstVisible = documentSnapshots.docs[0];
        documentSnapshots.forEach((documentSnapshot) => {
          array.push({
            uid: documentSnapshot.id,
            data: documentSnapshot.data(),
          });
        });
        callback(array.reverse(), lastVisible, newPage, firstVisible);
      });
    }
    if (newPage < page) {
      first = this.handleCustomFilter(firestore.collection('events').doc(eventId).collection('teams'), search)
        .orderBy('team_name', 'desc')
        .limit(5)
        .startAfter(firstVisible);
      this.setState({ isLoading: true, teamsList: null });
      first.get().then((documentSnapshots) => {
        var lastVisible = documentSnapshots.docs[0];
        var firstVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
        documentSnapshots.forEach((documentSnapshot) => {
          array.push({
            uid: documentSnapshot.id,
            data: documentSnapshot.data(),
          });
        });
        callback(array.reverse(), lastVisible, newPage, firstVisible);
      });
    }
  }

  /**
   * Get the first five teams sorted by team_name
   */
  getTeams = () => {
    const { firestore, eventId } = this.props;
    const { search } = this.state;
    const callback = (array, lastVisible) => {
      this.setState({
        teamsList: array,
        lastVisible,
        page: 0,
        isLoading: false,
      });
    };
    var ref = this.handleCustomFilter(firestore.collection('events').doc(eventId).collection('teams'), search);
    ref.get().then((documentSnapshots) => {
      this.setState({ teamsListCount: documentSnapshots.docs.length });
    });
    var array = [];
    var first = ref.orderBy('team_name').limit(5);
    this.setState({ isLoading: true, teamsList: null });
    first.get().then((documentSnapshots) => {
      var lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
      documentSnapshots.forEach((documentSnapshot) => {
        array.push({
          uid: documentSnapshot.id,
          data: documentSnapshot.data(),
        });
      });
      callback(array, lastVisible);
    }).catch((error) => {
      this.setState({ isLoading: false });
      console.log(error);
    })
  }

  /**
   * Add additional parameters to collection base on user type 
   * @returns {Object} The collection
  */
  handleCustomFilter = (collection, search) => {
    const { teacherId } = this.props;
    // check if Filter has been changed
    if (teacherId === '') {
      if (search === '') {
        return collection;
      } 
      collection = collection.where('school_id', '==', search);
      return collection;
    }
    collection = collection.where('teacher_id', '==', teacherId);
    return collection;
  }

  componentDidMount = () => {
    this.getTeams();
    this.getSchools();
  }
  
  /**
   * Get all the schools
   */
  getSchools = () => {
    const { firestore } = this.props;
    firestore.collection('schools').get().then((querySnapshot) => {
      const schools = [{ label: '', value: '' }];
      querySnapshot.forEach((doc) => {
        schools.push({
          label: doc.data().name,
          value: doc.id,
        });
      });
      this.setState({ schools });
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    const {
      teamsList, isLoading, page, schools, teamsListCount,
    } = this.state;
    const {
      event, teacherId,
    } = this.props;
    const defaultOptions =  [{ label : '' , value : ''}];
    return (
      <Fragment>
        <Table>
          <TableBody>
            <TableRow>
              { teacherId === '' &&
              (
              <TableCell style={{ float: 'left', fontWeight: 'normal !important'}}>
                <Formik
                  enableReinitialize
                  initialValues={{ search: '', filter: 'all' }}
                  validationSchema={Yup.object({
                    search: Yup.string()
                      .required('Required'),
                  })}
                  onSubmit={(values, { setSubmitting }) => {
                    this.setState({ search: values.search.value });
                    this.getTeams();
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
                      <div style={{ display: 'inline-block', minWidth: '200px', paddingRight: '6px'}}>
                        <Field
                          name="search"
                          label="School"
                          options={schools ? schools : defaultOptions}
                          component={Select}
                        />
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
              </TableCell>
              )}
              <TablePagination
                colSpan={3}
                rowsPerPageOptions={[5]}
                count={teamsListCount ? teamsListCount : 0}
                page={page}
                SelectProps={{
                  native: true,
                }}
                rowsPerPage={5}
                onChangePage={this.handleChangePage}
                ActionsComponent={TablePaginationActionsWrapped}
                style={{ float: 'right' }}
              />
            </TableRow>
          </TableBody>
        </Table>
        <div style={{ margin: '0 auto' }} />
        
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="flex-start"
          spacing={8}
        >
          { isLoading && (
            <CircularProgress />)
          }
          { !isLoading && isEmpty(teamsList) && (
            <Grid item>
              <Typography component="p">There is no data at the moment.</Typography>
            </Grid>
          )
          }
          {teamsList && !isLoading
                && Object.keys(teamsList).map( teamuid => (
                  <Grid item xs={6} key={teamuid} style={{ height: '100%' }}>
                    <TeamCard
                      teamId={teamsList[teamuid].uid}
                      event={event}
                      updatePage={() => { this.getTeams(); }}
                    />
                  </Grid>
                ))
          }
        </Grid>
      </Fragment>
    );
  }
}

CardList.propTypes = {
  eventId: PropTypes.string,
  event: PropTypes.shape({}),
  team: PropTypes.shape({}),
  teacherId: PropTypes.string,
  /* eslint-disable react/forbid-prop-types */
  firestore: PropTypes.any.isRequired,
  /* eslint-enable */
};

CardList.defaultProps = {
  team: null,
  event: null,
  eventId: null,
  teacherId: null,
};
const mapStateToProps = (state) => {
  return {
    teamsListCount: state.firestore.data.teamsListCount,
  }
};

export default compose(withRouter, connect(mapStateToProps), firestoreConnect())(CardList);
