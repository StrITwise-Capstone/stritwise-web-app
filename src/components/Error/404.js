import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  middle: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
  },
});

const notFound = (props) => {
  const { classes } = props;
  return (
    <div className={classes.middle}>
      <h1>Error 404.</h1>
      <p>The page requested is not found.</p>
    </div>
  );
};

notFound.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  classes: PropTypes.any.isRequired,
  /* eslint-enable */
};

export default withStyles(styles)(notFound);
