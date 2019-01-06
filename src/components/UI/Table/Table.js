import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import {
  CircularProgress,
} from '@material-ui/core';

import TableView from './TableView';

class CustomTable extends Component {
  state = {
    docsList: [],
    filterRef: this.props.colRef,
    filterSize: 0,

    page: 0,
    rowsPerPage: 5,
    lastVisible: null,
    firstVisible: null,
    isLoading: false,
  }

  componentWillMount = () => {
    const { filterRef } = this.state;
    filterRef.get().then((snap) => {
      this.setState({ filterSize: snap.size }, () => {
        this.getData();
      });
    });
  }

  componentDidUpdate(prevProps) {
    const { filter, search } = this.props;
    if (filter !== prevProps.filter || search !== prevProps.search) {
      /* eslint-disable */
      this.setState({ page: 0 }, () => {
      /* eslint-enable */
        this.getData();
      });
    }
  }

  getData = (startAfter = null, chosenPage = null, orderByDir = 'asc') => {
    const { rowsPerPage, filterRef, page } = this.state;
    const { handleCustomFilter, filter, search } = this.props;
    let startAt = null;
    let newRef = handleCustomFilter(filterRef, filter, search).orderBy('created_at', orderByDir);
    newRef.get().then((documentSnapshot) => {
      if (startAfter === null) {
        startAt = documentSnapshot.docs[0];
      }
      this.setState({ filterSize: documentSnapshot.size }, () => {
        if (startAt === null) {
          newRef = newRef.limit(rowsPerPage).startAfter(startAfter);
        } else {
          newRef = newRef.limit(rowsPerPage).startAt(startAt);
        }

        const docsList = [];
        this.setState({ isLoading: true });
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
      handleDelete,
      handleDocsList,
      children,
    } = this.props;

    const { page, rowsPerPage, filterSize, docsList, isLoading } = this.state;
    let content = null;
    let data = [];

    data = handleDocsList(docsList);
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
        data={data}
        enableEdit={enableEdit}
        handleEdit={handleEdit}
        enableDelete={enableDelete}
        handleDelete={handleDelete}
        isLoading={isLoading} //Not used as of now
      >
        {children}
      </TableView>
    );
  }
}

export default CustomTable;
