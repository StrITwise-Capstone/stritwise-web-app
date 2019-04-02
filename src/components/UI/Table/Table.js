import React, { Component } from 'react';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { withFirestore } from 'react-redux-firebase';
import TableView from './TableView';
/**
 * Class representing the main Table component.
 * @param {Object} colRef - Collection referenece where data will be retrieved from.
 * @param {function} handleDocsList - Function that is invoked to map documents
 * to the intended format.
 * @param {boolean} enableEdit - Enable Edit button for each table row.
 * @param {function} handleEdit - Function that is invoked to perform update operation on the data.
 * @param {boolean} enableDelete - Enable Delete button for each table row.
 * @param {function} handleDelete - Function that is invoked to perform
 * delete operation on the data.
 * @param {function} handleCustomFilter - Function that is invoked to apply the filter to the
 * filterRef variable in state.
 * @param {string} filter - Filter option.
 * @param {string} search - Search value.
 * @param {Component} children - Children of the page: Filter Formik Form.
 */
class Table extends Component {
  state = {
    // List of Documents retrieved from Firestore
    docsList: [],
    // Firestore reference of the collection that documents are retrieved from.
    filterRef: null,
    // Size of the Firestore Snapshot
    filterSize: 0,
    // Table's current page
    page: 0,
    // Document limit for each page
    rowsPerPage: 5,
    // Last Visible Document
    lastVisible: null,
    // First Visible Document
    firstVisible: null,
    // Checks if retrieval of Table data is still running
    isLoading: true,
  }

  /**
   * Populates the filterRef variable in the state with colRef prop before
   * invoking getData() function.
   */
  componentWillMount() {
    const { colRef } = this.props;
    this.setState({ filterRef: colRef }, () => {
      this.getData();
    });
  }

  /**
   * Checks if props or state was changed before seting the page variable in the state to 0 and
   * invoking getData() function.
   */
  componentDidUpdate(prevProps) {
    const { filter, search } = this.props;
    if (filter !== prevProps.filter
      || search !== prevProps.search) {
      /* eslint-disable */
      this.setState({ page: 0 }, () => {
      /* eslint-enable */
        this.getData();
      });
    }
  }

  /**
   * Handles delete operation of data entry based on its Id.
   * @param {string} itemId - id of the document to be deleted
   */
  handleDelete = (itemId) => {
    const { handleDelete, enqueueSnackbar, firestore } = this.props;
    handleDelete(itemId).then((transactionRef) => {
      enqueueSnackbar('Deleting... It may take a few minutes.', {
        variant: 'success',
      });
      /* eslint-disable */
      this.setState({ page: 0 }, () => {
        /* eslint-enable */
        if (typeof (transactionRef) !== 'undefined') {
          firestore.collection('transactions').doc(transactionRef.id).onSnapshot((transaction) => {
            if (typeof (transaction.data().completed) !== 'undefined' && transaction.data().completed === true) {
              this.getData();
            }
          });
        } else {
          this.getData();
        }
      });
    }).catch((error) => {
      enqueueSnackbar('Error removing document:', {
        variant: 'error',
      });
      console.error('Error removing document: ', error);
    });
  }

  /**
   * Method that is called to retrieve data from database using filterRef variable in state.
   * @param {Object} startAfter - firestore document to start after
   * @param {number} chosenPage - new page that the table is at
   * @param {number} orderByDir - new page that the table is at
   */
  getData = (startAfter = null, chosenPage = null, orderByDir = 'asc') => {
    const { rowsPerPage, filterRef, page } = this.state;
    const { handleCustomFilter, filter, search } = this.props;
    let startAt = null;
    this.setState({ isLoading: true }, () => {
      let newRef = handleCustomFilter(filterRef, filter, search).orderBy('created_at', orderByDir);
      newRef.get().then((documentSnapshot) => {
        if (startAfter === null) {
          [startAt] = documentSnapshot.docs;
        }
        this.setState({ filterSize: documentSnapshot.size }, () => {
          if (startAt == null) {
            newRef = newRef.limit(rowsPerPage).startAfter(startAfter);
          } else {
            newRef = newRef.limit(rowsPerPage).startAt(startAt);
          }
          const docsList = [];
          newRef.get().then((snapWithLimit) => {
            // Get the last and first visible document
            let newLastVisible = null;
            let newFirstVisible = null;
            if (chosenPage < page) {
              [newLastVisible] = snapWithLimit.docs;
              newFirstVisible = snapWithLimit.docs[snapWithLimit.docs.length - 1];
            } else {
              newLastVisible = snapWithLimit.docs[snapWithLimit.docs.length - 1];
              [newFirstVisible] = snapWithLimit.docs;
            }
            snapWithLimit.forEach((doc) => {
              docsList.push({
                uid: doc.id,
                data: doc.data(),
              });
            });
            if (chosenPage === null) {
              this.setState({
                docsList, lastVisible: newLastVisible, firstVisible: newFirstVisible,
              });
            } else {
              if (chosenPage < page) {
                docsList.reverse();
              }
              this.setState({
                docsList,
                page: chosenPage,
                lastVisible: newLastVisible,
                firstVisible: newFirstVisible,
              });
            }
            this.setState({ isLoading: false });
          });
        });
      });
    });
  }

  /**
   * Function that is invoked when page is changed
   */
  handleChangePage = (event, chosenPage) => {
    console.log('handleChangePage() Called');
    const { lastVisible, firstVisible, page } = this.state;
    if (chosenPage > page) {
      this.getData(lastVisible, chosenPage, 'asc');
    } else if (chosenPage < page) {
      this.getData(firstVisible, chosenPage, 'desc');
    }
  }

  /**
   * Function that is invoked when document limit for each page is changed
   */
  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value }, () => {
      this.getData();
    });
  };

  render() {
    const {
      handleDocsList,
      enableEdit,
      handleEdit,
      enableDelete,
      children,
    } = this.props;

    const {
      page, rowsPerPage, filterSize, docsList, isLoading,
    } = this.state;
    return (
      <TableView
        // for Pagination
        page={page}
        rowsPerPage={rowsPerPage}
        size={filterSize}
        handleChangePage={this.handleChangePage}
        handleChangeRowsPerPage={this.handleChangeRowsPerPage}
        // For Table
        // title="Users"
        data={handleDocsList(docsList)}
        enableEdit={enableEdit}
        handleEdit={handleEdit}
        enableDelete={enableDelete}
        handleDelete={this.handleDelete}
        isLoading={isLoading} // Not used as of now
      >
        {children}
      </TableView>
    );
  }
}

Table.propTypes = {
  colRef: PropTypes.shape({}).isRequired,
  handleDocsList: PropTypes.func.isRequired,
  enableEdit: PropTypes.bool.isRequired,
  handleEdit: PropTypes.func,
  enableDelete: PropTypes.bool.isRequired,
  handleDelete: PropTypes.func,
  handleCustomFilter: PropTypes.func.isRequired,
  filter: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  children: PropTypes.shape({}).isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  firestore: PropTypes.shape({}).isRequired,
};

Table.defaultProps = {
  handleEdit: null,
  handleDelete: null,
};

export default withSnackbar(withFirestore(Table));
