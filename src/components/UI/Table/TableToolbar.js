import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Toolbar,
} from '@material-ui/core';

const toolbarStyles = () => ({
  title: {
    flex: '1 1 auto',
  },
});

class TableToolbar extends Component {
  render() {
    const { classes, title, children } = this.props;
    return (
      <Toolbar>
        <div className={classes.title}>
          <Typography variant="h4" id="tableTitle">
            {title}
          </Typography>
        </div>
        <div>
          {children}
        </div>
      </Toolbar>
    );
  }
}


TableToolbar.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.shape({}).isRequired,
};

export default withStyles(toolbarStyles)(TableToolbar);
