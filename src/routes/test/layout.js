import React, { Component } from 'react';
import {
  Button,
  Typography,
  Paper,
} from '@material-ui/core';
import { Link } from 'react-router-dom';


import AdminLayout from '../../hoc/Layout/AdminLayout';

export class Layout extends Component {
  render() {
    const action = (
      <React.Fragment>
        <Button
          type="button"
          variant="contained"
          color="secondary"
          component={Link}
          to="/auth/signup"
        >
          REGISTER
        </Button>
        <Button
          type="button"
          variant="contained"
          color="primary"
          component={Link}
          to="/"
        >
          LOGIN
        </Button>
      </React.Fragment>
    );

    return (
      <AdminLayout
        title="Some Title"
        subtitle="Some longer subtitle here"
        action={action}
      >
        <Paper style={{ minHeight: '1000px' }}>
          <Typography variant="h5" component="h3">
            This paper is just a sample.
          </Typography>
          <Typography component="p">
            Replace this area with cards, tables and etc. This is long to test scrolling.
          </Typography>
        </Paper>
      </AdminLayout>
    );
  }
}

export default Layout;
