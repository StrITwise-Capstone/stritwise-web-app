import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import {
  Grid,
  Paper,
  Button,
  CircularProgress,
  Typography,
  MenuItem,
} from '@material-ui/core';

import TableView from './TableView';

class CustomTable extends Component {
  state = {
    docsList: [],
    colRef: null,
    colSize: 0,
    filterRef: null,
    filterSize: 0,

    page: 0,
    rowsPerPage: 5,
    lastVisible: null,
    firstVisible: null,
  }

  componentWillMount = () => {
    const { firestore, colRef } = this.props;
    let size = 0;
    colRef.get().then((snap) => {
      size = snap.size; // will return the collection size
      this.setState({ colSize: size, filterSize: size, colRef, filterRef: colRef }, () => {
        console.log(this.state);
        this.getData();
      });
    });
  }

  getData = () => {
    const { rowsPerPage, filterRef } = this.state;
    const newRef = filterRef.orderBy('created_at', 'asc')
      .limit(rowsPerPage);
    const docsList = [];

    newRef.get().then((documentSnapshot) => {
      // Get the last and first visible document
      const lastVisible = documentSnapshot.docs[documentSnapshot.docs.length - 1];
      const firstVisible = documentSnapshot.docs[0];
      documentSnapshot.forEach((doc) => {
        docsList.push({
          uid: doc.id,
          data: doc.data(),
        });
      });
      this.setState({ docsList, lastVisible, firstVisible });
    });
  }

  handleChangePage = (event, chosenPage) => {
    const { firestore } = this.props;
    const { lastVisible, firstVisible, page, rowsPerPage, filterRef } = this.state;
    if (chosenPage > page) {
      const newRef = filterRef.orderBy('created_at', 'asc')
        .limit(rowsPerPage)
        .startAfter(lastVisible);
      const docsList = [];
      newRef.get().then((documentSnapshot) => {
        // Get the last and first visible document
        const lastVisible = documentSnapshot.docs[documentSnapshot.docs.length - 1];
        const firstVisible = documentSnapshot.docs[0];
        documentSnapshot.forEach((doc) => {
          docsList.push({
            uid: doc.id,
            data: doc.data(),
          });
        });
        this.setState({ docsList, lastVisible, page: chosenPage, firstVisible });
      });
    } else if (chosenPage < page) {
      const newRef = filterRef.orderBy('created_at', 'desc')
        .limit(rowsPerPage)
        .startAfter(firstVisible);
      const docsList = [];
      newRef.get().then((documentSnapshot) => {
        // Get the last and first visible document
        const lastVisible = documentSnapshot.docs[0];
        const firstVisible = documentSnapshot.docs[documentSnapshot.docs.length - 1];
        documentSnapshot.forEach((doc) => {
          docsList.push({
            uid: doc.id,
            data: doc.data(),
          });
        });
        docsList.reverse();
        this.setState({ docsList, lastVisible, page: chosenPage, firstVisible });
      });
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
      handleEdit,
      handleDelete,
      handleDocsList,
      children,
    } = this.props;

    const { page, rowsPerPage, filterSize, docsList } = this.state;

    let data = [];
    if (docsList.length !== 0) {
      data = handleDocsList(docsList);
    }

    console.log(this.state);

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
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      >
        {children}
      </TableView>
    )
  }
}

export default CustomTable;
