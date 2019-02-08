import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import PropTypes from 'prop-types';

/**
 * Class representing the TablePaginationActions component.
 * @param {number} count - A number that represents the total number of data
 * @param {number} page - The current page
 * @param {object} theme - The theme for styling
 * @param {number} rowsPerPage - A number of the rows per page
 * @param {object} classes - The styling for TablePaginationActions component
*/
class TablePaginationActions extends Component {
  handleFirstPageButtonClick = event => {
    const { onChangePage } = this.props;
    onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    const { onChangePage, page } = this.props;
    onChangePage(event, page - 1);
  };

  handleNextButtonClick = event => {
    const { onChangePage, page } = this.props;
    onChangePage(event, page + 1);
  };

  handleLastPageButtonClick = event => {
    const { onChangePage, rowsPerPage, count } = this.props;
    onChangePage(
      event,
      Math.max(0, Math.ceil(count / rowsPerPage) - 1),
    );
  };

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;
    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
      </div>
    );
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  onChangePage: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.shape({}).isRequired,
};

export default TablePaginationActions;