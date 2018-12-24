import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import {
  Paper,
  Menu,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import TableToolbar from './TableToolbar';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 500,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

class CustomTable extends Component {

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {
    const {
      classes,
      data,
      dataHeader,
      handleEdit,
      handleDelete,
      children,
      title,
      size,
      rowsPerPage,
      page,
      handleChangeRowsPerPage,
    } = this.props;
    let content = <CircularProgress />;

    let dataContent = null;
    if (data) {
      dataContent = (data
        //.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((row) => {
          const rowCopy = { ...row };
          return (
            <TableRow key={rowCopy.id}>
              {Object.keys(rowCopy).slice(1).map(key => (
                <CustomTableCell>{rowCopy[key]}</CustomTableCell>
              ))}
              <CustomTableCell numeric>
                <IconButton
                  onClick={() => handleEdit(rowCopy.id)}
                  color="inherit"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDelete(rowCopy.id)}
                  color="inherit"
                >
                  <DeleteIcon />
                </IconButton>
              </CustomTableCell>
            </TableRow>
          );
        }));
    }


    if (data) {
      const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
      content = (
        <React.Fragment>
          <Paper className={classes.root}>
            <TableToolbar
              title={title}
            >
              {children}
            </TableToolbar>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  {dataHeader && dataHeader.map(header => (
                    <CustomTableCell>{header}</CustomTableCell>
                  ))}
                  <CustomTableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {dataContent}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 49 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={size}
              rowsPerPage={rowsPerPage}
              page={page}
              backIconButtonProps={{
                'aria-label': 'Previous Page',
              }}
              nextIconButtonProps={{
                'aria-label': 'Next Page',
              }}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Paper>
        </React.Fragment>
      );
    }
    return content;
  }
}

export default withRouter(withStyles(styles)(CustomTable));
