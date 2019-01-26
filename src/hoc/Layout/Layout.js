import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

import Navbar from './Navbar/Navbar';
import EventLayout from './EventLayout/EventLayout';

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
    const {
      children,
      classes,
      location,
      match,
    } = this.props;
    return (
      <div className={classes.root}>
        <Navbar />
        <main className={classes.content}>
          <div className={classes.toolbar} />
          { location.pathname.includes('events/') && !(location.pathname.includes('events/create'))
            && !(location.pathname.match('events/:id/edit'))
            && (
            <EventLayout
              eventuid={match && match.params.id}
            >
              {children}
            </EventLayout>)
          }
          { (location.pathname.includes('events/create') || location.pathname.includes('events/:id/edit')) && children
          }
          { location.pathname.includes('events/') === false
            && children
          }
        </main>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.shape({}).isRequired,
  classes: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
};

export default compose(withStyles(styles), withRouter)(App);
