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
  state = {
    anchorEl: null,
  };

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes, title, children} = this.props;
    const { anchorEl } = this.state;
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
        {/* <div>
          <Button variant="contained" size="small" color="primary" href="/addUser" style={{ display: 'inline-block' }}>
            Add User
          </Button>
          <div>
            <Button
              aria-owns={anchorEl ? 'simple-menu' : undefined}
              aria-haspopup="true"
              onClick={this.handleClick}
              size="small"
              color="primary"
              variant="contained"
              style={{ display: 'inline-block' }}
            >
              Filter By
            </Button>
            <Menu
              id="filterList"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.handleClose}
            >
              <MenuItem onClick={this.handleClose}>Name</MenuItem>
              <MenuItem onClick={this.handleClose}>School</MenuItem>
              <MenuItem onClick={this.handleClose}>Role</MenuItem>
            </Menu>
          </div>
        </div> */}

      </Toolbar>
    );
  }
}


TableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(toolbarStyles)(TableToolbar);
