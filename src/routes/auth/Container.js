import React from 'react';
import {
  Paper,
  Typography,
  Divider,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const container = (props) => {
  const { label, classes, children } = props;
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h4" className={classes.title}>{label}</Typography>
        <Divider />
        <div className={classes.form}>
          {children}
        </div>
      </Paper>
    </div>
  );
};

container.propTypes = {
  label: PropTypes.string.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  children: PropTypes.node.isRequired,
};

const styles = () => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '80vh',
  },
  paper: {
    width: '100%',
    maxWidth: '500px',
  },
  title: {
    textAlign: 'center',
    padding: '10px',
  },
  form: {
    margin: '10px',
  },
});

export default withStyles(styles)(container);
