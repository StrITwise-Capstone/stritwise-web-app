import React from 'react';
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
import { firestoreConnect, isEmpty } from 'react-redux-firebase';
import TablePagination from '@material-ui/core/TablePagination';
import { Formik, Form, Field } from 'formik';

import * as Yup from 'yup';
import * as util from '../../../../helper/util';
import TablePaginationActions from './TablePaginationActions';
import TeamCard from '../Card/TeamCard';
import TextField from '../../../../components/UI/TextField/TextField';
import Select from '../../../../components/UI/Select/Select';

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

class cardList extends React.Component {
    state = {
      page: 0,
      lastVisible: null,
      firstVisible: null,
      isNotLoading: true,
      search: '',
    }

    handleChangePage = (event, page) => {
      const { firestore, eventuid } = this.props;
      const { lastVisible, firstVisible, search } = this.state;
      this.setState({ isNotLoading: false });
      const callback = (array, lastVisible, page, firstVisible) => {
        this.setState({
          teamsList: array,
          lastVisible,
          page,
          firstVisible,
          isNotLoading: true,
        });
      };
      var array = [];
      var first = null;
      if (page > this.state.page) {
        first = this.handleCustomFilter(firestore.collection('events').doc(eventuid).collection('teams'), search)
          .orderBy('team_name', 'asc')
          .limit(5)
          .startAfter(lastVisible);
        this.setState({ isNotLoading: false, teamsList: null });
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
          callback(array.reverse(), lastVisible, page, firstVisible);
        });
      }
      if (page < this.state.page) {
        first = this.handleCustomFilter(firestore.collection('events').doc(eventuid).collection('teams'), search)
          .orderBy('team_name', 'desc')
          .limit(5)
          .startAfter(firstVisible);
        this.setState({ isNotLoading: false, teamsList: null });
        first.get().then((documentSnapshots) => {
          var lastVisible = documentSnapshots.docs[0];
          var firstVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
          documentSnapshots.forEach((documentSnapshot) => {
            array.push({
              uid: documentSnapshot.id,
              data: documentSnapshot.data(),
            });
          });
          callback(array.reverse(), lastVisible, page, firstVisible);
        });
      }
    }

    getData = () => {
      const { firestore, eventuid } = this.props;
      const { search } = this.state;
      const callback = (array, lastVisible) => {
        this.setState({
          teamsList: array,
          lastVisible,
          page: 0,
          isNotLoading: true,
        });
      };
      var ref = this.handleCustomFilter(firestore.collection('events').doc(eventuid).collection('teams'), search);
      ref.get().then((documentSnapshots) => {
        this.setState({ teamsListCount: documentSnapshots.docs.length });
      });
      var array = [];
      var first = ref.orderBy('team_name').limit(5);
      this.setState({ isNotLoading: false, teamsList: null });
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
        this.setState({ isNotLoading: true });
        console.log(error);
      })
    }

    handleCustomFilter = (collection, search) => {
      const { teacherId } = this.props;
      // check if Filter has been changed
      if ( teacherId === '') {
        if (search === "") {
          return collection;
        } else {
          collection = collection.where('school_id', '==', search);
          return collection;
        }
      } else {
        collection = collection.where('teacher_id', '==', teacherId);
        return collection;
      }
    }

    componentDidMount = () => {
      this.getData();
      const { firestore } = this.props;
      this.setState({ isNotLoading: false });
      firestore.collection('schools').get().then((querySnapshot) => {
        const schools = [];
        schools.push({
          label: '',
          value: '',
        });
        querySnapshot.forEach((doc) => {
          schools.push({
            label: doc.data().name,
            value: doc.id,
          });
        });
        this.setState({ schools, isNotLoading: true });
      }).catch((error) => {
        console.log(error);
      });
    }

    render() {
      const {
        teamsList, isNotLoading, page, schools, teamsListCount,
      } = this.state;
      const {
        match, currentevent, teacherId,
      } = this.props;
      const defaultOptions =  [{ label : '' , value : ''}];
      return (
        <React.Fragment>
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
                      this.getData();
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
            { !isNotLoading && (
              <CircularProgress />)
            }
            { isNotLoading && isEmpty(teamsList) && (
              <Grid item>
                <Typography component="p">There is no data at the moment.</Typography>
              </Grid>
            )
            }
            {teamsList && isNotLoading
                  && Object.keys(teamsList).map( teamuid => (
                    <Grid item xs={6} key={teamuid} style={{ height: '100%' }}>
                      <TeamCard
                        teamuid={teamsList[teamuid].uid}
                        eventuid={match.params.id}
                        currentevent={currentevent}
                        update={() => { this.getData(); }}
                      />
                    </Grid>
                  ))
            }
          </Grid>
        </React.Fragment>
      );
    }
}

const mapStateToProps = (state) => {
  return {
    teamsListCount: state.firestore.data.teamsListCount,
  }
};

export default compose(withRouter, connect(mapStateToProps), firestoreConnect())(cardList);
