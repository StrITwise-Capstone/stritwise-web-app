import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import {
  Paper,
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
import TablePaginationActions from './TablePaginationActions';
import { reactReduxFirebase } from 'react-redux-firebase';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
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

const TableView = ({
  classes,
  data,
  enableEdit,
  handleEdit,
  enableDelete,
  handleDelete,
  children,
  title,
  size,
  rowsPerPage,
  page,
  handleChangePage,
  handleChangeRowsPerPage,
  isLoading,
}) => {

  // convert the data into TableRows (dataContent)
  let dataContent = null;
  let dataHeader = null;
  if (isLoading) { // If still loading, table should show its loading
    dataContent = <CircularProgress /> ;
  } else if (data && data.length !== 0) { // populating dataContent if data exists

    dataHeader = Object.keys(data[0]).slice(1).map(header => (
      <CustomTableCell key={header}>{header}</CustomTableCell>
    ));
    dataContent = (data
      .map((row) => {
        const rowCopy = { ...row };
        return (
          <TableRow key={rowCopy.id}>
            {Object.keys(rowCopy).slice(1).map(key => (
              <CustomTableCell key={key}>{rowCopy[key]}</CustomTableCell>
            ))}
            {(enableEdit || enableDelete) ? (
              <CustomTableCell numeric>
                {enableEdit ? (
                  <IconButton
                    onClick={() => handleEdit(rowCopy.id)}
                    color="inherit"
                  >
                    <EditIcon />
                  </IconButton>
                ) : null}
                {enableDelete ? (
                  <IconButton
                    onClick={() => handleDelete(rowCopy.id)}
                    color="inherit"
                  >
                    <DeleteIcon />
                  </IconButton>
                ) : null}
              </CustomTableCell>
            ) : null}
          </TableRow>
        );
      }));
  } else if (!isLoading) {
    dataContent = (
      <p style={{textAlign: 'center'}}>There is no data at the moment.</p>
    );
  }

  // Generate the Table
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, dataContent.length);
  return (
    <React.Fragment>
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <TableToolbar
            title={title}
          >
            {children}
          </TableToolbar>
          <Table className={classes.table}>
            {dataContent.length >= 0 && dataHeader.length >= 0 ? (
              <React.Fragment>
                <TableHead>
                  <TableRow>
                    {dataHeader}
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
              </React.Fragment>
            ) : (
              <React.Fragment>
                <TableHead>
                  <TableRow>
                    <CustomTableCell key='errorHeader'/>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <CustomTableCell key='errorMsg'>
                      <React.Fragment>
                        {dataContent}
                      </React.Fragment>
                    </CustomTableCell>
                  </TableRow>
                </TableBody>
              </React.Fragment>
            )}
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
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
          />
        </div>
      </Paper>
    </React.Fragment>
  );
};

export default withRouter(withStyles(styles)(TableView));
