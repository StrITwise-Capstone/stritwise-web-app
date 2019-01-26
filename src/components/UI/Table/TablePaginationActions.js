import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
});

class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = (event) => {
    const { onChangePage } = this.props;
    onChangePage(event, 0);
  };

  handleBackButtonClick = (event) => {
    const { onChangePage, page } = this.props;
    onChangePage(event, page - 1);
  };

  handleNextButtonClick = (event) => {
    const { onChangePage,page } = this.props;
    onChangePage(event, page + 1);
  };

  handleLastPageButtonClick = (event) => {
    const { onChangePage, count, rowsPerPage } = this.props;
    onChangePage(
      event,
      Math.max(0, Math.ceil(count / rowsPerPage) - 1),
    );
  };

  render() {
    const {
      classes,
      count,
      page,
      rowsPerPage,
      theme,
    } = this.props;
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


export default withStyles(actionsStyles, { withTheme: true })(TablePaginationActions);