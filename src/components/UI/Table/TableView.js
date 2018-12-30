import React from 'react';
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

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
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
  dataHeader,
  handleEdit,
  handleDelete,
  children,
  title,
  size,
  rowsPerPage,
  page,
  handleChangePage,
  handleChangeRowsPerPage,
}) => {

  let content = <CircularProgress />;

  // convert the data into TableRows (dataContent)
  let dataContent = null;
  if (data) {
    dataContent = (data
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

  // Generate the Table
  if (dataContent) {
    // console.log(this.state);
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length);
    content = (
      <React.Fragment>
        <Paper className={classes.root}>
          <div className={classes.tableWrapper}>
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
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </div>
        </Paper>
      </React.Fragment>
    );
  }
  return content;
};

export default withRouter(withStyles(styles)(TableView));
