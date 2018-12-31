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
    colRef: this.props.colRef,
    colSize: 0,
    filterRef: this.props.colRef,
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
      this.setState({ colSize: size, filterSize: size }, () => {
        this.getData();
      });
    });
  }

  componentWillReceiveProps = () => {
    console.log('hi');
    const { filter, search } = this.props;
    this.handleFilter(filter, search);
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

  handleFilter = (filter, search) => {
    const { colSize, rowsPerPage } = this.state;
    const { colRef } = this.props;
    let newRef = colRef;
    let newSize = colSize;

    // check if Filter has been changed
    if (filter === 'type') {
      console.log(filter, search);
      newRef = newRef.where(filter, '==', search.toLowerCase());
    }
    else if (filter === 'name') {
      const name = search.split(' ');
      console.log(name);
      if (name.length === 2) {
        newRef = newRef.where('firstName', '==', name[0])
          .where('lastName', '==', name[1]);
      } else {
        console.log("name is length one");
        newRef = newRef.where('firstName', '==', name[0]);
      }
    }

    const filterRef = newRef.orderBy('created_at', 'asc').limit(rowsPerPage);
    const docsList = [];
    filterRef.get().then((documentSnapshot) => {
      newSize = documentSnapshot.size;
      // Get the last visible document
      const lastVisible = documentSnapshot.docs[documentSnapshot.docs.length - 1];
      const firstVisible = documentSnapshot.docs[0];
      documentSnapshot.forEach((doc) => {
        docsList.push({
          uid: doc.id,
          data: doc.data(),
        });
      });
      console.log(docsList);
      this.setState({ docsList, lastVisible, firstVisible, filterRef: newRef, filterSize: newSize });
    });
  }

  render() {
    const {
      dataHeader,
      handleEdit,
      handleDelete,
      handleDocsList,
      children,
      filter, 
      search,
    } = this.props;

    const { page, rowsPerPage, filterSize, docsList, colRef, colSize } = this.state;
    let data = [];
    //console.log(this.state);
    if (docsList.length !== 0) {
      data = handleDocsList(docsList);
    }

    //console.log(this.state);

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
    );
  }
}

export default CustomTable;
