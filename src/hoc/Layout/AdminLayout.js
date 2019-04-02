import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import styles from './AdminLayout.styles';

/**
 * Admin Layout for the entire application.
 * @param {Component} children - Children of the page.
 * @param {string} title - Title of the page.
 * @param {string} subtitle - Subtitle of the page.
 * @param {Component} action - Action bar of the page. Actions buttons are recommended to be placed
 *  in this area
 */
class AdminLayout extends Component {
  render() {
    const {
      children,
      classes,
      title,
      subtitle,
      action,
    } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.header}>
          <div>
            <Typography variant="h4">{title}</Typography>
            <Typography variant="subtitle1">{subtitle}</Typography>
          </div>
          <div>
            {action}
          </div>
        </div>
        {children}
      </div>
    );
  }
}

AdminLayout.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  action: PropTypes.element,
  /* eslint-disable react/forbid-prop-types */
  children: PropTypes.any.isRequired,
  /* eslint-enable */
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
};

AdminLayout.defaultProps = {
  title: null,
  subtitle: null,
  action: null,
};

export default withStyles(styles)(AdminLayout);
