import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import styles from './AdminLayout.styles';

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
  classes: PropTypes.any.isRequired,
  /* eslint-enable */
};

AdminLayout.defaultProps = {
  title: null,
  subtitle: null,
  action: null,
};

export default withStyles(styles)(AdminLayout);
