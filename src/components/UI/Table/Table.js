import React, { Component } from 'react';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';

import TableView from './TableView';

/*
Things to fix:
  - filter form should tell user if there are no search results 
    (only occurs when filtering from team Name)
  - 
*/

class CustomTable extends Component {
  state = {
    docsList: [],
    filterRef: null, //this.props.colRef,
    filterSize: 0,

    page: 0,
    rowsPerPage: 5,
    lastVisible: null,
    firstVisible: null,
    isLoading: true,
  }

  componentWillMount = () => {
    const { colRef } = this.props;
    this.setState({ filterRef: colRef }, () => {
      this.getData();
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { docList } = this.state;
    const { filter, search } = this.props;
    if (filter !== prevProps.filter || search !== prevProps.search || docList !== prevState.docList) {
      /* eslint-disable */
      this.setState({ page: 0 }, () => {
      /* eslint-enable */
        this.getData();
      });
    }
  }

  handleDelete = (itemId) => {
    const { handleDelete, enqueueSnackbar } = this.props;
    handleDelete(itemId).then(() => {
      enqueueSnackbar('Deleting... It may take a few minutes.', {
        variant: 'success',
      });
      /* eslint-disable */
      this.setState({ page: 0 }, () => {
        /* eslint-enable */
        this.getData();
      });
    }).catch((error) => {
      enqueueSnackbar('Error removing document:', {
        variant: 'error',
      });
      console.error('Error removing document: ', error);
    });
  }

  getData = (startAfter = null, chosenPage = null, orderByDir = 'asc') => {
    const { rowsPerPage, filterRef, page } = this.state;
    const { handleCustomFilter, filter, search } = this.props;
    let startAt = null;
    this.setState({ isLoading: true }, () => {
      let newRef = handleCustomFilter(filterRef, filter, search).orderBy('created_at', orderByDir);
      newRef.get().then((documentSnapshot) => {
        if (startAfter === null) {
          startAt = documentSnapshot.docs[0];
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
              newLastVisible = snapWithLimit.docs[0];
              newFirstVisible = snapWithLimit.docs[snapWithLimit.docs.length - 1];
            } else {
              newLastVisible = snapWithLimit.docs[snapWithLimit.docs.length - 1];
              newFirstVisible = snapWithLimit.docs[0];
            }
            snapWithLimit.forEach((doc) => {
              docsList.push({
                uid: doc.id,
                data: doc.data(),
              });
            });
            if (chosenPage === null) {
              this.setState({ docsList, lastVisible: newLastVisible, firstVisible: newFirstVisible });
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

  handleChangePage = (event, chosenPage) => {
    console.log('handleChangePage() Called');
    const { lastVisible, firstVisible, page } = this.state;
    if (chosenPage > page) {
      this.getData(lastVisible, chosenPage, 'asc');
    } else if (chosenPage < page) {
      this.getData(firstVisible, chosenPage, 'desc');
    }
  }


  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value }, () => {
      this.getData();
    });
  };

  render() {
    const {
      dataHeader,
      enableEdit,
      handleEdit,
      enableDelete,
      handleDocsList,
      children,
    } = this.props;

    const { page, rowsPerPage, filterSize, docsList, isLoading } = this.state;
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
        dataHeader={dataHeader}
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

CustomTable.propTypes = {
  colRef: PropTypes.shape({}).isRequired,
  filter: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  handleDelete: PropTypes.func,
  enqueueSnackbar: PropTypes.func.isRequired,
  handleCustomFilter: PropTypes.func.isRequired,
  dataHeader: PropTypes.shape({}),
  enableEdit: PropTypes.bool.isRequired,
  handleEdit: PropTypes.func.isRequired,
  enableDelete: PropTypes.bool.isRequired,
  handleDocsList: PropTypes.func.isRequired,
  children: PropTypes.shape({}).isRequired,
};

CustomTable.defaultProps = {
  dataHeader: undefined,
  handleDelete: null,
};

export default withSnackbar(CustomTable);
