import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Navbar from './Navbar/Navbar';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
  toolbar: theme.mixins.toolbar,
});


class App extends Component {
  render() {
    const { children, classes } = this.props;
    return (
      <div className={classes.root}>
        <Navbar/>
        <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
        </main>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node.isRequired,
};

export default withStyles(styles)(App);;
